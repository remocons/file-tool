import { open, writeFile, readFile, readdir, rename, stat, rm ,mkdir } from 'fs/promises'
import { readFileSync, createWriteStream, statSync, readdirSync, existsSync, rmSync, mkdirSync } from 'fs'
import { Blob, resolveObjectURL } from 'buffer'
import { Readable } from 'stream'
import crypto from 'crypto'
import path from 'path'
import mime from 'mime'

export { Blob } from 'buffer'

export class File extends Blob {
  constructor(data, name, options = {}) {
    super(data, options)
    this.name = name || 'noname'
    this.lastModified = new Date()
  }
}

export function pathJoin(dir, file) {
  return path.join(dir, file)
}

export function renameDirFilesRandomUUID(dirPath) {
  return readdir(dirPath).then(fileList => {
    fileList.forEach(file => {
      if (file[0] !== '.') {
        rename(pathJoin(dirPath, file), pathJoin(dirPath, crypto.randomUUID()))
      }
    })
  })

}

export function renameRandomUUID(filePath) {
  const dirName = path.dirname(filePath)
  return rename(filePath, path.join(dirName, crypto.randomUUID()))
}

export function renameFile(oldPath, newPath) {
  return rename(oldPath, newPath)
}

export function readDirFiles(path) {
  return readdir(path)
}
export function readDirFilesSync(path) {
  return readdirSync(path)
}

// blob => objectURL
export function createObjectURL(blob) {
  return URL.createObjectURL(blob)
}

export function revokeObjectURL(blobURL) {
  URL.revokeObjectURL(blobURL)
}

/**
 * 
 * @param {Blob|File} blob Web APIs Blob
 * @param {String} path fullPath. 
 * @returns Promise
 */
export function saveBlob(blob, path) {
  return blob.arrayBuffer()
    .then(ab => {
      const data = new Uint8Array(ab)
      // console.log('saveBlob', data.byteLength)
      return writeFile(path, data)
    })
}

// saveBlobSync()
// There is no sync version of saveBlob.
// reason.  Blob.arrayBuffer() is async.

// objectURL => Blob
export function getBlobFromURL(blobURL) {
  return resolveObjectURL(blobURL)
}

/**
 * 
 * @param {Array} filePathList  Array of File Path List 
 * @returns Promise<Array<BlobFile>> Array of BlobFileList
 */
export function loadFileList(filePathList) {
  const blobList = []
  filePathList.forEach(path => {
    blobList.push(loadFile(path))
  })
  return Promise.all(blobList)
}
/**
 * 
 * @param {Array} filePathList  Array of File Path List 
 * @returns {Array<BlobFile>} Array of BlobFileList
 */
export function loadFileListSync(filePathList) {
  const blobList = []
  filePathList.forEach(path => {
    blobList.push(loadFileSync(path))
  })
  return blobList
}

/**
 * 
 * @param {String} filePath 
 * @returns Promise File( Web APIs File)
 */
export async function loadFile(filePath) {

  const type = mime.getType(filePath)
  const name = path.basename(filePath)
  // const twoGB = 2 * 2 ** 30
  const chunkSize = 1000 * 2 ** 20
  let blob = new Blob([])

  let size = await getFileSize(filePath)

  if (size > 4 * 2 ** 30) {
    throw "SIZE OVER 4G"

  } else {

    if (size <= chunkSize) {
      //read once
      let buf = await readFileAsBuffer(filePath)
      return new File([buf], name, { type: type })

    } else {
      // read ntime  
      let n = Math.floor(size / chunkSize)
      let remain = size % chunkSize
      // console.log('n, r', n, remain )
      for (let i = 0; i < n; i++) {
        let buf = await readFileAsBufferSlice(filePath, i * chunkSize, (i + 1) * chunkSize)
        blob = new Blob([blob, buf])
      }

      // and remain
      let rbuf = await readFileAsBufferSlice(filePath, size - remain, size)
      blob = new Blob([blob, rbuf])
    }

    return new File([blob], name, { type: type })
  }

}

export function loadFileSync(filePath) {
  const buf = readFileSync(filePath)
  const type = mime.getType(filePath)
  const name = path.basename(filePath)
  // console.log('buf.byteLength', buf.byteLength)
  const blob = new File([buf], name, { type: type })
  // console.log('File: ', blob.name, blob.type, blob.size)
  return blob
}

export function getStatSync(path) {
  return statSync(path)
}

export function getFileSizeSync(path) {
  const stat = getStatSync(path)
  return stat.size
}

export function getFileSize(path) {
  return stat(path).then(st => {
    return st.size
  })
}

export function getStat(path) {
  return stat(path).then(st => {
    return st
  })
}

export async function readFileAsBufferSlice(path, start, end) {
  let fd = null
  try {
    const length = end - start
    if (length < 1) {
      throw new Error('slice length below 1')
    }
    const data = new Uint8Array(length)
    fd = await open(path, 'r')
    await fd.read(data, 0, length, start)
    return data
  } catch (err) {
    console.log(err)
  } finally {
    await fd?.close()
  }
}

export function readFileAsBuffer(path) {
  return readFile(path)

}

export function readFileAsBufferSync(path) {
  return readFileSync(path)
}

export function wipeRandom(path) {
  return new Promise(function (resolve, reject) {
    const fileSize = getFileSizeSync(path)

    if (fileSize > 0) {
      const CHUNK_SIZE = 8192
      const inStream = new Readable({
        read(size) {
          const rand = crypto.randomBytes(this.chunksize)
          this.push(rand)
          this.totalSize -= this.chunksize
          if (this.totalSize <= 0) {
            this.push(null)
          }
        }
      })

      const fileStream = createWriteStream(path)

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


/*
 when option
 force true:  exceptions will be ignored if path does not exist. Default: false.  
 recursive true: perform a recursive directory removal.
*/

// remove file. 
export async function deleteFile(path) {
  return rm(path, { force: true });
}

export function deleteFileSync(path) {
  rmSync(path, { force: true })
}

// remove directory.
export async function removeDir(dirPath) {
  return rm(dirPath, { recursive: true, force: true })
}

export function removeDirSync(dirPath) {
  rmSync(dirPath, { recursive: true, force: true })
}

// create directory.
export function makeDirSync(path) {
  if (!existsSync(path)) mkdirSync(path)
}
export async function makeDir(path) {
   return mkdir(path , { recursive: true })
}

