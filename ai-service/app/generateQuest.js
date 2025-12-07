import supabase from "../../frontend/src/services/supabase-client";

// Random row picker helper
function pickRandom(list) {
  if (list==undefined) {
    return null;
  } else {
    return list[Math.floor(Math.random() * list.length)];
  }
}

async function generateQuest() {
  // 1. Pick a random template
  const { data, error } = await supabase
    .from('quest_templates')
    .select()   //Add filters here. Potential to reduce payload?
  console.log('Quests: ', data);
  if (error) throw error;
  const quest = pickRandom(data);
  console.log('Selected Quest: ', quest);

  // 2. Get required fields
  const fields = quest.required_fields;
//   console.log('Fields:', fields);

  // 3. Resolve database choices for placeholders
  const fillableFields = {};

  for (const field of fields) {
    // console.log('Field: ', field);
    let table = '';
    if (field.substr(field.length - 1)=='y') {
        table = field.slice(0, field.length - 1) + 'ies';   //ex: change enemy to enemies table
    } else {
        table = field + 's';
    }
    const res = await supabase.from(table).select()
    // client.query(`SELECT * FROM ${field}s`);  // factions, locations, objects, enemies
    fillableFields[field] = pickRandom(res.data);
    // console.log('Returned Data:', res)
    // console.log('table', table);
  }
  console.log('Selected options for each field: ', fillableFields);

  // 4. Build quest hook sentence
  let questHook = quest.quest_hook;
  for (const field of fields) {
    questHook = questHook.replace(`{${field}}`, fillableFields[field]?.name || "[unknown]");
  }
  console.log("Quest hook: ", questHook);

//   // 5. Build structured JSON result
  const questData = {
    template: quest.quest_type,
    setting: fillableFields.location?.biome || null,
    faction: fillableFields.faction?.name || null,
    enemy: fillableFields.enemy?.name || null,
    difficulty: quest.default_difficulty,
    quest_hook: questHook
  };
  console.log("Quest in JSON:", questData);

  return questData;
}

export default generateQuest;