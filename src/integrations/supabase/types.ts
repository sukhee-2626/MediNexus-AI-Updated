export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      activity_logs: {
        Row: {
          action: string
          created_at: string
          details: Json | null
          entity_id: string | null
          entity_type: string
          id: string
          ip_address: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          details?: Json | null
          entity_id?: string | null
          entity_type: string
          id?: string
          ip_address?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          details?: Json | null
          entity_id?: string | null
          entity_type?: string
          id?: string
          ip_address?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      ai_diagnostics: {
        Row: {
          ai_model: string
          confidence_scores: Json | null
          created_at: string
          differential_diagnoses: Json | null
          id: string
          medical_record_id: string | null
          patient_id: string
          recommendations: string | null
          requested_by: string
          symptoms: string[]
        }
        Insert: {
          ai_model?: string
          confidence_scores?: Json | null
          created_at?: string
          differential_diagnoses?: Json | null
          id?: string
          medical_record_id?: string | null
          patient_id: string
          recommendations?: string | null
          requested_by: string
          symptoms: string[]
        }
        Update: {
          ai_model?: string
          confidence_scores?: Json | null
          created_at?: string
          differential_diagnoses?: Json | null
          id?: string
          medical_record_id?: string | null
          patient_id?: string
          recommendations?: string | null
          requested_by?: string
          symptoms?: string[]
        }
        Relationships: [
          {
            foreignKeyName: "ai_diagnostics_medical_record_id_fkey"
            columns: ["medical_record_id"]
            isOneToOne: false
            referencedRelation: "medical_records"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_diagnostics_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      appointments: {
        Row: {
          appointment_type: string
          created_at: string
          id: string
          notes: string | null
          patient_id: string
          preferred_date: string
          preferred_time: string | null
          provider_id: string
          status: string
          updated_at: string
        }
        Insert: {
          appointment_type: string
          created_at?: string
          id?: string
          notes?: string | null
          patient_id: string
          preferred_date: string
          preferred_time?: string | null
          provider_id: string
          status?: string
          updated_at?: string
        }
        Update: {
          appointment_type?: string
          created_at?: string
          id?: string
          notes?: string | null
          patient_id?: string
          preferred_date?: string
          preferred_time?: string | null
          provider_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "appointments_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      consent_grants: {
        Row: {
          access_level: Database["public"]["Enums"]["access_level"]
          expires_at: string | null
          granted_at: string
          granted_to: string
          id: string
          patient_id: string
          purpose: string | null
          revoked_at: string | null
          status: Database["public"]["Enums"]["consent_status"]
        }
        Insert: {
          access_level?: Database["public"]["Enums"]["access_level"]
          expires_at?: string | null
          granted_at?: string
          granted_to: string
          id?: string
          patient_id: string
          purpose?: string | null
          revoked_at?: string | null
          status?: Database["public"]["Enums"]["consent_status"]
        }
        Update: {
          access_level?: Database["public"]["Enums"]["access_level"]
          expires_at?: string | null
          granted_at?: string
          granted_to?: string
          id?: string
          patient_id?: string
          purpose?: string | null
          revoked_at?: string | null
          status?: Database["public"]["Enums"]["consent_status"]
        }
        Relationships: [
          {
            foreignKeyName: "consent_grants_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      health_alerts: {
        Row: {
          alert_type: string
          created_at: string
          description: string
          generated_by: string | null
          id: string
          is_dismissed: boolean
          patient_id: string
          recommendations: string | null
          severity: string
          title: string
        }
        Insert: {
          alert_type: string
          created_at?: string
          description: string
          generated_by?: string | null
          id?: string
          is_dismissed?: boolean
          patient_id: string
          recommendations?: string | null
          severity: string
          title: string
        }
        Update: {
          alert_type?: string
          created_at?: string
          description?: string
          generated_by?: string | null
          id?: string
          is_dismissed?: boolean
          patient_id?: string
          recommendations?: string | null
          severity?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "health_alerts_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      medical_records: {
        Row: {
          attachments: string[] | null
          blockchain_hash: string | null
          created_at: string
          created_by: string
          description: string | null
          diagnosis: string | null
          id: string
          medications: Json | null
          patient_id: string
          record_type: Database["public"]["Enums"]["record_type"]
          title: string
          treatment: string | null
          updated_at: string
          vital_signs: Json | null
        }
        Insert: {
          attachments?: string[] | null
          blockchain_hash?: string | null
          created_at?: string
          created_by: string
          description?: string | null
          diagnosis?: string | null
          id?: string
          medications?: Json | null
          patient_id: string
          record_type: Database["public"]["Enums"]["record_type"]
          title: string
          treatment?: string | null
          updated_at?: string
          vital_signs?: Json | null
        }
        Update: {
          attachments?: string[] | null
          blockchain_hash?: string | null
          created_at?: string
          created_by?: string
          description?: string | null
          diagnosis?: string | null
          id?: string
          medications?: Json | null
          patient_id?: string
          record_type?: Database["public"]["Enums"]["record_type"]
          title?: string
          treatment?: string | null
          updated_at?: string
          vital_signs?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "medical_records_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string
          created_at: string
          id: string
          is_read: boolean
          patient_id: string
          sender_id: string
          sender_type: string
          subject: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          is_read?: boolean
          patient_id: string
          sender_id: string
          sender_type: string
          subject: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          is_read?: boolean
          patient_id?: string
          sender_id?: string
          sender_type?: string
          subject?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      patients: {
        Row: {
          address: string | null
          allergies: string[] | null
          blood_type: string | null
          chronic_conditions: string[] | null
          created_at: string
          date_of_birth: string
          email: string | null
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          full_name: string
          gender: string | null
          id: string
          patient_did: string | null
          phone: string | null
          registered_by: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          address?: string | null
          allergies?: string[] | null
          blood_type?: string | null
          chronic_conditions?: string[] | null
          created_at?: string
          date_of_birth: string
          email?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          full_name: string
          gender?: string | null
          id?: string
          patient_did?: string | null
          phone?: string | null
          registered_by: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          address?: string | null
          allergies?: string[] | null
          blood_type?: string | null
          chronic_conditions?: string[] | null
          created_at?: string
          date_of_birth?: string
          email?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          full_name?: string
          gender?: string | null
          id?: string
          patient_did?: string | null
          phone?: string | null
          registered_by?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string
          full_name: string
          id: string
          license_number: string | null
          organization: string | null
          phone: string | null
          specialization: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email: string
          full_name: string
          id?: string
          license_number?: string | null
          organization?: string | null
          phone?: string | null
          specialization?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          license_number?: string | null
          organization?: string | null
          phone?: string | null
          specialization?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      refill_requests: {
        Row: {
          created_at: string
          dosage: string | null
          id: string
          medical_record_id: string | null
          medication_name: string
          patient_id: string
          provider_notes: string | null
          status: string
          updated_at: string
          urgency: string
        }
        Insert: {
          created_at?: string
          dosage?: string | null
          id?: string
          medical_record_id?: string | null
          medication_name: string
          patient_id: string
          provider_notes?: string | null
          status?: string
          updated_at?: string
          urgency?: string
        }
        Update: {
          created_at?: string
          dosage?: string | null
          id?: string
          medical_record_id?: string | null
          medication_name?: string
          patient_id?: string
          provider_notes?: string | null
          status?: string
          updated_at?: string
          urgency?: string
        }
        Relationships: [
          {
            foreignKeyName: "refill_requests_medical_record_id_fkey"
            columns: ["medical_record_id"]
            isOneToOne: false
            referencedRelation: "medical_records"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "refill_requests_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          granted_at: string
          granted_by: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          granted_at?: string
          granted_by?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          granted_at?: string
          granted_by?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_patient_consent: {
        Args: {
          _patient_id: string
          _required_level?: Database["public"]["Enums"]["access_level"]
          _user_id: string
        }
        Returns: boolean
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_patient_user: {
        Args: { _patient_id: string; _user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      access_level: "read" | "write" | "full"
      app_role: "admin" | "provider" | "patient" | "health_official"
      consent_status: "active" | "revoked" | "expired"
      record_type:
        | "consultation"
        | "lab_result"
        | "prescription"
        | "imaging"
        | "vaccination"
        | "vital_signs"
        | "diagnosis"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      access_level: ["read", "write", "full"],
      app_role: ["admin", "provider", "patient", "health_official"],
      consent_status: ["active", "revoked", "expired"],
      record_type: [
        "consultation",
        "lab_result",
        "prescription",
        "imaging",
        "vaccination",
        "vital_signs",
        "diagnosis",
      ],
    },
  },
} as const
