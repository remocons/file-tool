import * as ft from './file-tool.js'
import {Blob} from 'buffer'
import path from 'path'
import mime from 'mime'

export class FileSync {
  constructor (filePath) {
    this.blob = new Blob( )

    this.path = filePath
    this.type = mime.getType(filePath)
    this.name = path.basename(filePath)

    this.loadBlob( filePath , this.type )
  }

   loadBlob( filePath, type ){
    const ab = ft.readFileAsArrayBufferSync(filePath)
    this.blob = new Blob([ab], { type: type })
  }

  slice( start, end ){
      console.log(this.blob)
    return this.blob.slice(start,end)
  }

  arrayBuffer(start,end){
      return this.blob.arrayBuffer(start,end)
  }

  get size () {
    return this.blob.size
  }

}

