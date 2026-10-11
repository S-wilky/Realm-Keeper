SET local check_function_bodies = off;

CREATE SCHEMA "quests";

CREATE SCHEMA "realms";

CREATE EXTENSION "vector" SCHEMA "extensions";

CREATE TABLE "public"."enemies" (
  "enemy_id"      uuid    NOT NULL DEFAULT gen_random_uuid(),
  "name"          text    NOT NULL,
  "creature_type" text,
  "faction_id"    uuid,
  "biome"         text,
  "danger_rating" integer,
  CONSTRAINT "enemies_pkey" PRIMARY KEY (enemy_id)
);

CREATE TABLE "public"."factions" (
  "faction_id" uuid   NOT NULL DEFAULT gen_random_uuid(),
  "name"       text   NOT NULL,
  "alignment"  text   NOT NULL,
  "regions"    text[],
  CONSTRAINT "factions_pkey" PRIMARY KEY (faction_id)
);

CREATE TABLE "public"."generated_quests" (
  "quest_id"   uuid NOT NULL DEFAULT gen_random_uuid(),
  "quest_type" text NOT NULL,
  "setting"    text,
  "faction"    text,
  "enemy"      text,
  "difficulty" text,
  "quest_hook" text NOT NULL,
  CONSTRAINT "generated_quests_pkey" PRIMARY KEY (quest_id)
);

CREATE TABLE "public"."input_templates" (
  "input_id"        uuid    NOT NULL DEFAULT gen_random_uuid(),
  "input_prompt"    text    NOT NULL,
  "required_fields" text[],
  "randomness"      boolean DEFAULT true,
  CONSTRAINT "input_templates_pkey" PRIMARY KEY (input_id)
);

CREATE TABLE "public"."locations" (
  "location_id"   uuid NOT NULL DEFAULT gen_random_uuid(),
  "name"          text NOT NULL,
  "biome"         text,
  "location_type" text,
  CONSTRAINT "locations_pkey" PRIMARY KEY (location_id)
);

CREATE TABLE "public"."npc_occupations" (
  "npc_id"    uuid   NOT NULL DEFAULT gen_random_uuid(),
  "name"      text   NOT NULL,
  "npc_type"  text,
  "factions"  text[],
  "tags"      text[],
  "locations" text[],
  CONSTRAINT "npc_occupation_pkey" PRIMARY KEY (npc_id)
);

CREATE TABLE "public"."objects" (
  "object_id"   uuid NOT NULL DEFAULT gen_random_uuid(),
  "name"        text NOT NULL,
  "rarity"      text,
  "object_type" text,
  CONSTRAINT "objects_pkey" PRIMARY KEY (object_id)
);

CREATE TABLE "public"."pair_id" (
  "pair_id"   uuid NOT NULL DEFAULT gen_random_uuid(),
  "quest_id"  uuid,
  "prompt_id" uuid,
  CONSTRAINT "pair_id_pkey" PRIMARY KEY (pair_id)
);

CREATE TABLE "public"."quest_templates" (
  "template_id"         uuid   NOT NULL DEFAULT gen_random_uuid(),
  "quest_type"          text   NOT NULL,
  "quest_hook"          text   NOT NULL,
  "required_fields_old" jsonb  NOT NULL,
  "default_difficulty"  text   NOT NULL,
  "tags"                text[],
  "required_fields"     text[],
  CONSTRAINT "quest_templates_pkey" PRIMARY KEY (template_id)
);

CREATE TABLE "realms"."ai_chat_messages" (
  "message_id" uuid                        NOT NULL DEFAULT gen_random_uuid(),
  "chat_id"    uuid,
  "role"       text                        NOT NULL,
  "message"    text                        NOT NULL,
  "created_at" timestamp without time zone DEFAULT now(),
  CONSTRAINT "ai_chat_messages_pkey" PRIMARY KEY (message_id)
);

CREATE TABLE "realms"."ai_chats" (
  "chat_id"    uuid                        NOT NULL DEFAULT gen_random_uuid(),
  "user_id"    uuid,
  "title"      text                        NOT NULL,
  "created_at" timestamp without time zone DEFAULT now(),
  CONSTRAINT "ai_chats_pkey" PRIMARY KEY (chat_id)
);

CREATE TABLE "realms"."articles" (
  "article_id"       uuid                        NOT NULL DEFAULT gen_random_uuid(),
  "world_id"         uuid                        NOT NULL,
  "title"            text                        NOT NULL,
  "type"             text                        NOT NULL,
  "body"             text,
  "embedding_vector" extensions.vector(1536),
  "metadata"         jsonb,
  "created_at"       timestamp without time zone DEFAULT now(),
  "updated_at"       timestamp without time zone DEFAULT now(),
  "user_id"          uuid                        NOT NULL DEFAULT gen_random_uuid(),
  CONSTRAINT "articles_pkey" PRIMARY KEY (article_id)
);

ALTER TABLE "realms"."articles"
  ENABLE ROW LEVEL SECURITY;

CREATE TABLE "realms"."campaigns" (
  "campaign_id" uuid                        NOT NULL DEFAULT gen_random_uuid(),
  "world_id"    uuid                        NOT NULL,
  "title"       text                        NOT NULL,
  "description" text,
  "tags"        text[],
  "created_at"  timestamp without time zone DEFAULT now(),
  "updated_at"  timestamp without time zone DEFAULT now(),
  "user_id"     uuid                        NOT NULL DEFAULT gen_random_uuid(),
  CONSTRAINT "campaign_pkey" PRIMARY KEY (campaign_id)
);

ALTER TABLE "realms"."campaigns"
  ENABLE ROW LEVEL SECURITY;

CREATE TABLE "realms"."characters" (
  "character_id"     uuid                        NOT NULL DEFAULT gen_random_uuid(),
  "world_id"         uuid                        NOT NULL,
  "name"             text                        NOT NULL,
  "type"             text                        NOT NULL,
  "description"      text,
  "embedding_vector" extensions.vector(1536),
  "traits"           jsonb,
  "created_at"       timestamp without time zone DEFAULT now(),
  "updated_at"       timestamp without time zone DEFAULT now(),
  CONSTRAINT "characters_pkey" PRIMARY KEY (character_id)
);

CREATE TABLE "realms"."dnd_statblock" (
  "statblock_id"      uuid                        NOT NULL DEFAULT gen_random_uuid(),
  "character_id"      uuid                        NOT NULL,
  "armor_class"       smallint,
  "hit_points"        smallint,
  "speed"             jsonb,
  "stats"             jsonb,
  "resistances"       text[],
  "immunities"        text[],
  "vulnerabilities"   text[],
  "senses"            jsonb,
  "languages"         text[],
  "proficiencies"     jsonb,
  "challenge_rating"  smallint,
  "experience_points" integer,
  "proficiency_bonus" smallint,
  "traits"            jsonb,
  "created_at"        timestamp without time zone DEFAULT now(),
  "updated_at"        timestamp without time zone DEFAULT now(),
  CONSTRAINT "dnd_statblock_pkey" PRIMARY KEY (statblock_id)
);

CREATE TABLE "realms"."profile" (
  "profile_id"  uuid                        NOT NULL DEFAULT gen_random_uuid(),
  "username"    text                        NOT NULL,
  "role"        text,
  "preferences" jsonb,
  "created_at"  timestamp without time zone DEFAULT now(),
  "updated_at"  timestamp without time zone DEFAULT now(),
  CONSTRAINT "profile_pkey" PRIMARY KEY (profile_id)
);

CREATE TABLE "realms"."quests" (
  "quest_id"         uuid                        NOT NULL DEFAULT gen_random_uuid(),
  "world_id"         uuid,
  "campaign_id"      uuid,
  "template_id"      uuid                        NOT NULL,
  "setting_id"       uuid                        NOT NULL,
  "faction_id"       uuid                        NOT NULL,
  "enemy_id"         uuid                        NOT NULL,
  "description"      text                        NOT NULL,
  "embedding_vector" extensions.vector(1536),
  "traits"           jsonb,
  "created_at"       timestamp without time zone DEFAULT now(),
  "updated_at"       timestamp without time zone DEFAULT now(),
  CONSTRAINT "quests_pkey" PRIMARY KEY (quest_id)
);

CREATE TABLE "realms"."session_chat_messages" (
  "message_id"    uuid                        NOT NULL DEFAULT gen_random_uuid(),
  "session_id"    uuid                        NOT NULL,
  "role"          text,
  "message"       text                        NOT NULL,
  "created_at"    timestamp without time zone NOT NULL DEFAULT (now() AT TIME ZONE 'utc'::text),
  "user_id"       uuid                        NOT NULL DEFAULT gen_random_uuid(),
  "invited_users" uuid[],
  CONSTRAINT "session_chat_messages_pkey" PRIMARY KEY (message_id)
);

ALTER TABLE "realms"."session_chat_messages"
  ENABLE ROW LEVEL SECURITY;

CREATE TABLE "realms"."session_stages" (
  "session_id" uuid                     NOT NULL DEFAULT gen_random_uuid(),
  "stage_id"   uuid                     NOT NULL DEFAULT gen_random_uuid(),
  "position"   smallint,
  "is_active"  boolean,
  "created_at" timestamp with time zone DEFAULT now(),
  "updated_at" timestamp with time zone DEFAULT now(),
  CONSTRAINT "session_stages_pkey" PRIMARY KEY (session_id, stage_id)
);

CREATE TABLE "realms"."sessions" (
  "session_id"     uuid                        NOT NULL DEFAULT gen_random_uuid(),
  "campaign_id"    uuid,
  "title"          text                        NOT NULL,
  "description"    text,
  "created_at"     timestamp without time zone DEFAULT now(),
  "updated_at"     timestamp without time zone DEFAULT now(),
  "user_id"        uuid                        NOT NULL DEFAULT gen_random_uuid(),
  "selected_stage" uuid                        DEFAULT gen_random_uuid(),
  CONSTRAINT "sessions_pkey" PRIMARY KEY (session_id)
);

ALTER TABLE "realms"."sessions"
  ENABLE ROW LEVEL SECURITY;

CREATE TABLE "realms"."stage_maps" (
  "map_id"       uuid                        NOT NULL DEFAULT gen_random_uuid(),
  "stage_id"     uuid                        NOT NULL,
  "src"          text                        NOT NULL,
  "x"            integer                     NOT NULL,
  "y"            integer                     NOT NULL,
  "width"        integer                     NOT NULL,
  "height"       integer                     NOT NULL,
  "snap_to_grid" boolean                     NOT NULL DEFAULT true,
  "z_index"      integer                     NOT NULL DEFAULT 0,
  "updated_at"   timestamp without time zone DEFAULT now(),
  CONSTRAINT "stage_maps_pkey" PRIMARY KEY (map_id)
);

CREATE TABLE "realms"."stage_tokens" (
  "token_id"      uuid                        NOT NULL DEFAULT gen_random_uuid(),
  "stage_id"      uuid                        NOT NULL,
  "src"           text                        NOT NULL,
  "x"             integer                     NOT NULL,
  "y"             integer                     NOT NULL,
  "width"         integer                     NOT NULL,
  "height"        integer                     NOT NULL,
  "snap_to_grid"  boolean                     NOT NULL DEFAULT true,
  "owner_user_id" uuid,
  "z_index"       integer                     NOT NULL DEFAULT 10,
  "updated_at"    timestamp without time zone DEFAULT now(),
  CONSTRAINT "stage_tokens_pkey" PRIMARY KEY (token_id)
);

CREATE TABLE "realms"."stages" (
  "stage_id"     uuid                        NOT NULL DEFAULT gen_random_uuid(),
  "title"        text                        NOT NULL,
  "world_width"  integer                     NOT NULL DEFAULT 5000,
  "world_height" integer                     NOT NULL DEFAULT 5000,
  "grid_size"    integer                     NOT NULL DEFAULT 50,
  "created_at"   timestamp without time zone DEFAULT now(),
  "updated_at"   timestamp without time zone DEFAULT now(),
  "state"        jsonb                       NOT NULL DEFAULT '{}'::jsonb,
  "position"     smallint,
  CONSTRAINT "stages_pkey" PRIMARY KEY (stage_id)
);

CREATE TABLE "realms"."worlds" (
  "world_id"    uuid                        NOT NULL DEFAULT gen_random_uuid(),
  "user_id"     uuid                        NOT NULL,
  "name"        text                        NOT NULL,
  "description" text,
  "tags"        text[],
  "created_at"  timestamp without time zone DEFAULT now(),
  "updated_at"  timestamp without time zone DEFAULT now(),
  CONSTRAINT "worlds_pkey" PRIMARY KEY (world_id)
);

ALTER TABLE "realms"."worlds"
  ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.match_articles (
  query_embedding extensions.vector,
  match_count     integer
)
  RETURNS TABLE (
    article_id uuid,
    title      text,
    body       text,
    metadata   jsonb,
    similarity double precision
  )
  LANGUAGE plpgsql
  STABLE
  AS $function$
begin
    return query
    select
        a.article_id,
        a.title,
        a.body,
        a.metadata,
        1 - (a.embedding_vector <=> query_embedding) as similarity
    from realms.articles a
    where a.embedding_vector is not null
    order by a.embedding_vector <=> query_embedding
    limit match_count;
end;
$function$;

ALTER TABLE "public"."enemies"
  ADD CONSTRAINT "enemies_faction_id_fkey" FOREIGN KEY (faction_id) REFERENCES public.factions(faction_id);

ALTER TABLE "public"."pair_id"
  ADD CONSTRAINT "pair_id_prompt_id_fkey" FOREIGN KEY (prompt_id) REFERENCES public.input_templates(input_id);

ALTER TABLE "public"."pair_id"
  ADD CONSTRAINT "pair_id_quest_id_fkey" FOREIGN KEY (quest_id) REFERENCES public.generated_quests(quest_id);

ALTER TABLE "realms"."ai_chat_messages"
  ADD CONSTRAINT "ai_chat_messages_chat_id_fkey" FOREIGN KEY (chat_id) REFERENCES realms.ai_chats(chat_id);

ALTER TABLE "realms"."ai_chats"
  ADD CONSTRAINT "ai_chats_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id);

ALTER TABLE "realms"."dnd_statblock"
  ADD CONSTRAINT "dnd_statblock_character_id_fkey" FOREIGN KEY (character_id) REFERENCES realms.characters(character_id);

ALTER TABLE "realms"."quests"
  ADD CONSTRAINT "quests_campaign_id_fkey" FOREIGN KEY (campaign_id) REFERENCES realms.campaigns(campaign_id);

ALTER TABLE "realms"."quests"
  ADD CONSTRAINT "quests_enemy_id_fkey" FOREIGN KEY (enemy_id) REFERENCES public.enemies(enemy_id);

ALTER TABLE "realms"."quests"
  ADD CONSTRAINT "quests_faction_id_fkey" FOREIGN KEY (faction_id) REFERENCES public.factions(faction_id);

ALTER TABLE "realms"."quests"
  ADD CONSTRAINT "quests_template_id_fkey" FOREIGN KEY (template_id) REFERENCES public.quest_templates(template_id);

ALTER TABLE "realms"."session_chat_messages"
  ADD CONSTRAINT "session_chat_messages_chat_id_fkey" FOREIGN KEY (session_id) REFERENCES realms.ai_chats(chat_id);

ALTER TABLE "realms"."sessions"
  ADD CONSTRAINT "sessions_campaign_id_fkey" FOREIGN KEY (campaign_id) REFERENCES realms.campaigns(campaign_id);

ALTER TABLE "realms"."session_stages"
  ADD CONSTRAINT "session_stages_session_id_fkey" FOREIGN KEY (session_id) REFERENCES realms.sessions(session_id) ON DELETE CASCADE;

ALTER TABLE "realms"."session_stages"
  ADD CONSTRAINT "session_stages_stage_id_fkey" FOREIGN KEY (stage_id) REFERENCES realms.stages(stage_id) ON DELETE CASCADE;

ALTER TABLE "realms"."stage_maps"
  ADD CONSTRAINT "stage_maps_stage_id_fkey" FOREIGN KEY (stage_id) REFERENCES realms.stages(stage_id) ON DELETE CASCADE;

ALTER TABLE "realms"."stage_tokens"
  ADD CONSTRAINT "stage_tokens_stage_id_fkey" FOREIGN KEY (stage_id) REFERENCES realms.stages(stage_id) ON DELETE CASCADE;

ALTER TABLE "realms"."articles"
  ADD CONSTRAINT "articles_world_id_fkey" FOREIGN KEY (world_id) REFERENCES realms.worlds(world_id);

ALTER TABLE "realms"."campaigns"
  ADD CONSTRAINT "campaign_world_id_fkey" FOREIGN KEY (world_id) REFERENCES realms.worlds(world_id);

ALTER TABLE "realms"."characters"
  ADD CONSTRAINT "characters_world_id_fkey" FOREIGN KEY (world_id) REFERENCES realms.worlds(world_id);

ALTER TABLE "realms"."quests"
  ADD CONSTRAINT "quests_world_id_fkey" FOREIGN KEY (world_id) REFERENCES realms.worlds(world_id);

ALTER TABLE "realms"."worlds"
  ADD CONSTRAINT "worlds_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id);

CREATE UNIQUE INDEX one_active_stage_per_session ON realms.session_stages USING btree (session_id)
  WHERE (is_active = true);

CREATE POLICY "Allow owners to manage their articles" ON "realms"."articles"
  FOR ALL
  TO PUBLIC
  USING ((auth.uid() = user_id));

CREATE POLICY "Users can delete their own articles" ON "realms"."articles"
  FOR DELETE
  TO PUBLIC
  USING ((auth.uid() = user_id));

CREATE POLICY "Users can insert their own articles" ON "realms"."articles"
  FOR INSERT
  TO PUBLIC
  WITH CHECK ((auth.uid() = user_id));

CREATE POLICY "Users can read their own articles" ON "realms"."articles"
  FOR SELECT
  TO PUBLIC
  USING ((auth.uid() = user_id));

CREATE POLICY "Users can update their own articles" ON "realms"."articles"
  FOR UPDATE
  TO PUBLIC
  USING ((auth.uid() = user_id))
  WITH CHECK ((auth.uid() = user_id));

CREATE POLICY "Allow owners to manage their campaigns" ON "realms"."campaigns"
  FOR ALL
  TO PUBLIC
  USING ((auth.uid() = user_id));

CREATE POLICY "Users can delete their own campaigns" ON "realms"."campaigns"
  FOR DELETE
  TO PUBLIC
  USING ((auth.uid() = user_id));

CREATE POLICY "Users can insert their own campaigns" ON "realms"."campaigns"
  FOR INSERT
  TO PUBLIC
  WITH CHECK ((auth.uid() = user_id));

CREATE POLICY "Users can read their own campaigns" ON "realms"."campaigns"
  FOR SELECT
  TO PUBLIC
  USING ((auth.uid() = user_id));

CREATE POLICY "Users can update their own campaigns" ON "realms"."campaigns"
  FOR UPDATE
  TO PUBLIC
  USING ((auth.uid() = user_id))
  WITH CHECK ((auth.uid() = user_id));

CREATE POLICY "Allow owners to manage their articles" ON "realms"."sessions"
  FOR ALL
  TO PUBLIC
  USING ((auth.uid() = user_id));

CREATE POLICY "Users can delete their own articles" ON "realms"."sessions"
  FOR DELETE
  TO PUBLIC
  USING ((auth.uid() = user_id));

CREATE POLICY "Users can insert their own articles" ON "realms"."sessions"
  FOR INSERT
  TO PUBLIC
  WITH CHECK ((auth.uid() = user_id));

CREATE POLICY "Users can read their own articles" ON "realms"."sessions"
  FOR SELECT
  TO PUBLIC
  USING ((auth.uid() = user_id));

CREATE POLICY "Users can update their own articles" ON "realms"."sessions"
  FOR UPDATE
  TO PUBLIC
  USING ((auth.uid() = user_id))
  WITH CHECK ((auth.uid() = user_id));

CREATE POLICY "Allow owners to manage their worlds" ON "realms"."worlds"
  FOR ALL
  TO PUBLIC
  USING ((auth.uid() = user_id));

CREATE POLICY "Users can delete their own worlds" ON "realms"."worlds"
  FOR DELETE
  TO PUBLIC
  USING ((auth.uid() = user_id));

CREATE POLICY "Users can insert their own worlds" ON "realms"."worlds"
  FOR INSERT
  TO PUBLIC
  WITH CHECK ((auth.uid() = user_id));

CREATE POLICY "Users can read their own worlds" ON "realms"."worlds"
  FOR SELECT
  TO PUBLIC
  USING ((auth.uid() = user_id));

CREATE POLICY "Users can update their own worlds" ON "realms"."worlds"
  FOR UPDATE
  TO PUBLIC
  USING ((auth.uid() = user_id))
  WITH CHECK ((auth.uid() = user_id));

CREATE POLICY "Users Can Delete Own Assets y91y81_0" ON "storage"."objects"
  FOR DELETE
  TO "authenticated"
  USING (((bucket_id = 'realm-assets'::text) AND ((storage.foldername(name))[1] = 'assets'::text) AND ((storage.foldername(name))[2] = (auth.uid())::text)));

CREATE POLICY "Users Can Delete Own Assets y91y81_1" ON "storage"."objects"
  FOR SELECT
  TO "authenticated"
  USING (((bucket_id = 'realm-assets'::text) AND ((storage.foldername(name))[1] = 'assets'::text) AND ((storage.foldername(name))[2] = (auth.uid())::text)));

CREATE POLICY "Users Can Read Own Assets y91y81_0" ON "storage"."objects"
  FOR SELECT
  TO "authenticated"
  USING (((bucket_id = 'realm-assets'::text) AND ((storage.foldername(name))[1] = 'assets'::text) AND ((storage.foldername(name))[2] = (auth.uid())::text)));

CREATE POLICY "Users Can Read Own Tokens y91y81_0" ON "storage"."objects"
  FOR SELECT
  TO "authenticated"
  USING (((bucket_id = 'realm-assets'::text) AND ((storage.foldername(name))[1] = 'tokens'::text) AND ((storage.foldername(name))[2] = (auth.uid())::text)));

CREATE POLICY "Users Can Upload Assets y91y81_0" ON "storage"."objects"
  FOR INSERT
  TO "authenticated"
  WITH CHECK (((bucket_id = 'realm-assets'::text) AND ((storage.foldername(name))[1] = 'assets'::text) AND ((storage.foldername(name))[2] = (auth.uid())::text)));

CREATE POLICY "Users Can Upload Tokens y91y81_0" ON "storage"."objects"
  FOR INSERT
  TO "authenticated"
  WITH CHECK (((bucket_id = 'realm-assets'::text) AND ((storage.foldername(name))[1] = 'tokens'::text) AND ((storage.foldername(name))[2] = (auth.uid())::text)));

CREATE POLICY "Users can read own maps" ON "storage"."objects"
  FOR SELECT
  TO "authenticated"
  USING (((bucket_id = 'realm-assets'::text) AND ((storage.foldername(name))[1] = 'maps'::text) AND ((storage.foldername(name))[2] = (auth.uid())::text)));

CREATE POLICY "Users can upload maps" ON "storage"."objects"
  FOR INSERT
  TO "authenticated"
  WITH CHECK (((bucket_id = 'realm-assets'::text) AND ((storage.foldername(name))[1] = 'maps'::text) AND ((storage.foldername(name))[2] = (auth.uid())::text)));

COMMENT ON COLUMN "realms"."stages"."state" IS 'state = {   maps: [],   tokens: [] }';

COMMENT ON EXTENSION "vector" IS 'vector data type and ivfflat and hnsw access methods';

COMMENT ON TABLE "realms"."session_chat_messages" IS 'For storing session chat messages';

COMMENT ON TABLE "realms"."session_stages" IS 'Links sessions to stages so stages can be used in multiple sessions';

GRANT EXECUTE ON FUNCTION "public"."match_articles"(extensions.vector, integer) TO PUBLIC, "anon", "authenticated";

REVOKE ALL ON FUNCTION "public"."match_articles"(extensions.vector, integer) FROM "postgres";

GRANT EXECUTE ON FUNCTION "public"."match_articles"(extensions.vector, integer) TO "postgres";

GRANT EXECUTE ON FUNCTION "public"."match_articles"(extensions.vector, integer) TO "service_role";

GRANT USAGE ON SCHEMA "realms" TO "anon", "authenticated", "service_role";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."enemies" TO "anon", "authenticated";

REVOKE ALL ON TABLE "public"."enemies" FROM "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."enemies" TO "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."enemies" TO "service_role";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."factions" TO "anon", "authenticated";

REVOKE ALL ON TABLE "public"."factions" FROM "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."factions" TO "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."factions" TO "service_role";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."generated_quests" TO "anon", "authenticated";

REVOKE ALL ON TABLE "public"."generated_quests" FROM "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."generated_quests" TO "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."generated_quests" TO "service_role";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."input_templates" TO "anon", "authenticated";

REVOKE ALL ON TABLE "public"."input_templates" FROM "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."input_templates" TO "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."input_templates" TO "service_role";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."locations" TO "anon", "authenticated";

REVOKE ALL ON TABLE "public"."locations" FROM "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."locations" TO "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."locations" TO "service_role";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."npc_occupations" TO "anon", "authenticated";

REVOKE ALL ON TABLE "public"."npc_occupations" FROM "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."npc_occupations" TO "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."npc_occupations" TO "service_role";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."objects" TO "anon", "authenticated";

REVOKE ALL ON TABLE "public"."objects" FROM "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."objects" TO "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."objects" TO "service_role";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."pair_id" TO "anon", "authenticated";

REVOKE ALL ON TABLE "public"."pair_id" FROM "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."pair_id" TO "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."pair_id" TO "service_role";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."quest_templates" TO "anon", "authenticated";

REVOKE ALL ON TABLE "public"."quest_templates" FROM "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."quest_templates" TO "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."quest_templates" TO "service_role";

GRANT INSERT, SELECT, UPDATE ON TABLE "realms"."ai_chat_messages" TO "anon", "authenticated";

GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE "realms"."ai_chat_messages" TO "service_role";

GRANT INSERT, SELECT, UPDATE ON TABLE "realms"."ai_chats" TO "anon", "authenticated";

GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE "realms"."ai_chats" TO "service_role";

GRANT INSERT, SELECT, UPDATE ON TABLE "realms"."articles" TO "anon";

GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE "realms"."articles" TO "authenticated", "service_role";

GRANT INSERT, SELECT, UPDATE ON TABLE "realms"."campaigns" TO "anon";

GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE "realms"."campaigns" TO "authenticated", "service_role";

GRANT INSERT, SELECT, UPDATE ON TABLE "realms"."characters" TO "anon", "authenticated";

GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE "realms"."characters" TO "service_role";

GRANT INSERT, SELECT, UPDATE ON TABLE "realms"."dnd_statblock" TO "anon", "authenticated";

GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE "realms"."dnd_statblock" TO "service_role";

GRANT INSERT, SELECT, UPDATE ON TABLE "realms"."profile" TO "anon", "authenticated";

GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE "realms"."profile" TO "service_role";

GRANT INSERT, SELECT, UPDATE ON TABLE "realms"."quests" TO "anon", "authenticated";

GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE "realms"."quests" TO "service_role";

GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE "realms"."session_chat_messages" TO "service_role";

GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE "realms"."session_stages" TO "authenticated", "service_role";

GRANT INSERT, SELECT, UPDATE ON TABLE "realms"."sessions" TO "anon";

GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE "realms"."sessions" TO "authenticated", "service_role";

GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE "realms"."stage_maps" TO "authenticated", "service_role";

GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE "realms"."stage_tokens" TO "authenticated", "service_role";

GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE "realms"."stages" TO "authenticated", "service_role";

GRANT INSERT, SELECT, UPDATE ON TABLE "realms"."worlds" TO "anon";

GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE "realms"."worlds" TO "authenticated", "service_role";

