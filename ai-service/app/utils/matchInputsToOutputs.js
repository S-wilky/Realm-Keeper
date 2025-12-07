// matchInputsToOutputs.js
// Strict matching: input-required fields must exist in output and values must match.
// No Cartesian expansion. Dedupe exact (input, output, fields) combos.

function replacePlaceholders(template, fields) {
  // Replace {field} placeholders with fields[field] when present,
  // otherwise leave the placeholder in place.
  return template.replace(/{(.*?)}/g, (_, key) => {
    // If nested or spaces, trim key
    const k = key.trim();
    // Allow numeric/falsey values (0, false)
    if (Object.prototype.hasOwnProperty.call(fields, k) && fields[k] !== undefined && fields[k] !== null) {
      return String(fields[k]);
    }
    return `{${k}}`;
  });
}

export default function matchInputsToOutputs(input_prompts, output_quests, optionTables) {
  const pairs = [];
  const seen = new Set();
  const system_prompt = "You are a creative tabletop RPG designer specializing in 5e-friendly quests. You generate short, punchy quest hooks with clear motivations, simple stakes, and genre-appropriate flavor. Avoid placeholders and always produce fully written names, locations, and details.";
  let rowsPushed = 0;
  let rowsSkipped = 0;
//   let count = 0;    // counter for testing.
//   const maxRows = 1000; // limit for testing.

  // ---------------------------------------
  // Flatten option tables (kept as you requested)
  // ---------------------------------------
  const newOptionTables = {};
  for (const row in optionTables) {
    const entry = optionTables[row];
    if (!entry || !entry.field) continue;
    if (entry.field === "enemies") {
      newOptionTables["enemy"] = entry.values;
    } else {
      newOptionTables[entry.field.slice(0, -1)] = entry.values;
    }
  }
//   console.log(newOptionTables);
  // newOptionTables available if you want to use later (not used in strict match)

  // ---------------------------------------
  // Main matching
  // ---------------------------------------
  for (const input of input_prompts) {

    // 1) exclude 'verb' from consideration (but keep quest_type if present)
    const inputFields = (input.required_fields || []).filter((f) => f !== "verb");
    // console.log("Input fields: ", inputFields);

    // If the input has no required fields after filtering, skip it.
    if (inputFields.length === 0) continue;

    for (const output of output_quests) {
        // if (count >= maxRows) {break} else {count++}; // limit for testing.

        let newInputFields = inputFields;

        // quest_type must match *if input requires it*
        if (inputFields.includes("quest_type")) {
            if (input.field_values.quest_type !== output.quest_type) {
                // console.log("Output fields: ", output.required_fields, " Input quest type: ", input.field_values.quest_type, " Output quest type: ", output.quest_type);
                // console.log("Quest type doesn't match. Aborting.");
                rowsSkipped++;
                continue;
            } else {
                newInputFields = newInputFields.filter((f) => f !== "quest_type");
            }
        }

        // 2) Require that the output contains every field that the input requires
        const outputHasAllInputFields = newInputFields.every((f) =>
            (output.required_fields || []).includes(f)
        );
        // if (!outputHasAllInputFields) console.log("Fields don't match, aborting.");
        if (!outputHasAllInputFields) continue;

        // 3) For each required input field, values must match exactly
        let mismatch = false;
        for (const f of newInputFields) {
            const inVal = input.field_values ? input.field_values[f] : undefined;
            const outVal = output.field_values ? output.field_values[f] : undefined;

            // If either side is undefined -> treat as mismatch (shouldn't happen due to previous check but safe)
            if (inVal === undefined || outVal === undefined) {
            mismatch = true;
            rowsSkipped++;
            console.log("Undefined value");
            break;
            }

            // strict equality for matching
            if (String(inVal) !== String(outVal)) {
            mismatch = true;
            rowsSkipped++;
            // console.log("mismatch: ", mismatch, "f: ", f, "In val: ", inVal, " Out val: ", outVal);
            break;
            }
            // console.log("mismatch: ", mismatch, "f: ", f, "In val: ", inVal, " Out val: ", outVal);
        }
        if (mismatch) continue;

        // 4) Build combined fields (output values overridden by input values where present)
        // This ensures placeholders are replaced with the values actually used in the match.
        const combinedFields = {
            ...(output.field_values || {}),
            ...(input.field_values || {}),
        };

        // 5) Deduplicate — create deterministic key
        // Sort field keys for deterministic ordering of fields part
        const fieldKeys = Object.keys(combinedFields).sort();
        const fieldsKey = fieldKeys.map((k) => `${k}:${combinedFields[k]}`).join("|");

        const inputKey = input.id ?? input.input_prompt;
        const outputKey = output.id ?? output.quest_hook;

        const comboKey = `${String(inputKey)}||${String(outputKey)}||${fieldsKey}`;

        if (seen.has(comboKey)) {
            // already added this exact combination
            continue;
        }
        seen.add(comboKey);

        // 6) Replace placeholders in both input and output templates with the combinedFields
        const input_text = replacePlaceholders(input.input_prompt || "", combinedFields);
        const output_text = replacePlaceholders(output.quest_hook || "", combinedFields);

        const prompt_text = "<|system|>\n" + system_prompt + "\n<|user|>\n" + input_text + "\n<|assistant|>\n" + output_text

        // push final pair (include fields for debugging/training metadata)
        rowsPushed++;
        pairs.push({
            "text": prompt_text
            // input_text,
            // output_text,
            // fields: combinedFields,
      });
    } // end output loop
  } // end input loop

  console.log("Rows skipped: ", rowsSkipped);
  console.log("Rows pushed to JSONL: ", rowsPushed);
  return pairs;
}





// import cartesianProduct from "./cartesianProduct.js";

// function matchInputsToOutputs(input_prompts, output_quests, optionTables) {
//   const pairs = [];
//   const seen = new Set();   // tracks unique combinations
//   let rowsRemoved = 0;
//   let newOptionTables = {};
//   let count = 0;

//   //flatten option tables:
//   for (const row in optionTables) {
//     // console.log("Row", optionTables[row]);
//     if (optionTables[row].field == "enemies") {
//         newOptionTables["enemy"] = optionTables[row].values;
//     } else {
//         newOptionTables[optionTables[row].field.slice(0, -1)] = optionTables[row].values;
//     }
//   }
// //   console.log("New option table: ", newOptionTables);

//   for (const input of input_prompts) {
//     if (count >= 2) {break} else {count++}; // limit for testing.

//     // Remove "verb" from consideration
//     const inputFields = input.required_fields.filter(f => f !== "verb");

//     for (const output of output_quests) {

//         // quest_type must match *if input requires it*
//         if (inputFields.includes("quest_type")) {
//             if (input.field_values.quest_type !== output.quest_type) {
//             continue;
//             }
//         }

//         // Check that the output contains all the required fields
//         // const outputHasAllFields = inputFields.every(
//         //     f => output.hasOwnProperty(f)
//         // );
//         // if (!outputHasAllFields) continue;

//         // Now strict-compare only the required fields
//         // const matches = input.required_fields.every(
//         //     field => input[field] === output[field]
//         // );
//         // if (!matches) continue;

//         // Deduplication key
//         // Using only required matching fields + unique ids if available
//         const key = JSON.stringify({
//             input,
//             output
//         });

//         if (seen.has(key)) {
//             continue 
//         } else {
//             seen.add(key);
//         }

//     //   // 3. Check overlapping fields match
//     //   let mismatch = false;

//     //   for (const field of inputFields) {
//     //     // Skip fields input has that are not in output (OK)
//     //     if (!output.required_fields.includes(field)) continue;

//     //     // If both have the field, values must match
//     //     // console.log('Input field value: ', input.field_values[field]);
//     //     // console.log('Output field value: ', output.field_values[field]);
//     //     if (input.field_values[field] !== output.field_values[field]) {
//     //       mismatch = true;
//     //       continue;
//     //     }
//     //   }

//     //   if (mismatch) continue;

//     //   // 4. Identify missing fields (in output but not in input)
//     //   const missingFields = output.required_fields.filter(
//     //     f => !inputFields.includes(f)
//     //   );

//     //   // 5. Build all combinations for missing fields
//     //   const missingValueSets = missingFields.map(field => {
//     //     // console.log("Field: ", field);
//     //     const values = newOptionTables[field]; // from your DB tables
//     //     return values.map(v => ({ [field]: v }));
//     //   });

//     //   const expansions =
//     //     missingValueSets.length > 0
//     //       ? cartesianProduct(missingValueSets)
//     //       : [{}]; // no missing fields

//     //   // 6. Combine input + output + missing fields
//     //   for (const extra of expansions) {
//     //     const combinedFields = {
//     //       ...output.field_values,
//     //       ...extra,
//     //       ...input.field_values
//     //     };

//     //     const comboKey = JSON.stringify({
//     //       inputPrompt: input.id ?? input.input_prompt, 
//     //       outputQuest: output.id ?? output.quest_hook,
//     //       fields: combinedFields,
//     //     });

//     //     if (seenCombos.has(comboKey)) {
//     //       // Skip duplicates
//     //       rowsRemoved++;
//     //       continue;
//     //     }

//     //     seenCombos.add(comboKey);

//     //     // Your final training record format:
//     //     pairs.push({
//     //       input_text: input.input_prompt.replace(/{(.*?)}/g, (_, key) => combinedFields[key] || `{${key}}`),
//     //       output_text: output.quest_hook.replace(/{(.*?)}/g, (_, key) => combinedFields[key] || `{${key}}`),
//     //       fields: combinedFields,
//     //     });
//     //   }
//     }
//   }
//   console.log("Rows removed: ", rowsRemoved);
//   return pairs;
// }

// export default matchInputsToOutputs;