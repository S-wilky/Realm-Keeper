function getFieldArrays(required_fields, replaceable_field_arrays) {

    let required_field_tables = [];

    for (const field of required_fields) {

        let selected_field = null;

        switch (field) {
            case "enemy":
                selected_field = replaceable_field_arrays[0].values;
                break;
            case "faction":
                selected_field = replaceable_field_arrays[1].values;
                break;
            case "location":
                selected_field = replaceable_field_arrays[2].values;
                break;
            case "npc_occupation":
                selected_field = replaceable_field_arrays[3].values;
                break;
            case "object":
                selected_field = replaceable_field_arrays[4].values;
                break;
            case "quest_type":
                selected_field = replaceable_field_arrays[5].values;
                break;
            case "verb":
                selected_field = replaceable_field_arrays[6].values;
                break;
            default:
                console.log("No database field matching ", field);
        }
        // console.log("Selected_field: ", field, selected_field);
        // required_fields.push(field);
        required_field_tables.push(selected_field);
        // required_field_tables.push({field, selected_field});
    }
    return required_field_tables;
};

export default getFieldArrays;


//OLD CODE JUST IN CASE
    // for (const field of template.required_fields) {

    //   let selected_field = null;

    //   switch (field) {
    //     case "enemy":
    //       selected_field = enemies;
    //       break;
    //     case "faction":
    //       selected_field = factions;
    //       break;
    //     case "location":
    //       selected_field = locations;
    //       break;
    //     case "npc_occupation":
    //       selected_field = npc_occupations;
    //       break;
    //     case "object":
    //       selected_field = objects;
    //       break;
    //     case "verb":
    //       selected_field = verbs;
    //       break;
    //     case "quest_type":
    //       selected_field = quest_types;
    //       break;
    //     default:
    //       console.log("No database field matching ", field);
    //   }
    //   // required_fields.push(field);
    //   required_field_tables.push(selected_field);
    //   // required_field_tables.push({field, selected_field});
    // }