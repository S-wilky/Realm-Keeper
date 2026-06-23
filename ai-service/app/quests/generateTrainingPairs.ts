// run from ai-service:
// node app/quests/generateTrainingPairs.js

import cartesianProduct from "../utils/cartesianProduct.js";
import cleanArray from "../utils/cleanArray.js";
import getFieldArrays from "../utils/getFieldArrays.js";
import matchInputsToOutputs from "../utils/matchInputsToOutputs.js";
import writeJSONL from "../utils/writeJSONL.js";
import supabase from "../db_updates/supabase-client-backend.js";

type Template = {
    input_prompt: string;
    required_fields: string[];
};

type QuestTemplate = {
    quest_type: string;
    quest_hook: string;
    required_fields: string[];
};

type ReplaceableFieldArray = {
    field: string;
    values: string[];
};

async function generateTrainingPairs(): Promise<void> {
    console.warn("NEW RUN");

    const { data: templates, error: e1 } =
        await supabase
            .from("input_templates")
            .select();

    if (e1) console.error(e1);

    const replaceableFieldArrays:
        ReplaceableFieldArray[] = [];

    let {
        data: enemies,
        error: e2,
    } = await supabase
        .from("enemies")
        .select();

    if (e2) console.error(e2);

    enemies = cleanArray({
        field: "enemies",
        values: enemies ?? [],
    });

    replaceableFieldArrays.push({
        field: "enemies",
        values: enemies,
    });

    let {
        data: factions,
        error: e3,
    } = await supabase
        .from("factions")
        .select();

    if (e3) console.error(e3);

    factions = cleanArray({
        field: "factions",
        values: factions ?? [],
    });

    replaceableFieldArrays.push({
        field: "factions",
        values: factions,
    });

    let {
        data: locations,
        error: e4,
    } = await supabase
        .from("locations")
        .select();

    if (e4) console.error(e4);

    locations = cleanArray({
        field: "locations",
        values: locations ?? [],
    });

    replaceableFieldArrays.push({
        field: "locations",
        values: locations,
    });

    let {
        data: npcOccupations,
        error: e5,
    } = await supabase
        .from("npc_occupations")
        .select();

    if (e5) console.error(e5);

    npcOccupations = cleanArray({
        field: "npc_occupations",
        values: npcOccupations ?? [],
    });

    replaceableFieldArrays.push({
        field: "npc_occupations",
        values: npcOccupations,
    });

    let {
        data: objects,
        error: e6,
    } = await supabase
        .from("objects")
        .select();

    if (e6) console.error(e6);

    objects = cleanArray({
        field: "objects",
        values: objects ?? [],
    });

    replaceableFieldArrays.push({
        field: "objects",
        values: objects,
    });

    let {
        data: questTypes,
        error: e7,
    } = await supabase
        .from("quest_templates")
        .select("quest_type");

    if (e7) console.error(e7);

    const cleanedQuestTypes = cleanArray({
        field: "quest_types",
        values: questTypes ?? [],
    });

    replaceableFieldArrays.push({
        field: "quest_types",
        values: cleanedQuestTypes,
    });

    const verbs = [
        "Create",
        "Generate",
        "Give me",
        "Write",
    ];

    replaceableFieldArrays.push({
        field: "verbs",
        values: verbs,
    });

    const inputPrompts: any[] = [];
    const outputQuests: any[] = [];

    for (const template of (templates ??
        []) as Template[]) {
        const inputRequiredFieldTables =
            getFieldArrays(
                template.required_fields,
                replaceableFieldArrays
            );

        const inputCombinations =
            cartesianProduct(
                inputRequiredFieldTables
            );

        for (const combo of inputCombinations) {
            const fieldValues: Record<
                string,
                unknown
            > = {};

            for (
                let i = 0;
                i <
                template.required_fields.length;
                i++
            ) {
                const field = template.required_fields[i];

                if (field !== undefined) {
                    fieldValues[field] = combo[i];
                }
            }

            inputPrompts.push({
                input_prompt:
                    template.input_prompt,
                required_fields:
                    template.required_fields,
                field_values: fieldValues,
            });
        }

        let newRequiredFields = [
            ...template.required_fields,
        ];

        if (
            newRequiredFields.includes(
                "quest_type"
            )
        ) {
            newRequiredFields =
                newRequiredFields.filter(
                    (item) =>
                            item !== "quest_type"
                );
        }

        if (
            newRequiredFields.includes(
                "verb"
            )
        ) {
            newRequiredFields =
                newRequiredFields.filter(
                    (item) =>
                        item !== "verb"
                );
        }

        const {
            data: matchingQuests,
            error: e8,
        } = await supabase
            .from("quest_templates")
            .select()
            .contains(
                "required_fields",
                newRequiredFields
            );

        if (e8) console.error(e8);

        for (const questTemplate of (matchingQuests ??
            []) as QuestTemplate[]) {
            const questRequiredFieldTables =
                getFieldArrays(
                    questTemplate.required_fields,
                    replaceableFieldArrays
                );

            const outputCombinations =
                cartesianProduct(
                    questRequiredFieldTables
                );

            for (const combo of outputCombinations) {
                const fieldValues: Record<
                    string,
                    unknown
                > = {};

                for (
                    let i = 0;
                    i <
                    questTemplate
                        .required_fields.length;
                    i++
                ) {
                    const field =
                        questTemplate.required_fields[i];

                    if (field !== undefined) {
                        fieldValues[field] = combo[i];
                    }
                }

                outputQuests.push({
                    quest_type:
                        questTemplate.quest_type,
                    quest_hook:
                        questTemplate.quest_hook,
                    required_fields:
                        questTemplate.required_fields,
                    field_values: fieldValues,
                });
            }
        }
    }

    const trainingRows =
        matchInputsToOutputs(
            inputPrompts,
            outputQuests,
            replaceableFieldArrays
        );

    await writeJSONL(
        trainingRows,
        "./exports/training_data.jsonl"
    );

    console.log("JSON export complete!");
}

generateTrainingPairs();