import { VirtualBuffer } from './VirtualBuffer.js'

function processor (init = []) {
  /** @type {Uint8Array[]} */
  const parts = []

  let size = 0
  for (const part of init) {
    if (typeof part === 'string') {
      const bytes = new TextEncoder().encode(part)
      parts.push(bytes)
      size += bytes.byteLength
    } else if (part instanceof ArrayBuffer) {
      parts.push(new Uint8Array(part))
      size += part.byteLength
    } else if (part instanceof Uint8Array) {
      parts.push(part)
      size += part.byteLength
    } else if (ArrayBuffer.isView(part)) {
      const { buffer, byteOffset, byteLength } = part
      parts.push(new Uint8Array(buffer, byteOffset, byteLength))
      size += byteLength
    } else {
      console.log('else', part)
      const bytes = new TextEncoder().encode(String(part))
      parts.push(bytes)
      size += bytes.byteLength
    }
  }

  console.log('size', size)

  return parts
}

const vb = new VirtualBuffer()

const str = 'string'
const u8_32b = vb.read(0, 32)
const u32 = new Uint32Array(8)
u32[0] = 0
u32[1] = 1
u32[2] = 2
u32[3] = 3
u32[4] = 4
u32[5] = 5
u32[6] = 6
u32[7] = 7

const u32_cp = u32.buffer
const u32_4x8_32b = new Uint32Array(vb.read(0, 32).buffer)
const ab_32b = vb.read(0, 32).buffer
const obj = { hi: 'bye' }

const multiTypes = [str, u8_32b, u32, u32_4x8_32b, ab_32b, obj]

const combine = processor(multiTypes)

console.log(combine)