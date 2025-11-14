import supabase from "../../../backend/src/database/supabase-client-backend.js";
import safeForEach from "../utils/safeForEach.js";

async function insertPromptTemplate(prompt) {
    const { error } = await supabase
        .from('input_templates')
        .insert({ 
            input_prompt: prompt.input_prompt,
            required_fields: prompt.required_fields
        })

    if (error) {
        console.error(error);
        return false;
    } else {
        return true;
    }
};

const prompts = [
{
//0
    input_prompt: "{verb} a quest that involves {enemy}s in the {biome}.", 
    required_fields: ["verb","enemy","biome"]
}
,{
//1
    input_prompt: "{verb} a {quest type} quest.", 
    required_fields: ["verb","quest_type"]
}
,{
//2
    input_prompt: "{verb} a {quest type} quest involving {faction}", 
    required_fields: ["verb","quest_type","faction"]
}
,{
//3
    input_prompt: "{verb} a {quest type} quest in the {location}.", 
    required_fields: ["verb","quest_type","location"]
}
,{
//4
    input_prompt: "{verb} a {quest type} quest that involves {enemy}s.", 
    required_fields: ["verb","quest_type","enemy"]
}
]

let promptsInserted = 0;

safeForEach(prompts, (prompt, i) => {
    if (prompt.input_prompt != "" && prompt.required_fields != [""]) {
        if(insertPromptTemplate(prompt)) {
            promptsInserted += 1;
        }
    } else {
        console.log("Missing information at index ", i);
    }
});

console.log(promptsInserted, " prompts inserted.");

// Run this from ai-service: node app/db_updates/insertPromptTemplates.js