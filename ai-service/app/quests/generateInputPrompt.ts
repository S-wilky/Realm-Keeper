import pickRandom from "../utils/pickRandom.js";
import supabase from "../services/ai-service-Supabase-client.js";

type PromptTemplate = {
    input_prompt: string;
    required_fields: string[];
};

type QuestTypeRecord = {
    quest_type: string;
};

type InputPromptResult = {
    input_prompt: string;
    required_fields: string[];
    quest_type: QuestTypeRecord | null;
    replaced_fields: Record<string, string>;
};

async function generateInputPrompt(): Promise<InputPromptResult> {
    const verbs = ["Create", "Generate", "Give me", "Write"];

    const { data, error } = await supabase
        .schema("public")
        .from("input_templates")
        .select();

    if (error) throw error;
    if (!data?.length) {
        throw new Error("No input templates found");
    }

    const prompt = pickRandom(data) as PromptTemplate;

    const fields = prompt.required_fields;

    const fillableFields: Record<string, string> = {};
    let pickedQuestType: QuestTypeRecord | null = null;

    for (const field of fields) {
        if (field === "verb") {
            fillableFields[field] = pickRandom(verbs);
        } else if (field === "quest_type") {
            const questTypes = await supabase
                .schema("public")
                .from("quest_templates")
                .select("quest_type");

            pickedQuestType = pickRandom(
                questTypes.data ?? []
            ) as QuestTypeRecord;

            fillableFields[field] =
                pickedQuestType.quest_type;
        } else {
            let table = "";

            if (field.endsWith("y")) {
                table =
                    field.slice(0, field.length - 1) +
                    "ies";
            } else {
                table = field + "s";
            }

            const res = await supabase
                .schema("public")
                .from(table)
                .select();

            const pickedPrompt = pickRandom(
                res.data ?? []
            ) as { name: string };

            fillableFields[field] =
                pickedPrompt.name;
        }
    }

    let inputPrompt = prompt.input_prompt;

    const replacedFields: Record<
        string,
        string
    > = {};

    for (const field of fields) {
        const value = fillableFields[field];

        if (!value) {
            throw new Error(`Missing field value for: ${field}`);
        }

        inputPrompt = inputPrompt.replace(`{${field}}`, value);
        replacedFields[field] = value;
    }

    return {
        input_prompt: inputPrompt,
        required_fields: fields,
        quest_type: pickedQuestType,
        replaced_fields: replacedFields,
    };
}

export default generateInputPrompt;