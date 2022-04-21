# file-tool

Simple Node.js file library that support Web APIs `Blob` and `File` and secure `wipe`.

파일툴은 Node.js에서 브라우저 호환 `Blob`, `File` 을 읽고 쓰기 및 `암호화` 파일 삭제 및 이름 변경을 지원합니다.


## feature
-  Web API's `File` interface for Node.js.
  - NodeJS doesn't support Web APIs File.
  - NodeJS support Blob from buffer.Blob. (status: Experimental ) 
- `saveBlob()`: save Web APIs Blob to the filesystem.
- `loadFile()`: read file from filesystem, return Web APIs File.
- for security and crypto:
  - `WipeRandom()`: overwrite the file with crypto.randomBytes.
  - `renameRandomUUID()` : change filename as random-string(UUID).


## File and Blob

- File is a subclass of Blob.
- File has extra infomations:  name, lastModified.

```js
//simplified File definition.
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
  - support filesystem access: 
    - readFile, read
    - writeFile, write
  - use filePath:string. or fd(file descriptor: file ID)
- Browser
  - No API for direct filesystem access.
  - get `Blob` from : new Blob([buffer]) or from File.
  - get `File` or `FileList` from : `<input type=file>`
  - use arrayBuffer data. from: Blob.arrayBuffer()
  - To save file to the filesystem:
    - use a tag `<a href='objectURL' download>`
    - objectURL from: URL.createObjectURL( blob )





##  `fs` basic
- `ft` use some alias function name.

### readFileAsBuffer()  
- alias of readFile()
- filePath => Buffer
- 비동기로 파일패스의 파일을 버퍼로 반환합니다.
- fs 기본 API입니다.
- `Buffer` : subclass of Uint8Array

```js
readFileAsBuffer(filePath: string): Promise<Buffer>
```
### readFileAsBufferSync()
- 동기형 함수
- alias of readFileSync()
```js
readFileAsBufferSync(filePath: string):Buffer
```


## `file-tool` features 

파일툴 고유 기능입니다.

### readFileAsBufferSlice()
```js
readFileAsBufferSlice(filePath:string, start:number, end:number)
```
- 파일 일부분만 읽어서 버퍼를 반환합니다.
- 대용량 파일을 작은 크기로 잘라서 점진적으로 로딩하는 목적으로도 사용됩니다.


### loadFile()  

```js
loadFile(fielPath: string): Promise<File>
```
-  filePath => blobFile
- 파일패스의 파일을 비동기로 읽어서 Web Browser 호환형 파일(blobFile)을 반환합니다. 일반적인 파일이라는 명칭과 구분하기 위해 본 모듈에서는 blobFile이라는 표현을 사용했습니다.

- `blobFile` : Web APIs File( Blob is included)
- 브라우저와 노드 호환을 위한 파일 자료형입니다.

### loadFileSync()

```js
loadFileSync(fielPath: string): Blob
```
-  filePath => blobFile
- loadFile과 달리 loadFileSync 는 호출 즉시 파일을 반환해줍니다. 동기형 함수는 처리되는 동안 다른 작업의 진행을 차단(Block)되므로 대부분의 경우 비동기형 함수 사용이 권장됩니다. 




### loadFileList()

```js
loadFileList(fielPathList: Array<string>): Promise<FileList>
```
- filePathList => blobFileList
- 여러개의 파일패스 목록을 입력하면 비동기로 Web APIs FileList를 반환합니다.
- `FileList`: [MDN info](https://developer.mozilla.org/en-US/docs/Web/API/FileList)




### saveBlob()
- Blob or File => write to filesystem.
- Blob 이나 File 자료를 지정한 파일패스에 파일시스템 파일로 저장해줍니다.

```js
saveBlob(blob:Blob|File, filePath: string)
```




## `features for crypto and security`

파일 암호화나 보안 기능 구현에 도움이 되는 기능들입니다.

### wipe()   
```js
wipeRandom(filePath:string ):Promise
```
- remove file data securely.
- 기본 제공되는 파일삭제(unlink 등) 함수의 경우, 실제로 데이타를 삭제하지 않고 FAT상의 정보만 미사용으로 변경하므로, 실제 데이타는 보전되고 쉽게 복원될 수 있는 문제가 있습니다. 
- 본 함수는 파일을 삭제 처리 하지 않고, 시스템에서 제공하는 랜덤 데이타로 파일을 덮어씁니다.
- 주의. 파일 데이타 복원이 불가능 하거나 어려워집니다.
- 단, 특수 환경에서는 wipe 작업 후에도 데이타 사본이 보관 되어 있을 수 있으므로, 완전한 삭제나 복구 여부를 보증하지는 않습니다.

### renameRandom()

```js
renameRandomUUID(filePath:string)
```
- rename one file.
- 암호학적 무작위 이름으로 바꾸기
- 파일패스의 파일의 이름을 랜덤한 정보로 바꿔줍니다.
- 주의. 파일 이름의 복원이 불가합니다.
- 파일 데이타 자체는 변경되지 않고 그대로 보전됩니다.

```js
//before
filename: secretMessage.txt

await renameRandomUUID('secretMessage.txt')

//after
filename: 862ba384-d813-4746-b0fd-bc06b4ad8be8
```

### renameDirFilesRandomUUID()
```js
renameDirFilesRandomUUID(dirPath:string)
```
- rename all files in the directory.
- 지정된 디렉토리에 들어있는 모든 파일의 이름을 랜덤하게 변경해줍니다.
- 주의. 파일이름은 복원될 수 없습니다.
- 파일 데이타는 변경되지 않습니다.


```js
//before
aaa
bbb
ccc

renameDirFilesRandomUUID('./secretFolder')

// after
631cd680-e99e-484a-bf6a-9360c44b5861
edcad47d-031b-4dae-9794-61d88f5f89e4
7519c2f7-aec3-4126-a301-5a2a87512542

```

### else

```js
pathJoin(dir, file) // path.join()

renameFile(oldPath, newPath) // rename()

readDirFiles(path) // readdir()

readDirFilesSync(path)  // readdirSync()
```

### ObjectURL 
- Blob <-> Blob URL string
- 한정된 컨텍스트내에서만 사용 가능합니다.
- 브라우저 DOM , Worker에서 사용합니다.
- Added in Node.js: v16.7.0
```js

createObjectURL(blob)
// alias of URL.createObjectURL(blob)

revokeObjectURL(blobURL) 
// alias of URL.revokeObjectURL(blobURL)

getBlobFromURL(blobURL) 
// alias of resolveObjectURL(blobURL)

deleteFile(filePath)
// unlink() file. not secure.

removeDirRecursiveForce(dirPath)
 // alias of rm(dirPath, { recursive: true, force: true })
// rm -rf 

```



### License
- [MIT](LICENSE)  이동은 ( Lee Dong Eun ) sixgen@gmail.com 

