import supabase from "../../../backend/src/database/supabase-client-backend.js";
import safeForEach from "../utils/safeForEach.js";

async function insertNpcOccupation(npc) {
    const { error } = await supabase
        .from('npc_occupations')
        .insert({ 
            name: npc.occupation_name,
            npc_type: npc.npc_type,
            factions: npc.factions,
            locations: npc.locations,
            tags: npc.tags
        })

    if (error) {
        console.error(error);
        return false;
    } else {
        return true;
    }
};

const npcs = [
{
//0
    occupation_name: "farmer", 
    npc_type: "common",
    factions: [""],
    locations: ["farm","village"],
    tags: ["worker","farm"]
}
,{
//1
    occupation_name: "Mayor", 
    npc_type: "leader",
    factions: [""],
    locations: [""],
    tags: ["questgiver"]
}
,{
//2
    occupation_name: "King", 
    npc_type: "leader",
    factions: [""],
    locations: [""],
    tags: ["questgiver"]
}
,{
//3
    occupation_name: "miner", 
    npc_type: "common",
    factions: [""],
    locations: ["mine","village"],
    tags: ["worker","mine"]
}
,{
//4
    occupation_name: "thief", 
    npc_type: "criminal",
    factions: ["Thieve's Guild"],
    locations: ["city"],
    tags: [""]
}
,{
//5
    occupation_name: "alchemist", 
    npc_type: "artisan",
    factions: ["Thieve's Guild"],
    locations: [""],
    tags: [""]
}
]

let npcsInserted = 0;

safeForEach(npcs, (npc, i) => {
    if (npc.occupation_name != "") {
        if(insertNpcOccupation(npc)) {
            npcsInserted += 1;
        }
    } else {
        console.log("Missing information at index ", i);
    }
});

console.log(npcsInserted, " prompts inserted.");

// Run this from ai-service: node app/db_updates/insertNpcOccupations.js