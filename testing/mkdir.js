import * as ft from "../src/file-tool.js"
import {Buffer} from 'node:buffer'
import fs from 'fs'


const dirPath = 'outDir'


//rmDirSync

console.log('rmDirSync', fs.rmdirSync(dirPath  ))


//mkDirSync
// 새로생성시 undefined
console.log('mkDirSync', fs.mkdirSync(dirPath  ))

//이미 있으면 EEXSIT 오류.
// console.log('mkDirSync again', fs.mkdirSync(dirPath  ) )

// recursive: true 지정시 오류 없음. 
console.log('mkDirSync', fs.mkdirSync('f1/f2' ,{recursive: true}) )


/*

오류


*/