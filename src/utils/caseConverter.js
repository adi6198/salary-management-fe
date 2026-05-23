const isObject = function(o) {
  return o === Object(o) && 
         !Array.isArray(o) && 
         typeof o !== 'function' && 
         !(o instanceof Date) &&
         !(typeof Blob !== 'undefined' && o instanceof Blob) &&
         !(typeof File !== 'undefined' && o instanceof File) &&
         !(typeof ArrayBuffer !== 'undefined' && o instanceof ArrayBuffer);
};

export const keysToCamel = function(o) {
  if (isObject(o)) {
    const n = {};
    Object.keys(o).forEach((k) => {
      n[k.replace(/([-_][a-z])/ig, ($1) => {
        return $1.toUpperCase().replace('-', '').replace('_', '');
      })] = keysToCamel(o[k]);
    });
    return n;
  } else if (Array.isArray(o)) {
    return o.map((i) => {
      return keysToCamel(i);
    });
  }
  return o;
};

export const keysToSnake = function(o) {
  if (isObject(o)) {
    const n = {};
    Object.keys(o).forEach((k) => {
      n[k.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`)] = keysToSnake(o[k]);
    });
    return n;
  } else if (Array.isArray(o)) {
    return o.map((i) => {
      return keysToSnake(i);
    });
  }
  return o;
};
