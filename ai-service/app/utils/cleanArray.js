function cleanArray(array) {
    let newArray = [];
    for (const value of array.values) {
        if (array.field == "verb") {
            return array;
        } else if (array.field == "quest_types") {
            if (!newArray.includes(value.quest_type)) {
                newArray.push(value.quest_type);
            }
        } else {
            newArray.push(value.name);
        }
    }
    // console.log('Field: ', array.field,);
    // console.log('NewArray: ', newArray);
    return newArray;
}

export default cleanArray;