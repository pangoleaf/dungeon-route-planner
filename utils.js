export const dir = o => console.dir(o, {depth: null});

export const arrInclArr = (arrArr, arr) => 
  JSON.stringify(arrArr).indexOf(JSON.stringify(arr)) !== -1;

export const notAvoided = (avoid, pair) => 
  !arrInclArr(avoid, pair) && !arrInclArr(avoid, [pair[1], pair[0]]);
