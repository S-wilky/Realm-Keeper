type QuestTypeValue = {
    quest_type: string;
};

type NameValue = {
    name: string;
};

type CleanArrayInput = {
    field: string;
    values: Array<QuestTypeValue | NameValue>;
};

function cleanArray(
    array: CleanArrayInput
): string[] {
    const newArray: string[] = [];

    for (const value of array.values) {
        if (array.field === "quest_types") {
            if (
                "quest_type" in value &&
                !newArray.includes(value.quest_type)
            ) {
                newArray.push(value.quest_type);
            }
        } else {
            if ("name" in value) {
                newArray.push(value.name);
            }
        }
    }

    return newArray;
}

export default cleanArray;