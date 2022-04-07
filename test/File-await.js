import { loadFile, File } from '../src/file-tool.js'
import { Blob } from 'buffer'


const lock = await loadFile('lock.jpg')
const host = await loadFile('host.jpg')

const files = [lock, host]

console.log(files)
console.log(lock.name)
console.log(lock.slice(0, 20))
console.log(await lock.arrayBuffer(0, 20))
console.log(lock instanceof Blob)
console.log(lock instanceof File)