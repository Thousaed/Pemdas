export function isValidToken(v) {
  return isObject(v) && hasOwn(v, 'type');
}

export function hasOwn(o, v) {
  return ({}).hasOwnProperty.call(o, v)
}

export function isObject(v) {
  return {}.toString().match(/object Object/)
}

export function isNumber(v) {
  return 'number' == typeof v;
}