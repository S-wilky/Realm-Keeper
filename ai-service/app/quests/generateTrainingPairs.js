// run from ai-service:
// node app/quests/generateTrainingPairs.js

import cartesianProduct from '../utils/cartesianProduct.js';
import cleanArray from '../utils/cleanArray.js';
import getFieldArrays from '../utils/getFieldArrays.js';
import matchInputsToOutputs from '../utils/matchInputsToOutputs.js';
import writeJSONL from '../utils/writeJSONL.js';
import supabase from '../../../backend/src/database/supabase-client-backend.js';

async function generateTrainingPairs() {
  console.warn("NEW RUN");

  // get all input templates
  const { data: templates , error: e1 } = await supabase
    .from('input_templates')
    .select();

  if (e1) console.error(e1);
  // console.log(templates);

  // get all template fields in a single array of values
  let replaceable_field_arrays = [];

  let { data: enemies, error: e2 } = await supabase.from('enemies').select();
  if (e2) console.error(e2);
  enemies = cleanArray({field: "enemies", values: enemies})
  replaceable_field_arrays.push({field: "enemies", values: enemies})

  let { data: factions, error: e3 } = await supabase.from('factions').select();
  if (e3) console.error(e3);
  factions = cleanArray({field: "factions", values: factions})
  replaceable_field_arrays.push({field: "factions", values: factions})

  let { data: locations, error: e4 } = await supabase.from('locations').select();
  if (e4) console.error(e4);
  locations = cleanArray({field: "locations", values: locations})
  replaceable_field_arrays.push({field: "locations", values: locations})

  let { data: npc_occupations, error: e5 } = await supabase.from('npc_occupations').select();
  if (e5) console.error(e5);
  npc_occupations = cleanArray({field: "npc_occupations", values: npc_occupations})
  replaceable_field_arrays.push({field: "npc_occupations", values: npc_occupations})

  let { data: objects, error: e6 } = await supabase.from('objects').select();
  if (e6) console.error(e6);
  objects = cleanArray({field: "objects", values: objects})
  replaceable_field_arrays.push({field: "objects", values: objects})

  let { data: quest_types, error: e7 } = await supabase.from('quest_templates').select('quest_type')
  if (e6) console.error(e7);
  quest_types = cleanArray({field: "quest_types", values: quest_types})
  replaceable_field_arrays.push({field: "quest_types", values: quest_types})

  const verbs = ["Create","Generate","Give me","Write"];
  replaceable_field_arrays.push({field: "verbs", values: verbs})

  let input = "";
  let output = "";
  let input_prompts = [];
  let output_quests = [];
  // let count = 0;

  for (const template of templates) {
    // if (count >= 1) {break} else {count++}; // limit for testing.
    // console.log(template);
    input = template.input_prompt;
    // let required_field_tables = [];
    // let required_fields = [];

    let input_required_field_tables = getFieldArrays(template.required_fields, replaceable_field_arrays);
    // console.log("required_field_tables", input_required_field_tables);

    let input_combinations = cartesianProduct(input_required_field_tables);

    // add selected fields to field_value map to send to the matchInputsToOutputs function
    for (const combo of input_combinations) {
      const inputWithFieldValues = {
        "input_prompt": template.input_prompt, 
        "required_fields": template.required_fields, 
        "field_values": {}
      };
      let fieldValues = [];
      for (let i = 0; i < template.required_fields.length; i++) {
        fieldValues[template.required_fields[i]] = combo[i];
        // console.log("Field: ", template.required_fields[i]);
        // console.log("Value: ", combo[i]);
        // console.log("Field value: ", fieldValues[template.required_fields[i]]);
      }
      inputWithFieldValues["field_values"] = fieldValues;
      input_prompts.push(inputWithFieldValues);
      // console.log("Input with Field Values: ", inputWithFieldValues);
    }
    // console.log("Input Prompts: ", input_prompts);

    // filter out verb and quest_type from required fields for matching with quests
    let new_required_fields = template.required_fields;
    if (new_required_fields.includes("quest_type")) {
      new_required_fields = new_required_fields.filter(item => item != "quest_type");  //Since quest_type is a separate field for quests, we need to handle it separately
    }
    if (new_required_fields.includes("verb")) {
      new_required_fields = new_required_fields.filter(item => item !== "verb");  //verb doesn't exist in quest required fields, only input prompts
    }
    // console.log("new required fields", new_required_fields)

    // find all quest templates that match with the input prompt
    const { data: matching_quests, error: e8} = await supabase
      .from('quest_templates')
      .select()   //Add filters here. Potential to reduce payload?
      .contains('required_fields', new_required_fields);

    if (e8) console.error(e8);
    // console.log("quests: ", matching_quests);

    for (const quest_template of matching_quests) {
      // console.log(quest_template);
      // console.log(quest_template.required_fields);

      let quest_required_field_tables = getFieldArrays(quest_template.required_fields, replaceable_field_arrays);
      // console.log("quest_required_field_tables", quest_required_field_tables)
      output = quest_template.quest_hook;
      // console.log("quest template: ", output);

      let output_combinations = cartesianProduct(quest_required_field_tables);

      // replace the input_prompt required fields with each combination of fields and push each to the input_prompts array
      for (const combo of output_combinations) {
        const outputWithFieldValues = {
          "quest_type": quest_template.quest_type, 
          "quest_hook": quest_template.quest_hook, 
          "required_fields": quest_template.required_fields, 
          "field_values": {}
        };
        let fieldValues = [];

        for (let i = 0; i < quest_template.required_fields.length; i++) {
          fieldValues[quest_template.required_fields[i]] = combo[i];
        // console.log("Field: ", quest_template.required_fields[i]);
        // console.log("Value: ", combo[i]);
        // console.log("Field value: ", fieldValues[quest_template.required_fields[i]]);
        }

        outputWithFieldValues["field_values"] = fieldValues;
        output_quests.push(outputWithFieldValues);
      }
    }
    // console.log("Output quests: ", output_quests);


  }
  const trainingRows = matchInputsToOutputs(input_prompts, output_quests, replaceable_field_arrays);

  await writeJSONL(trainingRows, "./exports/training_data.jsonl");
  console.log("JSON export complete!")
}

// export default generateTrainingPairs;
generateTrainingPairs();