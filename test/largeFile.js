import * as ft from '../src/file-tool.js'

// encrypt file:
let filepath = '/Users/may/bayomedia/862ba384-d813-4746-b0fd-bc06b4ad8be8.jpg';
let passPhrase = 'asdf';
  

let fileInfo = await ft.loadFile( filepath )

// let fileInfo = await ft.readFileAsBufferSlice(filepath,0,55)
// let fileInfo2 = await ft.readFileAsBufferSlice(filepath,1,56)
// let fileInfo3 = await ft.readFileAsBufferSlice(filepath,2,57)

console.log( fileInfo)
// console.log( fileInfo2)
// console.log( fileInfo3)

          