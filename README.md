# file-tool


- This is simple wrapper library of Node.js fs(file system IO).
- It support simplified browser's File interface.  
- NodeJS doesn't support Web APIs File.


## File and Blob

```js
export class File extends Blob {
  constructor(data, name, options = {}) {
    super(data, options)
    this.name = name || 'noname'
    this.lastModified = new Date()
  }
}

```

## Node vs Browser

- Node.js
  - readFile, writeFile
  - use filePath:String 
  - use arrayBuffer
- Browser
  - No API for direct filesystem access.
  - use Blob from : new Bob([buffer]) 
  - use File or FileList from : DOM <input type=file>
  - use arrayBuffer too. from: Blob.slice() Blob.arrayBuffer()


## wrapper functions

파일시스템 파일을 읽어서 브라우저 호환형 File형 자료를 반환.  비동기.

async loadFile( filePath : String )
- readFileAsBuffer()
  - open: fd = open()
  - read: fd.read()
- new Blob()
- return File( [blob])


saveBlob( Blob, filePath )
- get: blob.arrayBuffer()
- wrap: Uint8Array(buffer)
- writeFile(filePath, data )



//raw fs
readFile()
readFileSync()


fd = open
fd.read