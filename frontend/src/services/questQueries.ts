import supabase from "./supabase-client";

type QuestTemplate = {
    template_id: string;
    quest_type: string;
    quest_hook: string;
    required_fields: string[];
    default_difficulty: string | number | null;
    tags: string[] | null;
};

type GeneratedQuestData = {
    quest_type: string;
    setting: string;
    faction: string;
    enemy: string;
    difficulty: string | number;
    quest_hook: string;
};

type GeneratedQuest = GeneratedQuestData & {
    quest_id: string;
};

type PairId = {
    quest_id: string;
    prompt_id: string;
};

export const fetchQuestTemplates = async (
    questType?: string
): Promise<QuestTemplate[]> => {
    const query = supabase
        .from("quest_templates")
        .select(`
            template_id,
            quest_type,
            quest_hook,
            required_fields,
            default_difficulty,
            tags    
        `)
        .order("template_id", {
            ascending: true,
        });

    if (questType) {
        query.eq("quest_type", questType);
    }

    const { data, error } = await query;

    if (error) {
        throw error;
    }

    return (data as QuestTemplate[]) ?? [];
};

export const saveGeneratedQuest = async (
    questData: GeneratedQuestData
): Promise<GeneratedQuest | null> => {
    const { data, error } = await supabase
        .from("generated_quests")
        .insert([
            {
                quest_type: questData.quest_type,
                setting: questData.setting,
                faction: questData.faction,
                enemy: questData.enemy,
                difficulty: questData.difficulty,
                quest_hook: questData.quest_hook,
            },
        ])
        .select();

    if (error) {
        throw error;
    }

    return (data?.[0] as GeneratedQuest) ?? null;
};

export const linkQuestAndTemplate = async (
    questId: string,
    promptId: string
): Promise<PairId | null> => {
    const { data, error } = await supabase
        .from("pair_id")
        .insert([
            {
                quest_id: questId,
                prompt_id: promptId,
            },
        ])
        .select();

    if (error) {
        throw error;
    }

    return (data?.[0] as PairId) ?? null;
};

export const deleteGeneratedQuest = async (
    questId: string
): Promise<GeneratedQuest[] | null> => {
    const { data, error } = await supabase
        .from("generated_quests")
        .delete()
        .eq("quest_id", questId);

    if (error) {
        throw error;
    }

    return (data as GeneratedQuest[]) ?? null;
};