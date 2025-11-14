structure_ex = {
    template: "{verb} a quest that involves {enemy}s in the {biome}.",
    required_fields: ["verb","enemy","biome"]
}

verbs = ["Create","Generate"]

async function generateInputPrompt(questData) {
    

    inputPrompt = {
        input_prompt: "",
        required_fields: ""
    }
    return inputPrompt
}

//needs to account for quest_type and verb differently than other required_fields
