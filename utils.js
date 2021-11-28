export const dir = o => console.dir(o, {depth: null});

export const arrInclArr = (arrArr, arr) => 
  JSON.stringify(arrArr).indexOf(JSON.stringify(arr)) !== -1;

