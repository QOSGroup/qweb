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