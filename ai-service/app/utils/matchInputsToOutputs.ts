type InputPrompt = {
    id?: string | number;
    input_prompt: string;
    required_fields: string[];
    field_values: Record<string, string>;
};

type OutputQuest = {
    id?: string | number;
    quest_type: string;
    quest_hook: string;
    required_fields: string[];
    field_values: Record<string, string>;
};

type OptionTable = {
    field: string;
    values: string[];
};

type TrainingPair = {
    text: string;
};

function replacePlaceholders(
    template: string,
    fields: Record<
        string,
        string | number | boolean
    >
): string {
    return template.replace(
        /{(.*?)}/g,
        (_match, key: string) => {
            const k = key.trim();

            if (
                Object.prototype.hasOwnProperty.call(
                    fields,
                    k
                ) &&
                fields[k] !== undefined &&
                fields[k] !== null
            ) {
                return String(fields[k]);
            }

            return `{${k}}`;
        }
    );
}

export default function matchInputsToOutputs(
    input_prompts: InputPrompt[],
    output_quests: OutputQuest[],
    optionTables: OptionTable[]
): TrainingPair[] {
    const pairs: TrainingPair[] = [];
    const seen = new Set<string>();

    const system_prompt =
        "You are a creative tabletop RPG designer specializing in 5e-friendly quests. You generate short, punchy quest hooks with clear motivations, simple stakes, and genre-appropriate flavor. Avoid placeholders and always produce fully written names, locations, and details.";

    let rowsPushed = 0;
    let rowsSkipped = 0;

    const newOptionTables: Record<
        string,
        string[]
    > = {};

    for (const row in optionTables) {
        const entry = optionTables[row];

        if (!entry || !entry.field)
            continue;

        if (
            entry.field === "enemies"
        ) {
            newOptionTables["enemy"] =
                entry.values;
        } else {
            newOptionTables[
                entry.field.slice(0, -1)
            ] = entry.values;
        }
    }

    for (const input of input_prompts) {
        const inputFields =
            (
                input.required_fields ??
                []
            ).filter(
                (f) => f !== "verb"
            );

        if (inputFields.length === 0)
            continue;

        for (const output of output_quests) {
            let newInputFields = [
                ...inputFields,
            ];

            if (
                inputFields.includes(
                    "quest_type"
                )
            ) {
                if (
                    input.field_values
                        .quest_type !==
                    output.quest_type
                ) {
                    rowsSkipped++;
                    continue;
                }

                newInputFields =
                    newInputFields.filter(
                        (f) =>
                            f !==
                            "quest_type"
                    );
            }

            const outputHasAllInputFields =
                newInputFields.every(
                    (f) =>
                    (
                        output.required_fields ??
                        []
                    ).includes(f)
                );

            if (
                !outputHasAllInputFields
            )
                continue;

            let mismatch = false;

            for (const f of newInputFields) {
                const inVal =
                    input.field_values?.[
                        f
                    ];

                const outVal =
                    output.field_values?.[
                        f
                    ];

                if (
                    inVal === undefined ||
                    outVal === undefined
                ) {
                    mismatch = true;
                    rowsSkipped++;
                    console.log(
                        "Undefined value"
                    );
                    break;
                }

                if (
                    String(inVal) !==
                    String(outVal)
                ) {
                    mismatch = true;
                    rowsSkipped++;
                    break;
                }
            }

            if (mismatch) continue;

            const combinedFields: Record<
                string,
                string
            > = {
                ...(output.field_values ??
                    {}),
                ...(input.field_values ??
                    {}),
            };

            const fieldKeys =
                Object.keys(
                    combinedFields
                ).sort();

            const fieldsKey =
                fieldKeys
                    .map(
                        (k) =>
                            `${k}:${combinedFields[k]}`
                    )
                    .join("|");

            const inputKey =
                    input.id ??
                    input.input_prompt;

            const outputKey =
                    output.id ??
                    output.quest_hook;

            const comboKey = `${String(
                inputKey
            )}||${String(
                outputKey
            )}||${fieldsKey}`;

            if (
                seen.has(comboKey)
            ) {
                continue;
            }

            seen.add(comboKey);

            const input_text =
                replacePlaceholders(
                    input.input_prompt ??
                        "",
                    combinedFields
                );

            const output_text =
                replacePlaceholders(
                    output.quest_hook ??
                        "",
                    combinedFields
                );

            const prompt_text =
                "<|system|>\n" +
                system_prompt +
                "\n<|user|>\n" +
                input_text +
                "\n<|assistant|>\n" +
                output_text;

            rowsPushed++;

            pairs.push({
                text: prompt_text,
            });
        }
    }

    console.log(
        "Rows skipped: ",
        rowsSkipped
    );

    console.log(
        "Rows pushed to JSONL: ",
        rowsPushed
    );

    return pairs;
}