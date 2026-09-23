function safeForEach<T>(
    arr: T[],
    callback: (
        item: T,
        index: number,
        array: T[]
    ) => void
): void {
    if(!Array.isArray(arr)) {
        console.error(
            "Error: First argument must be an array."
        );
        return;
    }

    if (typeof callback !== "function") {
        console.error(
            "Error: Second argument must be a function."
        );
        return;
    }

    arr.forEach(callback);
}

export default safeForEach;