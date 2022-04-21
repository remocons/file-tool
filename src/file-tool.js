import { open, writeFile, readFile, readdir, rename, stat, unlink, rm } from 'fs/promises'
import { readFileSync, createWriteStream, statSync, readdirSync, fstat } from 'fs'
import { Blob, resolveObjectURL } from 'buffer'
import { Readable } from 'stream'
import crypto from 'crypto'
import path from 'path'
import mime from 'mime'

export { Blob } from 'buffer'
export { mkdir } from 'fs/promises'

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
  }).catch(err => {
    console.error(err)
  })
}

export function renameRandomUUID(filePath) {
  const dirName = path.dirname(filePath)
  return rename(filePath, path.join(dirName, crypto.randomUUID()))
    .catch(err => {
      console.error(err)
    })
}

export function renameFile(oldPath, newPath) {
  return rename(oldPath, newPath)
    .catch(err => {
      console.error(err)
    })
}

export function readDirFiles(path) {
  return readdir(path).catch(err => console.log(err))
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
 * @param {String} filePath fullPath. 
 * @returns Promise
 */
export function saveBlob(blob, filePath) {
  return blob.arrayBuffer()
    .then(ab => {
      const data = new Uint8Array(ab)
      return writeFile(filePath, data)
    })
}

// objectURL => Blob
export function getBlobFromURL(blobURL) {
  return resolveObjectURL(blobURL)
}

/**
 * 
 * @param {Array} filePathList  Array of File Path List 
 * @returns {Array} Array of BlobFileList
 */
export function loadFileList(filePathList) {
  const blobList = []
  filePathList.forEach(filePath => {
    blobList.push(loadFile(filePath))
  })
  return Promise.all(blobList)
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
      let buf = await readFileAsBuffer(filePath )
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

export function getStatSync(filePath) {
  return statSync(filePath)
}

export function getFileSizeSync(filePath) {
  const stat = getStatSync(filePath)
  return stat.size
}

export function getFileSize(filepath) {
  return stat(filepath).then(st => {
    return st.size
  })
}

export function getStat(filepath) {
  return stat(filepath).then(st => {
    return st
  })
}

export async function readFileAsBufferSlice(filePath, start, end) {
  let fd = null
  try {
    const length = end - start
    if (length < 1) {
      throw new Error('slice length below 1 ')
    }
    const data = new Uint8Array(length)
    fd = await open(filePath, 'r')
    await fd.read(data, 0, length, start)
    return data
  } catch (err) {
    console.log(err)
  } finally {
    await fd?.close()
  }
}

export function readFileAsBuffer(filePath) {
  return readFile(filePath)

}

export function readFileAsBufferSync(filePath) {
  try {
    const data = readFileSync(filePath)
    return data
  } catch (err) {
    console.log(err)
  }
}

export function wipeRandom(filePath) {
  return new Promise(function (resolve, reject) {
    const fileSize = getFileSizeSync(filePath)

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


export async function deleteFile(filePath) {
  return unlink(filePath);
}


export async function removeDirRecursiveForce(dirPath) {
  return rm(dirPath, { recursive: true, force: true })
}


