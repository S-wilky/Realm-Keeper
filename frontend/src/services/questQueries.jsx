import supabase from './supabase-client'

export const fetchQuestTemplates = async (questType) => {
    const query = supabase
        .from('quest_templates')
        .select(`
            template_id,
            quest_type,
            quest_hook,
            required_fields,
            default_difficulty,
            tags
            `)
            .order('template_id', { ascending: true })

        if (questType) query.eq('quest_type', questType)
        
        const { data, error } = await query
        if (error) throw error
        return data
}

export const saveGeneratedQuest = async (questData) => {
    const { data, error } = await supabase
        .from('generated_quests')
        .insert([
            {
                quest_type: questData.quest_type,
                setting: questData.setting,
                faction: questData.faction,
                enemy: questData.enemy,
                difficulty: questData.difficulty,
                quest_hook: questData.quest_hook,
            }
        ])
        .select()

    if (error) throw error
    return data[0]
}

export const linkQuestAndTemplate = async (questId, promptId) => {
    const { data, error } = await supabase
        .from('pair_id')
        .insert([{ quest_id: questId, prompt_id: promptId }])
        .select()

    if (error) throw error
    return data[0]
}

export const deleteGeneratedQuest = async (questId) => {
    const { data, error } = await supabase
        .from('generated_quests')
        .delete()
        .eq('quest_id', questId);

    if (error) throw error;
    return data;
}