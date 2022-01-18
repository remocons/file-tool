import { FileSync as File } from '../index.js'
import {Blob} from 'buffer'


const lock = new File('lock.jpg')
const host = new File('host.jpg')  
const gom = new File('gom.jpg') 

const files = [lock, host, gom]
console.log( files ) 
console.log( lock.slice(0,20) ) 
console.log( await lock.arrayBuffer(0,20) ) 


console.log( lock.constructor )
console.log( lock instanceof Blob )  //false