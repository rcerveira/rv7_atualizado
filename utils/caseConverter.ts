// Helper functions to convert object keys between camelCase and snake_case

export const toCamel = (s: string): string => {
  return s.replace(/([-_][a-z])/ig, ($1) => {
    return $1.toUpperCase()
      .replace('-', '')
      .replace('_', '');
  });
};

export const toSnake = (s: string): string => {
  return s.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
};

export const keysToCamel = (o: any): any => {
  if (Array.isArray(o)) {
    return o.map(v => keysToCamel(v));
  } else if (o !== null && o.constructor === Object) {
    return Object.keys(o).reduce((acc, key) => {
      const camelKey = toCamel(key);
      acc[camelKey] = keysToCamel(o[key]);
      return acc;
    }, {} as any);
  }
  return o;
};

export const keysToSnake = (o: any): any => {
  if (Array.isArray(o)) {
    return o.map(v => keysToSnake(v));
  } else if (o !== null && o.constructor === Object) {
    return Object.keys(o).reduce((acc, key) => {
      const snakeKey = toSnake(key);
      acc[snakeKey] = keysToSnake(o[key]);
      return acc;
    }, {} as any);
  }
  return o;
};