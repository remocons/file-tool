import * as ft from '../src/file-tool.js'


let dirPath = "test-rename-dir"  
// let dirPath = "arg.js"
// let dirPath = "test-nofile" 
  
await ft.renameDirFilesRandomUUID(dirPath)
console.log('done')
            