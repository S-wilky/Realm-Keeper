import supabase from "./supabase-client-backend.js";
import safeForEach from "../utils/safeForEach.js";

type NpcOccupation = {
    occupation_name: string;
    npc_type: string;
    factions: string[];
    locations: string[];
    tags: string[];
};

async function insertNpcOccupation(
    npc: NpcOccupation
): Promise<boolean> {
    const { error } = await supabase
        .from("npc_occupations")
        .insert({
            name: npc.occupation_name,
            npc_type: npc.npc_type,
            factions: npc.factions,
            locations: npc.locations,
            tags: npc.tags,
        });

    if (error) {
        console.error(error);
        return false;
    }

    return true;
}

const npcs: NpcOccupation[] = [
    {
        //0
        occupation_name: "farmer",
        npc_type: "common",
        factions: [""],
        locations: ["farm", "village"],
        tags: ["worker", "farm"],
    },
    {
        //1
        occupation_name: "Mayor",
        npc_type: "leader",
        factions: [""],
        locations: [""],
        tags: ["questgiver"],
    },
    {
        //2
        occupation_name: "King",
        npc_type: "leader",
        factions: [""],
        locations: [""],
        tags: ["questgiver"],
    },
    {
        //3
        occupation_name: "miner",
        npc_type: "common",
        factions: [""],
        locations: ["mine", "village"],
        tags: ["worker", "mine"],
    },
    {
        //4
        occupation_name: "thief",
        npc_type: "criminal",
        factions: ["Thieve's Guild"],
        locations: ["city"],
        tags: [""],
    },
    {
        //5
        occupation_name: "alchemist",
        npc_type: "artisan",
        factions: ["Thieve's Guild"],
        locations: [""],
        tags: [""],
    },
];

async function insertAllNpcOccupations(): Promise<void> {
    let npcsInserted = 0;

    await safeForEach(
        npcs,
        async (npc: NpcOccupation, i: number): Promise<void> => {
            if (npc.occupation_name !== "") {
                const success = await insertNpcOccupation(npc);

                if (success) {
                    npcsInserted += 1;
                }
            } else {
                console.log("Missing information at index", i);
            }
        }
    );

    console.log(npcsInserted, "prompts inserted.");
}

insertAllNpcOccupations().catch((error: unknown) => {
    console.error("Failed to insert NPC occupations:", error);
});

// Run this from ai-service:
// node app/db_updates/insertNpcOccupations.js