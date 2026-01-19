export default function isEmpty(array) {
    const isEmpty = array.some(obj => obj.name === '' || null);
    return isEmpty;
};