export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      graphql: {
        Args: { extensions?: Json; operationName?: string; query?: string; variables?: Json };
        Returns: Json;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  public: {
    Tables: {
      autolink_ignores: {
        Row: {
          created_at: string;
          term: string;
          tome_id: string;
        };
        ComputedFields: never;
        Insert: {
          created_at?: string;
          term: string;
          tome_id: string;
        };
        Update: {
          created_at?: string;
          term?: string;
          tome_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "autolink_ignores_tome_id_fkey";
            columns: ["tome_id"];
            isOneToOne: false;
            referencedRelation: "tomes";
            referencedColumns: ["id"];
          },
        ];
      };
      blocks: {
        Row: {
          content: NonNullable<Json>;
          created_at: string;
          id: string;
          is_secret: boolean;
          locked_at: string | null;
          locked_by: string | null;
          parent_block_id: string | null;
          search_text: string | null;
          sort_key: string;
          tome_id: string;
          type: string;
          updated_at: string;
        };
        ComputedFields: never;
        Insert: {
          content?: NonNullable<Json>;
          created_at?: string;
          id?: string;
          is_secret?: boolean;
          locked_at?: string | null;
          locked_by?: string | null;
          parent_block_id?: string | null;
          search_text?: string | null;
          sort_key: string;
          tome_id: string;
          type: string;
          updated_at?: string;
        };
        Update: {
          content?: NonNullable<Json>;
          created_at?: string;
          id?: string;
          is_secret?: boolean;
          locked_at?: string | null;
          locked_by?: string | null;
          parent_block_id?: string | null;
          search_text?: string | null;
          sort_key?: string;
          tome_id?: string;
          type?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "blocks_parent_block_id_fkey";
            columns: ["parent_block_id"];
            isOneToOne: false;
            referencedRelation: "blocks";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "blocks_tome_id_fkey";
            columns: ["tome_id"];
            isOneToOne: false;
            referencedRelation: "tomes";
            referencedColumns: ["id"];
          },
        ];
      };
      folders: {
        Row: {
          created_at: string;
          id: string;
          name: string;
          parent_folder_id: string | null;
          sort_key: string;
          updated_at: string;
          world_id: string;
        };
        ComputedFields: never;
        Insert: {
          created_at?: string;
          id?: string;
          name: string;
          parent_folder_id?: string | null;
          sort_key: string;
          updated_at?: string;
          world_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          name?: string;
          parent_folder_id?: string | null;
          sort_key?: string;
          updated_at?: string;
          world_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "folders_parent_folder_id_fkey";
            columns: ["parent_folder_id"];
            isOneToOne: false;
            referencedRelation: "folders";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "folders_world_id_fkey";
            columns: ["world_id"];
            isOneToOne: false;
            referencedRelation: "worlds";
            referencedColumns: ["id"];
          },
        ];
      };
      published_blocks: {
        Row: {
          content: NonNullable<Json>;
          id: string;
          is_secret: boolean;
          parent_block_id: string | null;
          published_at: string;
          search_text: string | null;
          sort_key: string;
          tome_id: string;
          type: string;
        };
        ComputedFields: never;
        Insert: {
          content: NonNullable<Json>;
          id: string;
          is_secret?: boolean;
          parent_block_id?: string | null;
          published_at?: string;
          search_text?: string | null;
          sort_key: string;
          tome_id: string;
          type: string;
        };
        Update: {
          content?: NonNullable<Json>;
          id?: string;
          is_secret?: boolean;
          parent_block_id?: string | null;
          published_at?: string;
          search_text?: string | null;
          sort_key?: string;
          tome_id?: string;
          type?: string;
        };
        Relationships: [
          {
            foreignKeyName: "published_blocks_tome_id_fkey";
            columns: ["tome_id"];
            isOneToOne: false;
            referencedRelation: "tomes";
            referencedColumns: ["id"];
          },
        ];
      };
      published_connections: {
        Row: {
          from_tome_id: string;
          id: string;
          is_mutual: boolean;
          is_secret: boolean;
          published_at: string;
          relationship_type: string;
          to_tome_id: string;
          world_id: string;
        };
        ComputedFields: never;
        Insert: {
          from_tome_id: string;
          id: string;
          is_mutual?: boolean;
          is_secret?: boolean;
          published_at?: string;
          relationship_type: string;
          to_tome_id: string;
          world_id: string;
        };
        Update: {
          from_tome_id?: string;
          id?: string;
          is_mutual?: boolean;
          is_secret?: boolean;
          published_at?: string;
          relationship_type?: string;
          to_tome_id?: string;
          world_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "published_connections_from_tome_id_fkey";
            columns: ["from_tome_id"];
            isOneToOne: false;
            referencedRelation: "tomes";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "published_connections_to_tome_id_fkey";
            columns: ["to_tome_id"];
            isOneToOne: false;
            referencedRelation: "tomes";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "published_connections_world_id_fkey";
            columns: ["world_id"];
            isOneToOne: false;
            referencedRelation: "worlds";
            referencedColumns: ["id"];
          },
        ];
      };
      tome_access_grants: {
        Row: {
          can_edit: boolean;
          created_at: string;
          id: string;
          tome_id: string;
          user_id: string;
        };
        ComputedFields: never;
        Insert: {
          can_edit?: boolean;
          created_at?: string;
          id?: string;
          tome_id: string;
          user_id: string;
        };
        Update: {
          can_edit?: boolean;
          created_at?: string;
          id?: string;
          tome_id?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "tome_access_grants_tome_id_fkey";
            columns: ["tome_id"];
            isOneToOne: false;
            referencedRelation: "tomes";
            referencedColumns: ["id"];
          },
        ];
      };
      tome_aliases: {
        Row: {
          alias: string;
          created_at: string;
          id: string;
          tome_id: string;
          world_id: string;
        };
        ComputedFields: never;
        Insert: {
          alias: string;
          created_at?: string;
          id?: string;
          tome_id: string;
          world_id: string;
        };
        Update: {
          alias?: string;
          created_at?: string;
          id?: string;
          tome_id?: string;
          world_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "tome_aliases_tome_id_fkey";
            columns: ["tome_id"];
            isOneToOne: false;
            referencedRelation: "tomes";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "tome_aliases_world_id_fkey";
            columns: ["world_id"];
            isOneToOne: false;
            referencedRelation: "worlds";
            referencedColumns: ["id"];
          },
        ];
      };
      tome_connections: {
        Row: {
          created_at: string;
          from_tome_id: string;
          id: string;
          is_mutual: boolean;
          is_secret: boolean;
          relationship_type: string;
          to_tome_id: string;
          world_id: string;
        };
        ComputedFields: never;
        Insert: {
          created_at?: string;
          from_tome_id: string;
          id?: string;
          is_mutual?: boolean;
          is_secret?: boolean;
          relationship_type: string;
          to_tome_id: string;
          world_id: string;
        };
        Update: {
          created_at?: string;
          from_tome_id?: string;
          id?: string;
          is_mutual?: boolean;
          is_secret?: boolean;
          relationship_type?: string;
          to_tome_id?: string;
          world_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "tome_connections_from_tome_id_fkey";
            columns: ["from_tome_id"];
            isOneToOne: false;
            referencedRelation: "tomes";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "tome_connections_to_tome_id_fkey";
            columns: ["to_tome_id"];
            isOneToOne: false;
            referencedRelation: "tomes";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "tome_connections_world_id_fkey";
            columns: ["world_id"];
            isOneToOne: false;
            referencedRelation: "worlds";
            referencedColumns: ["id"];
          },
        ];
      };
      tome_links: {
        Row: {
          created_at: string;
          from_block_id: string;
          from_tome_id: string;
          to_tome_id: string;
        };
        ComputedFields: never;
        Insert: {
          created_at?: string;
          from_block_id: string;
          from_tome_id: string;
          to_tome_id: string;
        };
        Update: {
          created_at?: string;
          from_block_id?: string;
          from_tome_id?: string;
          to_tome_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "tome_links_from_block_id_fkey";
            columns: ["from_block_id"];
            isOneToOne: false;
            referencedRelation: "blocks";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "tome_links_from_tome_id_fkey";
            columns: ["from_tome_id"];
            isOneToOne: false;
            referencedRelation: "tomes";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "tome_links_to_tome_id_fkey";
            columns: ["to_tome_id"];
            isOneToOne: false;
            referencedRelation: "tomes";
            referencedColumns: ["id"];
          },
        ];
      };
      tome_tags: {
        Row: {
          created_at: string;
          tag: string;
          tome_id: string;
          world_id: string;
        };
        ComputedFields: never;
        Insert: {
          created_at?: string;
          tag: string;
          tome_id: string;
          world_id: string;
        };
        Update: {
          created_at?: string;
          tag?: string;
          tome_id?: string;
          world_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "tome_tags_tome_id_fkey";
            columns: ["tome_id"];
            isOneToOne: false;
            referencedRelation: "tomes";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "tome_tags_world_id_fkey";
            columns: ["world_id"];
            isOneToOne: false;
            referencedRelation: "worlds";
            referencedColumns: ["id"];
          },
        ];
      };
      tome_version_deltas: {
        Row: {
          after: Json | null;
          before: Json | null;
          block_id: string;
          created_at: string;
          id: string;
          op: string;
          version_id: string;
        };
        ComputedFields: never;
        Insert: {
          after?: Json | null;
          before?: Json | null;
          block_id: string;
          created_at?: string;
          id?: string;
          op: string;
          version_id: string;
        };
        Update: {
          after?: Json | null;
          before?: Json | null;
          block_id?: string;
          created_at?: string;
          id?: string;
          op?: string;
          version_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "tome_version_deltas_version_id_fkey";
            columns: ["version_id"];
            isOneToOne: false;
            referencedRelation: "tome_versions";
            referencedColumns: ["id"];
          },
        ];
      };
      tome_versions: {
        Row: {
          created_by: string;
          ended_at: string;
          id: string;
          is_publish: boolean;
          snapshot: Json | null;
          started_at: string;
          tome_id: string;
        };
        ComputedFields: never;
        Insert: {
          created_by: string;
          ended_at?: string;
          id?: string;
          is_publish?: boolean;
          snapshot?: Json | null;
          started_at?: string;
          tome_id: string;
        };
        Update: {
          created_by?: string;
          ended_at?: string;
          id?: string;
          is_publish?: boolean;
          snapshot?: Json | null;
          started_at?: string;
          tome_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "tome_versions_tome_id_fkey";
            columns: ["tome_id"];
            isOneToOne: false;
            referencedRelation: "tomes";
            referencedColumns: ["id"];
          },
        ];
      };
      tomes: {
        Row: {
          archived_at: string | null;
          created_at: string;
          created_by: string;
          folder_id: string | null;
          id: string;
          published_at: string | null;
          published_by: string | null;
          search_vector: unknown;
          status: Database["public"]["Enums"]["tome_status"];
          title: string;
          type: string;
          updated_at: string;
          visibility: Database["public"]["Enums"]["tome_visibility"];
          world_id: string;
        };
        ComputedFields: never;
        Insert: {
          archived_at?: string | null;
          created_at?: string;
          created_by: string;
          folder_id?: string | null;
          id?: string;
          published_at?: string | null;
          published_by?: string | null;
          search_vector?: never;
          status?: Database["public"]["Enums"]["tome_status"];
          title: string;
          type: string;
          updated_at?: string;
          visibility?: Database["public"]["Enums"]["tome_visibility"];
          world_id: string;
        };
        Update: {
          archived_at?: string | null;
          created_at?: string;
          created_by?: string;
          folder_id?: string | null;
          id?: string;
          published_at?: string | null;
          published_by?: string | null;
          search_vector?: never;
          status?: Database["public"]["Enums"]["tome_status"];
          title?: string;
          type?: string;
          updated_at?: string;
          visibility?: Database["public"]["Enums"]["tome_visibility"];
          world_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "tomes_folder_id_fkey";
            columns: ["folder_id"];
            isOneToOne: false;
            referencedRelation: "folders";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "tomes_world_id_fkey";
            columns: ["world_id"];
            isOneToOne: false;
            referencedRelation: "worlds";
            referencedColumns: ["id"];
          },
        ];
      };
      tone_tags: {
        Row: {
          label: string;
          sort_order: number;
          tag: string;
        };
        ComputedFields: never;
        Insert: {
          label: string;
          sort_order?: number;
          tag: string;
        };
        Update: {
          label?: string;
          sort_order?: number;
          tag?: string;
        };
        Relationships: [];
      };
      world_members: {
        Row: {
          created_at: string;
          role: Database["public"]["Enums"]["world_role"];
          trusted_builder: boolean;
          user_id: string;
          world_id: string;
        };
        ComputedFields: never;
        Insert: {
          created_at?: string;
          role: Database["public"]["Enums"]["world_role"];
          trusted_builder?: boolean;
          user_id: string;
          world_id: string;
        };
        Update: {
          created_at?: string;
          role?: Database["public"]["Enums"]["world_role"];
          trusted_builder?: boolean;
          user_id?: string;
          world_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "world_members_world_id_fkey";
            columns: ["world_id"];
            isOneToOne: false;
            referencedRelation: "worlds";
            referencedColumns: ["id"];
          },
        ];
      };
      world_tags: {
        Row: {
          kind: Database["public"]["Enums"]["world_tag_kind"];
          tag: string;
          world_id: string;
        };
        ComputedFields: never;
        Insert: {
          kind: Database["public"]["Enums"]["world_tag_kind"];
          tag: string;
          world_id: string;
        };
        Update: {
          kind?: Database["public"]["Enums"]["world_tag_kind"];
          tag?: string;
          world_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "world_tags_world_id_fkey";
            columns: ["world_id"];
            isOneToOne: false;
            referencedRelation: "worlds";
            referencedColumns: ["id"];
          },
        ];
      };
      worlds: {
        Row: {
          archived_at: string | null;
          ceiling_enabled: boolean;
          cover_image_path: string | null;
          created_at: string;
          description: string | null;
          era: string | null;
          id: string;
          inspirations: string | null;
          languages: string[];
          name: string;
          owner_id: string;
          rating: Database["public"]["Enums"]["content_rating"];
          status: Database["public"]["Enums"]["world_status"];
          updated_at: string;
          visibility: Database["public"]["Enums"]["world_visibility"];
        };
        ComputedFields: never;
        Insert: {
          archived_at?: string | null;
          ceiling_enabled?: boolean;
          cover_image_path?: string | null;
          created_at?: string;
          description?: string | null;
          era?: string | null;
          id?: string;
          inspirations?: string | null;
          languages?: string[];
          name: string;
          owner_id: string;
          rating?: Database["public"]["Enums"]["content_rating"];
          status?: Database["public"]["Enums"]["world_status"];
          updated_at?: string;
          visibility?: Database["public"]["Enums"]["world_visibility"];
        };
        Update: {
          archived_at?: string | null;
          ceiling_enabled?: boolean;
          cover_image_path?: string | null;
          created_at?: string;
          description?: string | null;
          era?: string | null;
          id?: string;
          inspirations?: string | null;
          languages?: string[];
          name?: string;
          owner_id?: string;
          rating?: Database["public"]["Enums"]["content_rating"];
          status?: Database["public"]["Enums"]["world_status"];
          updated_at?: string;
          visibility?: Database["public"]["Enums"]["world_visibility"];
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      match_articles: {
        Args: { match_count: number; query_embedding: string };
        Returns: {
          article_id: string;
          body: string;
          metadata: Json;
          similarity: number;
          title: string;
        }[];
      };
      rk_acquire_lock: { Args: { p_block_id: string }; Returns: Json };
      rk_can_edit_tome: { Args: { p_tome_id: string }; Returns: boolean };
      rk_can_read_tome: { Args: { p_tome_id: string }; Returns: boolean };
      rk_can_see_secrets: { Args: { p_tome_id: string }; Returns: boolean };
      rk_extract_link_ids: { Args: { p_content: Json }; Returns: string[] };
      rk_extract_text: { Args: { p_content: Json }; Returns: string };
      rk_heartbeat_lock: { Args: { p_block_id: string }; Returns: boolean };
      rk_publish_tome: { Args: { p_tome_id: string }; Returns: Json };
      rk_release_lock: { Args: { p_block_id: string }; Returns: undefined };
      rk_save_blocks: { Args: { p_ops: Json; p_tome_id: string }; Returns: Json };
      rk_unpublish_tome: { Args: { p_tome_id: string }; Returns: undefined };
      rk_world_role: {
        Args: { p_world_id: string };
        Returns: Database["public"]["Enums"]["world_role"];
      };
      uuidv7: { Args: Record<PropertyKey, never>; Returns: string };
    };
    Enums: {
      content_rating: "general" | "teen" | "mature";
      tome_status: "draft" | "finished";
      tome_visibility: "private" | "unlisted" | "public";
      world_role: "owner" | "co_builder" | "contributor" | "player";
      world_status: "active" | "complete" | "on_hiatus" | "archived";
      world_tag_kind: "genre" | "tone" | "system" | "custom";
      world_visibility: "private" | "unlisted" | "public";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      content_rating: ["general", "teen", "mature"],
      tome_status: ["draft", "finished"],
      tome_visibility: ["private", "unlisted", "public"],
      world_role: ["owner", "co_builder", "contributor", "player"],
      world_status: ["active", "complete", "on_hiatus", "archived"],
      world_tag_kind: ["genre", "tone", "system", "custom"],
      world_visibility: ["private", "unlisted", "public"],
    },
  },
} as const;
