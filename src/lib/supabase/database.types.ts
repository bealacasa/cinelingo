// Escrito a mano siguiendo el formato de `supabase gen types`. Regenerar con `npm run db:types`
// en cuanto el proyecto esté enlazado, y no editar después.

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

type CefrLevel = "B2" | "C1" | "C2";
type ContentStatus = "draft" | "review" | "published";
type EnglishVariety = "us" | "uk" | "au" | "ie" | "ca" | "other";
type ExerciseType = "gap_fill" | "meaning_mcq" | "register_rewrite" | "who_said_it";
type ExpressionType =
  | "phrasal_verb"
  | "idiom"
  | "collocation"
  | "slang"
  | "discourse_marker"
  | "grammar"
  | "other";
type Register = "formal" | "neutral" | "informal" | "slang";
type UserRole = "user" | "admin";
type WorkType = "film" | "series";

export type Database = {
  __InternalSupabase: { PostgrestVersion: "13" };
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          display_name: string | null;
          role: UserRole;
          target_level: CefrLevel;
          timezone: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          display_name?: string | null;
          role?: UserRole;
          target_level?: CefrLevel;
          timezone?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          display_name?: string | null;
          target_level?: CefrLevel;
          timezone?: string;
        };
        Relationships: [];
      };
      works: {
        Row: { id: string; title: string; type: WorkType; year: number; created_at: string };
        Insert: { id?: string; title: string; type: WorkType; year: number; created_at?: string };
        Update: { id?: string; title?: string; type?: WorkType; year?: number; created_at?: string };
        Relationships: [];
      };
      quotes: {
        Row: {
          id: string;
          work_id: string;
          text: string;
          character_name: string;
          season: number | null;
          episode: number | null;
          scene_context_es: string;
          translation_es: string;
          cultural_note_es: string | null;
          level: CefrLevel;
          variety: EnglishVariety;
          status: ContentStatus;
          reviewed_at: string | null;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          work_id: string;
          text: string;
          character_name: string;
          season?: number | null;
          episode?: number | null;
          scene_context_es: string;
          translation_es: string;
          cultural_note_es?: string | null;
          level?: CefrLevel;
          variety?: EnglishVariety;
          status?: ContentStatus;
          reviewed_at?: string | null;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["quotes"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "quotes_work_id_fkey";
            columns: ["work_id"];
            isOneToOne: false;
            referencedRelation: "works";
            referencedColumns: ["id"];
          },
        ];
      };
      expressions: {
        Row: {
          id: string;
          phrase: string;
          type: ExpressionType;
          register: Register;
          meaning_en: string;
          meaning_es: string;
          note_es: string | null;
          level: CefrLevel;
          created_at: string;
        };
        Insert: {
          id?: string;
          phrase: string;
          type: ExpressionType;
          register: Register;
          meaning_en: string;
          meaning_es: string;
          note_es?: string | null;
          level?: CefrLevel;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["expressions"]["Insert"]>;
        Relationships: [];
      };
      quote_expressions: {
        Row: { quote_id: string; expression_id: string; start_offset: number; end_offset: number };
        Insert: { quote_id: string; expression_id: string; start_offset: number; end_offset: number };
        Update: Partial<Database["public"]["Tables"]["quote_expressions"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "quote_expressions_quote_id_fkey";
            columns: ["quote_id"];
            isOneToOne: false;
            referencedRelation: "quotes";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "quote_expressions_expression_id_fkey";
            columns: ["expression_id"];
            isOneToOne: false;
            referencedRelation: "expressions";
            referencedColumns: ["id"];
          },
        ];
      };
      tags: {
        Row: { id: string; slug: string; name_es: string };
        Insert: { id?: string; slug: string; name_es: string };
        Update: { id?: string; slug?: string; name_es?: string };
        Relationships: [];
      };
      quote_tags: {
        Row: { quote_id: string; tag_id: string };
        Insert: { quote_id: string; tag_id: string };
        Update: { quote_id?: string; tag_id?: string };
        Relationships: [
          {
            foreignKeyName: "quote_tags_quote_id_fkey";
            columns: ["quote_id"];
            isOneToOne: false;
            referencedRelation: "quotes";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "quote_tags_tag_id_fkey";
            columns: ["tag_id"];
            isOneToOne: false;
            referencedRelation: "tags";
            referencedColumns: ["id"];
          },
        ];
      };
      exercises: {
        Row: {
          id: string;
          quote_id: string;
          type: ExerciseType;
          payload: Json;
          status: ContentStatus;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          quote_id: string;
          type: ExerciseType;
          payload: Json;
          status?: ContentStatus;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["exercises"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "exercises_quote_id_fkey";
            columns: ["quote_id"];
            isOneToOne: false;
            referencedRelation: "quotes";
            referencedColumns: ["id"];
          },
        ];
      };
      daily_quotes: {
        Row: { day: string; quote_id: string };
        Insert: { day: string; quote_id: string };
        Update: { day?: string; quote_id?: string };
        Relationships: [
          {
            foreignKeyName: "daily_quotes_quote_id_fkey";
            columns: ["quote_id"];
            isOneToOne: false;
            referencedRelation: "quotes";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: { [_ in never]: never };
    Functions: {
      is_admin: { Args: never; Returns: boolean };
      check_rate_limit: {
        Args: { p_key: string; p_limit: number; p_window_seconds: number };
        Returns: boolean;
      };
    };
    Enums: {
      cefr_level: CefrLevel;
      content_status: ContentStatus;
      english_variety: EnglishVariety;
      exercise_type: ExerciseType;
      expression_type: ExpressionType;
      register: Register;
      user_role: UserRole;
      work_type: WorkType;
    };
    CompositeTypes: { [_ in never]: never };
  };
};
