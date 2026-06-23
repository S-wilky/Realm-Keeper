export default function pickRandom<T>(list: T[] | null | undefined): T {
    if (!list || list.length === 0) {
        throw new Error("pickRandom: list is empty or undefined");
    }

    const index = Math.floor(Math.random() * list.length);
    const item = list[index];

    if (item === undefined) {
        // extremely defensive, never hit
        throw new Error("pickRandom: index out of bounds");
    }

    return item;
}