import supabase from "../../../frontend/src/services/supabase-client";
import pickRandom from "../utils/pickRandom";

async function generateQuest(input_prompt = null) {
  // 1. Pick a random template
  console.log("Prompt passed to GenerateQuest: ", input_prompt);
  let query = supabase
      .from('quest_templates')
      .select()   //Add filters here. Potential to reduce payload?

  let new_required_fields = [""];
  if (input_prompt !== null) {
    if (input_prompt.quest_type !== null) { 
      console.log('Quest type found: ', input_prompt.quest_type);
      query = query.eq('quest_type', input_prompt.quest_type.quest_type);
      // console.log("Before remove quest_type: ", new_required_fields);
      new_required_fields = input_prompt.required_fields.filter(item => item != "quest_type");  //Since quest_type is a separate field for quests, we need to handle it separately
      // console.log("After remove quest_type: ", new_required_fields);
    } else {
      new_required_fields = input_prompt.required_fields;
    }
    if (input_prompt.required_fields.includes("verb")) {
      new_required_fields = new_required_fields.filter(item => item !== "verb");  //verb doesn't exist in quest required fields, only input prompts
    }
    console.log("Prompt Required Fields: ", new_required_fields);
    if (new_required_fields != [""]) {
      query = query.contains('required_fields', new_required_fields);
    }
  }

  let questHook = "";
  let questType = "";
  let biome = "";
  let faction = "";
  let enemy = "";
  let difficulty = "";

  const { data, error } = await query;
  if (error) {
    console.error(error);
    questHook = "Could not find a quest type that matches these parameters."
  } else {
    console.log('Matching quests: ', data);
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
      let query = supabase.from(table).select();
      if (new_required_fields.includes(field)) {
        console.log("Replaced field: ", field);
        console.log("Replaced with: ", input_prompt.replaced_fields[field]);
        query = query.eq('name', input_prompt.replaced_fields[field])
        // fillableFields[field] = input_prompt.replaced_fields[field];
      }
      const { data, error } = await query;
      // console.log('Returned Data:', res)
      // console.log('Table:', table);
      // client.query(`SELECT * FROM ${field}s`);  // factions, locations, objects, enemies
      if (error) console.error(error);
      fillableFields[field] = pickRandom(data);
    }
    // console.log('Selected options for each field: ', fillableFields);

    // 4. Build quest hook sentence
    questHook = quest.quest_hook;
    for (const field of fields) {
      questHook = questHook.replace(`{${field}}`, fillableFields[field].name);
    }
    // console.log("Quest hook: ", questHook);

    // Set fields equal to selected quest fields
    questType = quest.quest_type || null;
    biome = fillableFields.location?.biome || null;
    faction = fillableFields.faction?.name || null;
    enemy = fillableFields.enemy?.name || null;
    difficulty = quest.default_difficulty || null;
  }

  // 5. Build structured JSON result
  const questData = {
    template: questType || null,
    setting: biome || null,
    faction: faction || null,
    enemy: enemy || null,
    difficulty: difficulty || null,
    quest_hook: questHook
  };
  // console.log("Quest in JSON:", questData);

  return questData;
}

export default generateQuest;