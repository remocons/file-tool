import { loadFile } from '../src/file-tool.js'
import { Blob } from 'buffer'


const lock = await loadFile('lock.jpg')
const host = await loadFile('host.jpg')  
const gom = await loadFile('gom.jpg') 

const files = [lock, host, gom]

console.log( files ) 
console.log( lock.name ) 
console.log( lock.slice(0,20) ) 
console.log( await lock.arrayBuffer(0,20) ) 


console.log( lock.constructor )
console.log( lock instanceof Blob )