import supabase from "./supabase-client-backend.js";
import safeForEach from "#utils/safeForEach";

type PromptTemplate = {
    input_prompt: string;
    required_fields: string[];
};

async function insertPromptTemplate(
    prompt: PromptTemplate
): Promise<boolean> {
    const { error } = await supabase
        .from("input_templates")
        .insert({
            input_prompt: prompt.input_prompt,
            required_fields: prompt.required_fields,
        });

    if (error) {
        console.error(error);
        return false;
    }

    return true;
}

const prompts: PromptTemplate[] = [
    {
        //0
        input_prompt: "",
        required_fields: [""],
    },

    // {
    //     //1
    //     input_prompt:
    //         "{verb} a quest involves {enemy}s in the {location}.",
    //     required_fields: ["verb", "enemy", "location"],
    // },

    // {
    //     //2
    //     input_prompt: "{verb} a {quest type} quest.",
    //     required_fields: ["verb", "quest_type"],
    // },

    // {
    //     //3
    //     input_prompt:
    //         "{verb} a {quest type} quest involving {faction}",
    //     required_fields: ["verb", "quest_type", "faction"],
    // },

    // {
    //     //4
    //     input_prompt:
    //         "{verb} a {quest type} quest in the {location}.",
    //     required_fields: ["verb", "quest_type", "location"],
    // },

    // {
    //     //5
    //     input_prompt:
    //         "{verb} a {quest type} quest that involves {enemy}s.",
    //     required_fields: ["verb", "quest_type", "enemy"],
    // },

    {
        //6
        input_prompt: "",
        required_fields: [""],
    },
];

async function insertAllPromptTemplates(): Promise<void> {
    let promptsInserted = 0;

    await safeForEach(
        prompts,
        async (prompt: PromptTemplate, i: number) => {
            if (
                prompt.input_prompt !== "" &&
                prompt.required_fields.length > 0 &&
                !(prompt.required_fields.length === 1 && prompt.required_fields[0] === "")
            ) {
                const success = await insertPromptTemplate(prompt);

                if (success) {
                    promptsInserted += 1;
                }
            } else {
                console.log("Missing information at index", i);
            }
        }
    );

    console.log(promptsInserted, "prompts inserted.");
}

insertAllPromptTemplates().catch((err: unknown) => {
    console.error("Failed to insert prompt templates:", err);
});

// Run from ai-service:
// node app/db_updates/insertPromptTemplates.js