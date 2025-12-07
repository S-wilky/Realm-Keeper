// Random row picker helper
function pickRandom(list) {
  if (list==undefined) {
    return null;
  } else {
    return list[Math.floor(Math.random() * list.length)];
  }
};

export default pickRandom;