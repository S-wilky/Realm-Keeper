function cartesianProduct(arrays) {
  let result = [[]];

  for (const arr of arrays) {
    const newResult = [];
    for (const prefix of result) {
      for (const value of arr) {
        newResult.push([...prefix, value]);
      }
    }
    result = newResult;
  }

  return result;
};

export default cartesianProduct;