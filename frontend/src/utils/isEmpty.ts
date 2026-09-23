export default function isEmpty(
    array: { name: string | null }[]
): boolean {
    const isEmpty = array.some(
        (obj) =>
            obj.name === "" ||
            obj.name === null
    );

    return isEmpty;
}