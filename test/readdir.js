import { readdir } from 'fs/promises'
import * as ft from '../src/file-tool.js'


console.log('a')
// await  readdir('.').then( list=>{ console.log(list )})

ft.readDirFiles( '.' ).then( list=>console.log(list))



