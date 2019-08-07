
/**
 * 是否合法数据
 * @param value any
 */
export function isNotEmpty(value: any) {
  if (value !== undefined && value !== '' && value != null) {
    return true;
  }
  return false;
}

export function getHash256(input) {
  const sha256 = require('js-sha256')
  const hash2 = sha256.update(input)
  return hash2.array()
}