const {loadFile , File } = require('../dist/file-tool.cjs')
const {Blob } = require('buffer')

loadFile('lock.jpg').then( file=>{
    console.log( file.name ) 
    console.log( file.slice(0,20) ) 
    console.log( file instanceof File )
    console.log( file instanceof Blob )
})
   
    

