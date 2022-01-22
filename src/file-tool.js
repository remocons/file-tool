import { open, writeFile, readFile ,readdir ,rename ,stat} from 'fs/promises'
import { readFileSync, createWriteStream ,statSync, readdirSync} from 'fs'
import { Blob, resolveObjectURL } from 'buffer'
import { Readable } from 'stream'
import crypto from 'crypto'
import path from 'path'
import mime from 'mime'

export class File extends Blob {
  constructor (data, name, options) {
    super(data, options)
    this.name = name || 'noname'
    this.lastModified = new Date()
  }
}

export function pathJoin( dir, file ){
  return path.join( dir, file )
}



export function renameDirFilesRandomUUID( dirPath){
  return readdir( dirPath ).then( fileList=>{
        fileList.forEach( file =>{
            if(file[0] !== '.'){
                rename( pathJoin( dirPath, file),  pathJoin( dirPath, crypto.randomUUID() ) ) 
            }    
        })  
      }).catch(err =>{
        console.error(err);
      })
}

export function renameRandomUUID( filePath ){
  let dirName = path.dirname(filePath)
  return rename( filePath,  path.join( dirName, crypto.randomUUID()  )  )
          .catch (err =>{
            console.error(err);
          })
}


export function renameFile(oldPath, newPath){
  return rename(oldPath, newPath )
          .catch (err =>{
          console.error(err);
        })

}

export  function readDirFiles( path ){
  return readdir(path).catch(err=>console.log(err))
}
export  function readDirFilesSync( path ){
  return readdirSync(path)
}


export function createObjectURL (blob) {
  return URL.createObjectURL(blob)
}

export function revokeObjectURL (blobURL) {
  URL.revokeObjectURL(blobURL)
}
export function saveBlob (blob, filePath) {
  return blob.arrayBuffer()
    .then(ab =>{
      let data = new Uint8Array(ab)
      return writeFile(filePath, data)
    }).catch (err =>{
        console.error(err);
    })
}

export function getBlobFromURL (blobURL) {
  return resolveObjectURL(blobURL)
}

export function loadFileList (filePathList) {
  const blobList = []
  filePathList.forEach(filePath => {
    blobList.push(loadFile(filePath))
  })
  return Promise.all(blobList)
}

export function loadFile (filePath) {
  return readFileAsBuffer(filePath)
          .then( buf =>{
            const type = mime.getType(filePath)
            const name = path.basename(filePath)
            return new File([buf], name, { type: type })
          }).catch( err=>{
            console.log(err)
          })
}

export function loadFileSync (filePath) {
  const buf = readFileSync(filePath)
  const type = mime.getType(filePath)
  const name = path.basename(filePath)
  // console.log('buf.byteLength', buf.byteLength)
  const blob = new File([buf], name, { type: type })
  console.log('File: ', blob.name, blob.type, blob.size)
  return blob
}

export function getStatSync(filePath){
  return statSync(filePath)
}

export function getFileSizeSync (filePath) {
  let stat = getStatSync(filePath)
  return stat.size
}

export function getFileSize (filepath) {
    return stat(filepath).then( st=> {
      return st.size
    }).catch( err =>{
      console.log(err)
    })
}

export function getStat (filepath) {
  return stat(filepath).then( st=> {
    return st
  }).catch( err =>{
    console.log(err)
  })

}


export async function readFileAsBufferSlice (filePath, start, end) {

  let fd = null
  const length = end - start
  if (length < 1) {
    throw new Error('slice length below 1 ')
  }
  const data = new Uint8Array(length)

  try {
    fd = await open(filePath, 'r')
    await fd.read(data, 0, length, start)
    return data
  } catch (err) {
    console.log(err)
  } finally {
    await fd?.close()
  }
}

export function readFileAsBuffer (filePath) {
    return readFile(filePath)
            .catch( err =>{
              console.log(err)
            })
}

export function readFileAsBufferSync (filePath) {
  try {
    const data = readFileSync(filePath)
    return data
  } catch (err) {
    console.log(err)
  }
}

export function wipeRandom (filePath) {

  return new Promise(function (resolve, reject) {
    const fileSize = getFileSizeSync(filePath)

    if (fileSize > 0) {
      const CHUNK_SIZE = 8192
      const inStream = new Readable({
        read (size) {
          const rand = crypto.randomBytes(this.chunksize)
          this.push(rand)
          this.totalSize -= this.chunksize
          if (this.totalSize <= 0) {
            this.push(null)
          }
        }
      })

      const fileStream = createWriteStream(filePath)

      inStream.totalSize = fileSize
      inStream.chunksize = CHUNK_SIZE
      inStream.pipe(fileStream)

      fileStream.on('close', e => {
        console.log('overwrite done.')
        resolve('success')
      })
    }
  })
}
