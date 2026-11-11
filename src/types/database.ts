/** @format */

/**
 * Central domain types for the DevDesk Supabase schema.
 * Mirrors the live database (see supabase/migrations/) so the Supabase
 * client and every service share one source of truth instead of
 * copy-pasted local types.
 */

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Workspaces = {
  id: string;
  user_id: string;
  name: string | null;
  description: string | null;
  created_at: string;
  updated_at: string | null;
  active_environment_id: string | null;
}

export type Collections = {
  id: string;
  workspace_id: string | null;
  name: string | null;
  description: string | null;
  created_at: string;
  updated_at: string | null;
}

export type Requests = {
  id: string;
  name: string | null;
  method: string | null;
  url: string | null;
  headers: Record<string, string> | null;
  params: Record<string, string> | null;
  body: string | null;
  description: string | null;
  collection_id: string | null;
  updated_at: string | null;
  created_at: string;
  example_request: string | null;
  example_response: string | null;
  notes: string | null;
}

export type RequestRecord = Requests;
export type WorkspaceRecord = Workspaces;
export type CollectionRecord = Collections;
export type EnvironmentRecord = Environments;
export type EnvironmentVariableRecord = EnvironmentVariables;
export type CollectionWithRequestCount = Collections & { requests: { count: number } };
export type RequestFormData = {
  name: string;
  method: string;
  url: string;
  headers: { key: string; value: string }[];
  params: { key: string; value: string }[];
  body: string;
  description: string;
  example_request: string;
  example_response: string;
  notes: string;
};

export type Environments = {
  id: string;
  name: string;
  workspace_id: string;
  created_at: string | null;
}

export type EnvironmentVariables = {
  id: string;
  environment_id: string;
  key: string;
  value: string;
  created_at: string | null;
}

/**
 * Database type passed to createClient<Database>().
 * Row/Insert/Update per table, plus the table relationships that the
 * generated client uses for joined selects like .select("*, requests(count)").
 */
export type Database = {
  public: {
    Tables: {
      workspaces: {
        Row: Workspaces;
        Insert: {
          id?: string;
          user_id: string;
          name?: string | null;
          description?: string | null;
          created_at?: string;
          updated_at?: string | null;
          active_environment_id?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string | null;
          description?: string | null;
          created_at?: string;
          updated_at?: string | null;
          active_environment_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "fk_workspaces_active_environment";
            columns: ["active_environment_id"];
            isOneToOne: false;
            referencedRelation: "environments";
            referencedColumns: ["id"];
          },
        ];
      };
      collections: {
        Row: Collections;
        Insert: {
          id?: string;
          workspace_id: string | null;
          name?: string | null;
          description?: string | null;
          created_at?: string;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          workspace_id?: string | null;
          name?: string | null;
          description?: string | null;
          created_at?: string;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "fk_collections_workspace_id";
            columns: ["workspace_id"];
            isOneToOne: false;
            referencedRelation: "workspaces";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "fk_requests_collection_id";
            columns: ["id"];
            isOneToOne: false;
            referencedRelation: "requests";
            referencedColumns: ["collection_id"];
          },
        ];
      };
      requests: {
        Row: Requests;
        Insert: {
          id?: string;
          name?: string | null;
          method?: string | null;
          url?: string | null;
          headers?: Record<string, string> | null;
          params?: Record<string, string> | null;
          body?: string | null;
          description?: string | null;
          collection_id: string | null;
          updated_at?: string | null;
          created_at?: string;
          example_request?: string | null;
          example_response?: string | null;
          notes?: string | null;
        };
        Update: {
          id?: string;
          name?: string | null;
          method?: string | null;
          url?: string | null;
          headers?: Record<string, string> | null;
          params?: Record<string, string> | null;
          body?: string | null;
          description?: string | null;
          collection_id?: string | null;
          updated_at?: string | null;
          created_at?: string;
          example_request?: string | null;
          example_response?: string | null;
          notes?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "fk_requests_collection_id";
            columns: ["collection_id"];
            isOneToOne: false;
            referencedRelation: "collections";
            referencedColumns: ["id"];
          },
        ];
      };
      environments: {
        Row: Environments;
        Insert: {
          id?: string;
          name: string;
          workspace_id: string;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          name?: string;
          workspace_id?: string;
          created_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "environments_workspace_id_fkey";
            columns: ["workspace_id"];
            isOneToOne: false;
            referencedRelation: "workspaces";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "environment_variables_environment_id_fkey";
            columns: ["id"];
            isOneToOne: false;
            referencedRelation: "environment_variables";
            referencedColumns: ["environment_id"];
          },
        ];
      };
      environment_variables: {
        Row: EnvironmentVariables;
        Insert: {
          id?: string;
          environment_id: string;
          key: string;
          value: string;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          environment_id?: string;
          key?: string;
          value?: string;
          created_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "environment_variables_environment_id_fkey";
            columns: ["environment_id"];
            isOneToOne: false;
            referencedRelation: "environments";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
