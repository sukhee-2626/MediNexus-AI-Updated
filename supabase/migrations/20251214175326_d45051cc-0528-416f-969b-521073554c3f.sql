-- Create enum types for the application
CREATE TYPE public.app_role AS ENUM ('admin', 'provider', 'patient', 'health_official');
CREATE TYPE public.record_type AS ENUM ('consultation', 'lab_result', 'prescription', 'imaging', 'vaccination', 'vital_signs', 'diagnosis');
CREATE TYPE public.consent_status AS ENUM ('active', 'revoked', 'expired');
CREATE TYPE public.access_level AS ENUM ('read', 'write', 'full');

-- Create profiles table for all users
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT,
  avatar_url TEXT,
  organization TEXT,
  specialization TEXT,
  license_number TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_roles table (separate from profiles for security)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'patient',
  granted_by UUID REFERENCES auth.users(id),
  granted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Create patients table
CREATE TABLE public.patients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  patient_did TEXT UNIQUE,
  full_name TEXT NOT NULL,
  date_of_birth DATE NOT NULL,
  gender TEXT,
  blood_type TEXT,
  phone TEXT,
  email TEXT,
  address TEXT,
  emergency_contact_name TEXT,
  emergency_contact_phone TEXT,
  allergies TEXT[],
  chronic_conditions TEXT[],
  registered_by UUID REFERENCES auth.users(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create medical_records table
CREATE TABLE public.medical_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
  record_type record_type NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  diagnosis TEXT,
  treatment TEXT,
  medications JSONB,
  vital_signs JSONB,
  attachments TEXT[],
  blockchain_hash TEXT,
  created_by UUID REFERENCES auth.users(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create consent_grants table for patient-controlled access
CREATE TABLE public.consent_grants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
  granted_to UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  access_level access_level NOT NULL DEFAULT 'read',
  status consent_status NOT NULL DEFAULT 'active',
  purpose TEXT,
  expires_at TIMESTAMP WITH TIME ZONE,
  granted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  revoked_at TIMESTAMP WITH TIME ZONE,
  UNIQUE (patient_id, granted_to)
);

-- Create ai_diagnostics table
CREATE TABLE public.ai_diagnostics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
  medical_record_id UUID REFERENCES public.medical_records(id) ON DELETE SET NULL,
  symptoms TEXT[] NOT NULL,
  ai_model TEXT NOT NULL DEFAULT 'google/gemini-2.5-flash',
  differential_diagnoses JSONB,
  recommendations TEXT,
  confidence_scores JSONB,
  requested_by UUID REFERENCES auth.users(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create activity_logs table for audit trail
CREATE TABLE public.activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  details JSONB,
  ip_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medical_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consent_grants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_diagnostics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- Security definer function to check user roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Function to check if user has consent to access patient data
CREATE OR REPLACE FUNCTION public.has_patient_consent(_user_id UUID, _patient_id UUID, _required_level access_level DEFAULT 'read')
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.consent_grants
    WHERE patient_id = _patient_id
      AND granted_to = _user_id
      AND status = 'active'
      AND (expires_at IS NULL OR expires_at > now())
      AND (
        access_level = 'full' 
        OR access_level = _required_level
        OR (_required_level = 'read' AND access_level IN ('read', 'write', 'full'))
      )
  )
$$;

-- Function to check if user is the patient themselves
CREATE OR REPLACE FUNCTION public.is_patient_user(_user_id UUID, _patient_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.patients
    WHERE id = _patient_id
      AND user_id = _user_id
  )
$$;

-- Profiles RLS Policies
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Providers can view other profiles"
  ON public.profiles FOR SELECT
  USING (public.has_role(auth.uid(), 'provider') OR public.has_role(auth.uid(), 'admin'));

-- User Roles RLS Policies
CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all roles"
  ON public.user_roles FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Patients RLS Policies
CREATE POLICY "Providers can view patients they registered"
  ON public.patients FOR SELECT
  USING (
    registered_by = auth.uid()
    OR public.has_role(auth.uid(), 'admin')
    OR public.has_patient_consent(auth.uid(), id)
  );

CREATE POLICY "Patients can view their own record"
  ON public.patients FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Providers can register patients"
  ON public.patients FOR INSERT
  WITH CHECK (
    public.has_role(auth.uid(), 'provider') 
    OR public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Providers can update patients they have consent for"
  ON public.patients FOR UPDATE
  USING (
    registered_by = auth.uid()
    OR public.has_role(auth.uid(), 'admin')
    OR public.has_patient_consent(auth.uid(), id, 'write')
  );

-- Medical Records RLS Policies
CREATE POLICY "Providers can view records with consent"
  ON public.medical_records FOR SELECT
  USING (
    created_by = auth.uid()
    OR public.has_role(auth.uid(), 'admin')
    OR public.has_patient_consent(auth.uid(), patient_id)
    OR public.is_patient_user(auth.uid(), patient_id)
  );

CREATE POLICY "Providers can create records for patients with consent"
  ON public.medical_records FOR INSERT
  WITH CHECK (
    (public.has_role(auth.uid(), 'provider') OR public.has_role(auth.uid(), 'admin'))
    AND (
      public.has_patient_consent(auth.uid(), patient_id, 'write')
      OR EXISTS (SELECT 1 FROM public.patients WHERE id = patient_id AND registered_by = auth.uid())
    )
  );

CREATE POLICY "Providers can update their own records"
  ON public.medical_records FOR UPDATE
  USING (created_by = auth.uid() OR public.has_role(auth.uid(), 'admin'));

-- Consent Grants RLS Policies
CREATE POLICY "Patients can view their consent grants"
  ON public.consent_grants FOR SELECT
  USING (
    public.is_patient_user(auth.uid(), patient_id)
    OR granted_to = auth.uid()
    OR public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Patients can manage their own consents"
  ON public.consent_grants FOR INSERT
  WITH CHECK (public.is_patient_user(auth.uid(), patient_id));

CREATE POLICY "Patients can update their own consents"
  ON public.consent_grants FOR UPDATE
  USING (public.is_patient_user(auth.uid(), patient_id));

CREATE POLICY "Patients can revoke consents"
  ON public.consent_grants FOR DELETE
  USING (public.is_patient_user(auth.uid(), patient_id));

-- AI Diagnostics RLS Policies
CREATE POLICY "Providers can view AI diagnostics they requested"
  ON public.ai_diagnostics FOR SELECT
  USING (
    requested_by = auth.uid()
    OR public.has_role(auth.uid(), 'admin')
    OR public.has_patient_consent(auth.uid(), patient_id)
    OR public.is_patient_user(auth.uid(), patient_id)
  );

CREATE POLICY "Providers can create AI diagnostics"
  ON public.ai_diagnostics FOR INSERT
  WITH CHECK (
    public.has_role(auth.uid(), 'provider')
    OR public.has_role(auth.uid(), 'admin')
  );

-- Activity Logs RLS Policies
CREATE POLICY "Users can view their own activity"
  ON public.activity_logs FOR SELECT
  USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "System can insert activity logs"
  ON public.activity_logs FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- Create indexes for performance
CREATE INDEX idx_patients_registered_by ON public.patients(registered_by);
CREATE INDEX idx_patients_user_id ON public.patients(user_id);
CREATE INDEX idx_medical_records_patient_id ON public.medical_records(patient_id);
CREATE INDEX idx_medical_records_created_by ON public.medical_records(created_by);
CREATE INDEX idx_consent_grants_patient_id ON public.consent_grants(patient_id);
CREATE INDEX idx_consent_grants_granted_to ON public.consent_grants(granted_to);
CREATE INDEX idx_ai_diagnostics_patient_id ON public.ai_diagnostics(patient_id);
CREATE INDEX idx_activity_logs_user_id ON public.activity_logs(user_id);
CREATE INDEX idx_user_roles_user_id ON public.user_roles(user_id);

-- Create function to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_patients_updated_at
  BEFORE UPDATE ON public.patients
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_medical_records_updated_at
  BEFORE UPDATE ON public.medical_records
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Function to create profile and default role on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.email)
  );
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'provider');
  
  RETURN NEW;
END;
$$;

-- Trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();