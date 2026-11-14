/** @format */

/** Supabase/Postgres JSON value. */
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

/** Generated-style Supabase schema types based on the supplied live schema. */
export type Database = {
  public: {
    Tables: {
      workspaces: {
        Row: {
          id: string;
          user_id: string;
          name: string | null;
          description: string | null;
          created_at: string;
          updated_at: string | null;
          active_environment_id: string | null;
        };
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
        Row: {
          id: string;
          workspace_id: string | null;
          name: string | null;
          description: string | null;
          created_at: string;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          workspace_id?: string | null;
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
        ];
      };
      requests: {
        Row: {
          id: string;
          name: string | null;
          method: string | null;
          url: string | null;
          headers: Json | null;
          params: Json | null;
          body: string | null;
          description: string | null;
          collection_id: string | null;
          updated_at: string | null;
          created_at: string;
          example_request: string | null;
          example_response: string | null;
          notes: string | null;
        };
        Insert: {
          id?: string;
          name?: string | null;
          method?: string | null;
          url?: string | null;
          headers?: Json | null;
          params?: Json | null;
          body?: string | null;
          description?: string | null;
          collection_id?: string | null;
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
          headers?: Json | null;
          params?: Json | null;
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
        Row: {
          id: string;
          name: string;
          workspace_id: string;
          created_at: string | null;
        };
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
        ];
      };
      environment_variables: {
        Row: {
          id: string;
          environment_id: string;
          key: string;
          value: string;
          created_at: string | null;
        };
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
    Views: { [_ in never]: never };
    Functions: { [_ in never]: never };
    Enums: { [_ in never]: never };
    CompositeTypes: { [_ in never]: never };
  };
};

export type PublicTableName = keyof Database["public"]["Tables"];
export type TableRow<T extends PublicTableName> = Database["public"]["Tables"][T]["Row"];
export type TablesInsert<T extends PublicTableName> = Database["public"]["Tables"][T]["Insert"];
export type TablesUpdate<T extends PublicTableName> = Database["public"]["Tables"][T]["Update"];

export type Workspaces = TableRow<"workspaces">;
export type Collections = TableRow<"collections">;
export type Requests = TableRow<"requests">;
export type Environments = TableRow<"environments">;
export type EnvironmentVariables = TableRow<"environment_variables">;

export type KeyValueMap = Record<string, string>;
export type RequestRecord = Omit<Requests, "headers" | "params"> & {
  headers: KeyValueMap | null;
  params: KeyValueMap | null;
};
export type WorkspaceRecord = Workspaces;
export type CollectionRecord = Collections;
export type EnvironmentRecord = Environments;
export type EnvironmentVariableRecord = EnvironmentVariables;
export type CollectionWithRequestCount = Collections & {
  requests: { count: number }[];
};

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
