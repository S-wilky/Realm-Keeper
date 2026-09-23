import supabase from "../services/ai-service-Supabase-client.js";
import pickRandom from "#utils/pickRandom";
import { retreiveRelevantArticles } from "../embeddings/retrieveRelevantArticles.js";

type InputPrompt = {
    input_prompt: string;
    required_fields: string[];
    quest_type: {
        quest_type: string;
    } | null;
    replaced_fields: Record<string, string>;
};

type QuestTemplate = {
    quest_type: string;
    quest_hook: string;
    required_fields: string[];
    default_difficulty: string;
};

type DatabaseItem = {
    name: string;
    biome?: string;
};

type QuestData = {
    template: string | null;
    setting: string | null;
    faction: string | null;
    enemy: string | null;
    difficulty: string | null;
    quest_hook: string;
    lore_sources: unknown[];
};

async function generateQuest(
    input_prompt: InputPrompt | null = null
): Promise<QuestData> {
    console.log(
        "Prompt passed to GenerateQuest:",
        input_prompt
    );

    let loreSources: unknown[] = [];

    if (input_prompt?.input_prompt) {
        loreSources =
            await retreiveRelevantArticles(
                input_prompt.input_prompt,
                3
            );

        console.log(
            "Retrieved lore sources:",
            loreSources
        );
    }

    let query = supabase
        .schema("public")
        .from("quest_templates")
        .select();

    let newRequiredFields: string[] = [""];

    if (input_prompt !== null) {
        if (input_prompt.quest_type !== null) {
            console.log(
                "Quest type found:",
                input_prompt.quest_type
            );

            query = query.eq(
                "quest_type",
                input_prompt.quest_type.quest_type
            );

            newRequiredFields =
                input_prompt.required_fields.filter(
                    (item) => item !== "quest_type"
                );
        } else {
            newRequiredFields =
                input_prompt.required_fields;
        }

        if (
            input_prompt.required_fields.includes(
                "verb"
            )
        ) {
            newRequiredFields =
                newRequiredFields.filter(
                    (item) => item !== "verb"
                );
        }

        console.log(
            "Prompt Required Fields:",
            newRequiredFields
        );

        if (
            !(
                newRequiredFields.length === 1 &&
                newRequiredFields[0] === ""
            )
        ) {
            query = query.contains(
                "required_fields",
                newRequiredFields
            );
        }
    }

    let questHook = "";
    let questType: string | null = null;
    let biome: string | null = null;
    let faction: string | null = null;
    let enemy: string | null = null;
    let difficulty: string | null = null;

    const { data, error } = await query;

    if (error) {
        console.error(error);

        questHook =
            "Could not find a quest type that matches these parameters.";
    } else {
        console.log("Matching quests:", data);

        const quest = pickRandom(
            data
        ) as QuestTemplate;

        console.log("Selected Quest:", quest);

        const fields = quest.required_fields;

        const fillableFields: Record<
            string,
            DatabaseItem
        > = {};

        for (const field of fields) {
            let table = "";

            if (field.endsWith("y")) {
                table =
                    field.slice(
                        0,
                        field.length - 1
                    ) + "ies";
            } else {
                table = field + "s";
            }

            let fieldQuery = supabase
                .schema("public")
                .from(table)
                .select();

            if (
                input_prompt &&
                newRequiredFields.includes(field)
            ) {
                console.log(
                    "Replaced field:",
                    field
                );

                console.log(
                    "Replaced with:",
                    input_prompt.replaced_fields[
                        field
                    ]
                );

                fieldQuery = fieldQuery.eq(
                    "name",
                    input_prompt.replaced_fields[
                        field
                    ]
                );
            }

            const {
                data: fieldData,
                error: fieldError,
            } = await fieldQuery;

            if (fieldError) {
                console.error(fieldError);
                continue;
            }

            const selected = pickRandom(
                fieldData ?? []
            ) as DatabaseItem;

            fillableFields[field] = selected;
        }

        questHook = quest.quest_hook;

        for (const field of fields) {
            const value =
                fillableFields[field];

            if (!value) {
                throw new Error(
                    `Missing field value for ${field}`
                );
            }

            questHook = questHook.replace(
                `{${field}}`,
                value.name
            );
        }

        questType = quest.quest_type;
        biome =
            fillableFields.location?.biome ??
            null;
        faction =
            fillableFields.faction?.name ??
            null;
        enemy =
            fillableFields.enemy?.name ??
            null;
        difficulty =
            quest.default_difficulty ?? null;
    }

    const questData: QuestData = {
        template: questType,
        setting: biome,
        faction,
        enemy,
        difficulty,
        quest_hook: questHook,
        lore_sources: loreSources,
    };

    console.log(
        "Quest in JSON with RAG:",
        questData
    );

    return questData;
}

export default generateQuest;