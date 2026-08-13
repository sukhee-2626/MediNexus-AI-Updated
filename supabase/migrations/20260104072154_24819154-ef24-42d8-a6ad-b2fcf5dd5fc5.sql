
-- Create appointments table for appointment requests
CREATE TABLE public.appointments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  provider_id UUID NOT NULL,
  appointment_type TEXT NOT NULL,
  preferred_date DATE NOT NULL,
  preferred_time TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create prescription refill requests table
CREATE TABLE public.refill_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  medical_record_id UUID REFERENCES public.medical_records(id),
  medication_name TEXT NOT NULL,
  dosage TEXT,
  urgency TEXT NOT NULL DEFAULT 'normal' CHECK (urgency IN ('normal', 'urgent')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'denied', 'fulfilled')),
  provider_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create messages table for doctor-patient communication
CREATE TABLE public.messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL,
  sender_type TEXT NOT NULL CHECK (sender_type IN ('patient', 'provider')),
  subject TEXT NOT NULL,
  content TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create health alerts table for AI predictions
CREATE TABLE public.health_alerts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  alert_type TEXT NOT NULL,
  severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  recommendations TEXT,
  is_dismissed BOOLEAN NOT NULL DEFAULT false,
  generated_by TEXT DEFAULT 'ai',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all new tables
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.refill_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.health_alerts ENABLE ROW LEVEL SECURITY;

-- Appointments policies
CREATE POLICY "Patients can view their own appointments"
ON public.appointments FOR SELECT
USING (is_patient_user(auth.uid(), patient_id));

CREATE POLICY "Patients can create appointment requests"
ON public.appointments FOR INSERT
WITH CHECK (is_patient_user(auth.uid(), patient_id));

CREATE POLICY "Providers can view appointments they manage"
ON public.appointments FOR SELECT
USING (provider_id = auth.uid() OR has_role(auth.uid(), 'provider') OR has_role(auth.uid(), 'admin'));

CREATE POLICY "Providers can update appointments"
ON public.appointments FOR UPDATE
USING (provider_id = auth.uid() OR has_role(auth.uid(), 'admin'));

-- Refill requests policies
CREATE POLICY "Patients can view their own refill requests"
ON public.refill_requests FOR SELECT
USING (is_patient_user(auth.uid(), patient_id));

CREATE POLICY "Patients can create refill requests"
ON public.refill_requests FOR INSERT
WITH CHECK (is_patient_user(auth.uid(), patient_id));

CREATE POLICY "Providers can view refill requests"
ON public.refill_requests FOR SELECT
USING (has_role(auth.uid(), 'provider') OR has_role(auth.uid(), 'admin'));

CREATE POLICY "Providers can update refill requests"
ON public.refill_requests FOR UPDATE
USING (has_role(auth.uid(), 'provider') OR has_role(auth.uid(), 'admin'));

-- Messages policies
CREATE POLICY "Patients can view their own messages"
ON public.messages FOR SELECT
USING (is_patient_user(auth.uid(), patient_id));

CREATE POLICY "Patients can send messages"
ON public.messages FOR INSERT
WITH CHECK (is_patient_user(auth.uid(), patient_id) AND sender_type = 'patient');

CREATE POLICY "Providers can view patient messages with consent"
ON public.messages FOR SELECT
USING (has_role(auth.uid(), 'provider') OR has_role(auth.uid(), 'admin'));

CREATE POLICY "Providers can send messages"
ON public.messages FOR INSERT
WITH CHECK ((has_role(auth.uid(), 'provider') OR has_role(auth.uid(), 'admin')) AND sender_type = 'provider');

CREATE POLICY "Providers can update message read status"
ON public.messages FOR UPDATE
USING (has_role(auth.uid(), 'provider') OR has_role(auth.uid(), 'admin'));

-- Health alerts policies
CREATE POLICY "Patients can view their own health alerts"
ON public.health_alerts FOR SELECT
USING (is_patient_user(auth.uid(), patient_id));

CREATE POLICY "Patients can dismiss their alerts"
ON public.health_alerts FOR UPDATE
USING (is_patient_user(auth.uid(), patient_id));

CREATE POLICY "Providers can view patient health alerts"
ON public.health_alerts FOR SELECT
USING (has_role(auth.uid(), 'provider') OR has_role(auth.uid(), 'admin'));

CREATE POLICY "System can create health alerts"
ON public.health_alerts FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

-- Enable realtime for messages
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.appointments;
ALTER PUBLICATION supabase_realtime ADD TABLE public.refill_requests;
ALTER PUBLICATION supabase_realtime ADD TABLE public.health_alerts;

-- Add triggers for updated_at
CREATE TRIGGER update_appointments_updated_at
BEFORE UPDATE ON public.appointments
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_refill_requests_updated_at
BEFORE UPDATE ON public.refill_requests
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
