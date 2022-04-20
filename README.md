# file-tool

Simple wrapper library for NodeJS that support Web APIs File.

## feature
- It support simplified Web API's File interface.  
  - NodeJS doesn't support Web APIs File.
  - NodeJS support Blob from buffer.Blob. (status: Experimental ) 
- saveBlob: save Blob data to the filesystem.
- loadBlob: read file from filesystem, return Web APIs File.


## File and Blob

- File and Blob is almost same.
- File has extra infomations:  name, lastModified.

```js
export class File extends Blob {
  constructor(data, name, options = {}) {
    super(data, options)
    this.name = name || 'noname'
    this.lastModified = new Date()
  }
}

// Using Blob and File 

// get arrayBuffer of the BlobFile. 
blobFile.arrayBuffer()  // return Promise

// get another new blob from blob.
blobFile.slice()  // return blob


```

## Node vs Browser

- Node.js
  - support filesystem access: 
    - readFile, read
    - writeFile, write
    - types: sync , async promise or callbacks.
  - use filePath:String. or fd(file descriptor: file ID)
  - use data type: arrayBuffer , Buffer, typedArray etc.
- Browser
  - No API for direct filesystem access.
  - get Blob from : new Bob([buffer]) or from File.
  - get File or FileList from : `<input type=file>`
  - use arrayBuffer data. from: Blob.arrayBuffer()
  - To save file to the filesystem:
    - use a tag `<a href='objectURL' download>`
    - objectURL from: URL.createObjectURL( blob )


## wrapper functions

파일시스템 파일을 읽어서 브라우저 호환형 File형 자료를 반환.  비동기.

### async loadFile( filePath : String )
- readFileAsBuffer()
  - open: fd = open()
  - read: fd.read()
- new Blob()
- return File( [blob])

### Loading Large Blob File. 
- 대용량 파일의 경우, n 등분으로 나눠서 읽어들이는 기능
- Blob 의 누적 기능을 이용.
- 순간 메모리 대규모 소비시 메모리 부족문제 해결위함.
- 브라우저에선 효과적임 확인됨.
- 노드의 경우엔 심각한 문제가 있어서 큰 도움이 안됨.
- 노드는 대용량 파일 읽기가 애초에 불가함. 2GB 정도 제한.
- 브라우저에선 Blob의 경우, 디스크 캐시를 사용하는걸로 추정됨. 이때문에 누적 방식을 사용할 경우 대용량 (가령 4GB) 파일을 생성 가능. 
- 브라우저의 경우도 한번에 대용량 요청시 메모리문제로 뻗어버림.


### readFileAsBufferSlice(filePath:String, start:Number, end:Number)
- 파일의 일부만 읽어들인다.



### async saveBlob( Blob, filePath )
- get: blob.arrayBuffer()
- wrap: Uint8Array(buffer)
- writeFile(filePath, data )


