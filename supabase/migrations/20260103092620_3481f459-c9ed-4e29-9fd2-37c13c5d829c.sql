-- Enable replica identity for realtime updates on patients table
ALTER TABLE public.patients REPLICA IDENTITY FULL;

-- Add patients table to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.patients;

-- Also enable for medical_records for future use
ALTER TABLE public.medical_records REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.medical_records;

-- Also enable for consent_grants for future use
ALTER TABLE public.consent_grants REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.consent_grants;