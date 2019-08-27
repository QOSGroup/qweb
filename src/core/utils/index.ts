import { Int64BE } from 'int64-buffer'

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

export function Int64ToBuffer(val: number) {
  return new Int64BE(val).toBuffer()
}

export function buf2hex(buffer) {
  return Array.prototype.map.call(new Uint8Array(buffer), x => ('00' + x.toString(16)).slice(-2)).join('')
}

export function stringToBuffer(val: string, encoding: BufferEncoding = 'ascii') {
  return Buffer.from(val, encoding)
}