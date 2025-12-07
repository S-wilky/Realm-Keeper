import pickRandom from "../utils/pickRandom";
import supabase from "../../../frontend/src/services/supabase-client";

// structure_ex = {
//     template: "{verb} a quest that involves {enemy}s in the {biome}.",
//     required_fields: ["verb","enemy","biome"]
// }

async function generateInputPrompt() {
    const verbs = ["Create","Generate","Give me","Write"]

    // 1. Pick a random template
    const { data, error } = await supabase
        .from('input_templates')
        .select()   //Add filters here. Potential to reduce payload?
    // console.log('Prompts: ', data);
    if (error) throw error;
    const prompt = pickRandom(data);
    // console.log('Selected Prompt: ', prompt);

    // 2. Get required fields
    const fields = prompt.required_fields;

    // 3. Resolve database choices for placeholders
    const fillableFields = {};
    let picked_quest_type = null;

    for (const field of fields) {
        if (field == "verb") {
            fillableFields[field] = pickRandom(verbs);
        } else if (field == "quest_type") {
            //TODO: INSERT quest_type logic here
            const quest_types = await supabase.from('quest_templates').select('quest_type')     //Still need to remove duplicated here? Right now it's weighted so maybe it's fine.
            // console.log('Quest types: ', quest_types);
            picked_quest_type = pickRandom(quest_types.data);
            fillableFields[field] = picked_quest_type.quest_type;
        } else {
            // console.log('Field: ', field);
            let table = '';
            if (field.substr(field.length - 1)=='y') {
                table = field.slice(0, field.length - 1) + 'ies';   //ex: change enemy to enemies table
            } else {
                table = field + 's';
            }
            // console.log('table', table);
            const res = await supabase.from(table).select();
            // console.log('Returned Data:', res)
            // client.query(`SELECT * FROM ${field}s`);  // factions, locations, objects, enemies
            const picked_prompt = pickRandom(res.data);
            fillableFields[field] = picked_prompt.name;
        }
    }
    // console.log('Selected options for each field: ', fillableFields);

    // 4. Build quest hook sentence
    let input_prompt = prompt.input_prompt;
    let replaced_fields = {};
    for (const field of fields) {
        input_prompt = input_prompt.replace(`{${field}}`, fillableFields[field]);
        replaced_fields[field] = fillableFields[field];
    }
    // console.log("Quest hook: ", questHook);

    // 5. Build structured JSON result
    const inputPrompt = {
        input_prompt: input_prompt,
        required_fields: fields,
        quest_type: picked_quest_type,
        replaced_fields: replaced_fields
    }
    return inputPrompt
}

export default generateInputPrompt;

//needs to account for quest_type and verb differently than other required_fields
