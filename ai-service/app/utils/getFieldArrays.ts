type ReplaceableFieldArray = {
    field: string;
    values: string[];
};

function getFieldArrays(
    required_fields: string[],
    replaceable_field_arrays: ReplaceableFieldArray[]
): string[][] {
    const required_field_tables: string[][] = [];

    for (const field of required_fields) {
        let selected_field: string[] = [];

        switch (field) {
            case "enemy":
                selected_field =
                    replaceable_field_arrays[0]
                        ?.values ?? [];
                break;

            case "faction":
                selected_field =
                    replaceable_field_arrays[1]
                        ?.values ?? [];
                break;

            case "location":
                selected_field =
                    replaceable_field_arrays[2]
                        ?.values ?? [];
                break;

            case "npc_occupation":
                selected_field =
                    replaceable_field_arrays[3]
                        ?.values ?? [];
                break;

            case "object":
                selected_field =
                    replaceable_field_arrays[4]
                        ?.values ?? [];
                break;

            case "quest_type":
                selected_field =
                    replaceable_field_arrays[5]
                        ?.values ?? [];
                break;

            case "verb":
                selected_field =
                    replaceable_field_arrays[6]
                        ?.values ?? [];
                break;

            default:
                console.log(
                    "No database field matching ",
                    field
                );
        }

        required_field_tables.push(
            selected_field
        );
    }

    return required_field_tables;
}

export default getFieldArrays;