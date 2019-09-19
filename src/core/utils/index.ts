import { Int64BE } from 'int64-buffer'
import { decodeBase64 as dcbase64, encodeBase64 as ecbase64 } from 'tweetnacl-util'


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

export function encodeBase64(val: any) {
  return ecbase64(val)
}

export function decodeBase64(val: any) {
  return dcbase64(val)
}

export function stringToHex(str: string) {
  let val = ''
  // tslint:disable-next-line: no-let
  for (let i = 0; i < str.length; i++) {
    val += str.charCodeAt(i).toString(16)
  }
  return val
}

/**
 * 乘法
 * @param arg1
 * @param arg2
 */
export function accMul(arg1: number, arg2: number) {
  let m = 0;
  const s1 = arg1.toString();
  const s2 = arg2.toString();
  try {
    m += s1.split('.')[1].length;
    // tslint:disable-next-line: no-empty
  } catch (e) { }
  try {
    m += s2.split('.')[1].length;
    // tslint:disable-next-line: no-empty
  } catch (e) { }
  return (Number(s1.replace('.', '')) * Number(s2.replace('.', ''))) / Math.pow(10, m);
}