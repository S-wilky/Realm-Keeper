import supabase from "../../../backend/src/database/supabase-client-backend.js";
import safeForEach from "../utils/safeForEach.js";

async function insertQuestTemplate(quest) {
    const { error } = await supabase
        .from('quest_templates')
        .insert({ 
            quest_type: quest.quest_type, 
            quest_hook: quest.quest_hook,
            required_fields: quest.required_fields,
            default_difficulty: quest.default_difficulty,
            tags: quest.tags
        })

    if (error) {
        console.error(error);
        return false;
    } else {
        return true;
    }
};

const quests = [
// {
// //0
//     quest_type: "", 
//     quest_hook: "",
//     required_fields: [""],
//     default_difficulty: "",
//     tags: [""]
// }
// ,{
// //1
//     quest_type: "Retreival", 
//     quest_hook: "The {faction} summons you and offers you a reward to capture and return the leader of a nearby group of {enemy} alive.",
//     required_fields: ["faction","enemy"],
//     default_difficulty: "Medium",
//     tags: ["capture","combat","stealth"]
// }
// ,{
// //2
//     quest_type: "Deliverance", 
//     quest_hook: "The {faction} has posted a bounty to clear the {enemy}s from {location}.",
//     required_fields: ["faction","enemy","location"],
//     default_difficulty: "Easy",
//     tags: ["combat","kill","bounty"]
// }
// ,{
// //3
//     quest_type: "Mystery", 
//     quest_hook: "The {faction} have asked you to help uncover the secret motivations of the {faction}.What are they really after?",
//     required_fields: ["faction","faction"],
//     default_difficulty: "Hard",
//     tags: ["intrigue","political","stealth"]
// }
// ,{
// //4
//     quest_type: "Retreival", 
//     quest_hook: "The local {npc_occupation} has been robbed by a recent customer and has asked you to find them and return what was stolen, and they will pay double if “they never see them around there again”. The robber is actually a powerful mage.",
//     required_fields: ["npc_occupation"],
//     default_difficulty: "Medium",
//     tags: ["justice","retreive","assassinate"]
// }
// ,{
// //5
//     quest_type: "Mystery", 
//     quest_hook: "People have been going missing from {location} and the {faction} have asked you to investigate. In truth, a {enemy} has been killing the inhabitants because one of them murdered another.",
//     required_fields: ["location","faction","enemy"],
//     default_difficulty: "Medium",
//     tags: ["mystery","murder"]
// }
// ,{
// //6
//     quest_type: "Deliverance", 
//     quest_hook: "A nearby settlement of {enemy}s has been causing the locals trouble. The {location} guard has asked you to ensure they don't cause any more problems.",
//     required_fields: ["enemy","location"],
//     default_difficulty: "Easy",
//     tags: ["combat","kill","bounty"]
// }
// ,{
// //7
//     quest_type: "Retreival", 
//     quest_hook: "A long forgotten relic, {object}, is rumored to be in ruins to the South of {location}. A local {npc_occupation} has asked you to retrieve it for them.",
//     required_fields: ["object","location","npc_occupation"],
//     default_difficulty: "Hard",
//     tags: ["magic item","epic quest"]
// }
// ,{
// //8
//     quest_type: "Rescue", 
//     quest_hook: "The princess of {location} has been captured and taken to {location}. The king has asked you to retrieve her before it's too late.",
//     required_fields: ["location","location"],
//     default_difficulty: "Hard",
//     tags: ["infiltration","combat","stealth"]
// }
// ,{
// //9
//     quest_type: "Deliverance", 
//     quest_hook: "A new drug has been circulating around {location} and wreaking havoc. The {faction} has asked you to find the dealers and stop the distribution.",
//     required_fields: ["location","faction"],
//     default_difficulty: "Medium",
//     tags: ["drugs","mystery","intrigue"]
// }
// ,{
// //10
//     quest_type: "Exploration", 
//     quest_hook: "A thick fog has revealed a new island just off the coast — it wasn’t there last week. A local {npc_occupation} is hiring mercenaries to explore it before the rival {npc_occupation} arrives.",
//     required_fields: ["npc_occupation"],
//     default_difficulty: "Easy",
//     tags: ["explore","mystery"]
// }
// ,{
// //11
//     quest_type: "Delivery", 
//     quest_hook: "A {npc_occupation} asks the party to return a cursed {object} to {location} where it was made. Each night spent carrying it brings vivid dreams and whispers of power.",
//     required_fields: ["npc_occupation","object","location"],
//     default_difficulty: "Hard",
//     tags: ["epic quest","deliver","curse","magic item"]
// }
// ,{
// //12
//     quest_type: "Restoration", 
//     quest_hook: "A once-lush druidic grove is turning gray and brittle. The druids believe a sacred spring has been poisoned upstream — but the source lies deep within {enemy}-infested caves.",
//     required_fields: ["enemy"],
//     default_difficulty: "Medium",
//     tags: ["cave crawl","traps","restore"]
// }
// ,{
// //13
//     quest_type: "Mystery", 
//     quest_hook: "An entire crew of {npc_occupation} vanished after uncovering a strange {object}. Their families beg for help — the {location} echoes with strange whispers, and no one dares go inside.",
//     required_fields: ["npc_occupation","object","location"],
//     default_difficulty: "Medium",
//     tags: ["mystery","magic item"]
// }
,{
//14
    quest_type: "", 
    quest_hook: "",
    required_fields: [""],
    default_difficulty: "",
    tags: [""]
}
,{
//15
    quest_type: "", 
    quest_hook: "",
    required_fields: [""],
    default_difficulty: "",
    tags: [""]
}
,{
//16
    quest_type: "", 
    quest_hook: "",
    required_fields: [""],
    default_difficulty: "",
    tags: [""]
}
,{
//17
    quest_type: "", 
    quest_hook: "",
    required_fields: [""],
    default_difficulty: "",
    tags: [""]
}
,{
//18
    quest_type: "", 
    quest_hook: "",
    required_fields: [""],
    default_difficulty: "",
    tags: [""]
}
,{
//19
    quest_type: "", 
    quest_hook: "",
    required_fields: [""],
    default_difficulty: "",
    tags: [""]
}
,{
//20
    quest_type: "", 
    quest_hook: "",
    required_fields: [""],
    default_difficulty: "",
    tags: [""]
}
,{
//21
    quest_type: "", 
    quest_hook: "",
    required_fields: [""],
    default_difficulty: "",
    tags: [""]
}
,{
//22
    quest_type: "", 
    quest_hook: "",
    required_fields: [""],
    default_difficulty: "",
    tags: [""]
}
,{
//23
    quest_type: "", 
    quest_hook: "",
    required_fields: [""],
    default_difficulty: "",
    tags: [""]
}
,{
//24
    quest_type: "", 
    quest_hook: "",
    required_fields: [""],
    default_difficulty: "",
    tags: [""]
}
,{
//25
    quest_type: "", 
    quest_hook: "",
    required_fields: [""],
    default_difficulty: "",
    tags: [""]
}
,{
//26
    quest_type: "", 
    quest_hook: "",
    required_fields: [""],
    default_difficulty: "",
    tags: [""]
}
,{
//27
    quest_type: "", 
    quest_hook: "",
    required_fields: [""],
    default_difficulty: "",
    tags: [""]
}
,{
//28
    quest_type: "", 
    quest_hook: "",
    required_fields: [""],
    default_difficulty: "",
    tags: [""]
}
,{
//29
    quest_type: "", 
    quest_hook: "",
    required_fields: [""],
    default_difficulty: "",
    tags: [""]
}
,{
//30
    quest_type: "", 
    quest_hook: "",
    required_fields: [""],
    default_difficulty: "",
    tags: [""]
}
,{
//31
    quest_type: "", 
    quest_hook: "",
    required_fields: [""],
    default_difficulty: "",
    tags: [""]
}
,{
//32
    quest_type: "", 
    quest_hook: "",
    required_fields: [""],
    default_difficulty: "",
    tags: [""]
}
,{
//33
    quest_type: "", 
    quest_hook: "",
    required_fields: [""],
    default_difficulty: "",
    tags: [""]
}
,{
//34
    quest_type: "", 
    quest_hook: "",
    required_fields: [""],
    default_difficulty: "",
    tags: [""]
}
,{
//35
    quest_type: "", 
    quest_hook: "",
    required_fields: [""],
    default_difficulty: "",
    tags: [""]
}
,{
//36
    quest_type: "", 
    quest_hook: "",
    required_fields: [""],
    default_difficulty: "",
    tags: [""]
}
,{
//37
    quest_type: "", 
    quest_hook: "",
    required_fields: [""],
    default_difficulty: "",
    tags: [""]
}
,{
//38
    quest_type: "", 
    quest_hook: "",
    required_fields: [""],
    default_difficulty: "",
    tags: [""]
}
,{
//39
    quest_type: "", 
    quest_hook: "",
    required_fields: [""],
    default_difficulty: "",
    tags: [""]
}
,{
//40
    quest_type: "", 
    quest_hook: "",
    required_fields: [""],
    default_difficulty: "",
    tags: [""]
}
];

let questsInserted = 0;

safeForEach(quests, (quest, i) => {
    if (quest.quest_type != "" && quest.quest_hook != "" && quest.required_fields != [""] && quest.default_difficulty != "") {
        if(insertQuestTemplate(quest)) {
            questsInserted += 1;
        }
    } else {
        console.log("Missing information at index ", i);
    }
});

console.log(questsInserted, " quests inserted.");

// Run this from ai-service: node app/db_updates/insertQuestTemplates.js