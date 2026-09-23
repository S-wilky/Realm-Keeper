function cartesianProduct<T>(
    arrays: T[][]
): T[][] {
    let result: T[][] = [[]];

    for (const arr of arrays) {
        const newResult: T[][] = [];

        for (const prefix of result) {
            for (const value of arr) {
                newResult.push([
                    ...prefix,
                    value,
                ]);
            }
        }

        result = newResult;
    }

    return result;
}

export default cartesianProduct;