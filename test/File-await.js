import * as ft from '../index.js'
import { Blob } from 'buffer'

async function File(filePath) {
 return await ft.loadBlobFile(filePath)
}

const lock = await File('lock.jpg')
const host = await File('host.jpg')  
const gom = await File('gom.jpg') 

const files = [lock, host, gom]

console.log( files ) 
console.log( lock.name ) 
console.log( lock.slice(0,20) ) 
console.log( await lock.arrayBuffer(0,20) ) 


console.log( lock.constructor )
console.log( lock instanceof Blob )