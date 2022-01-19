import { open } from 'fs/promises'
import { openSync, closeSync, fstatSync , readFileSync , createWriteStream} from 'fs'
import { Blob, resolveObjectURL } from 'buffer'
import { Readable } from 'stream'
import crypto from 'crypto'

import path, { resolve } from 'path'
import mime from 'mime'

export class BlobFile extends Blob {
  constructor (data, name, options) {
    super(data, options)
    this.name = name || 'noname'
  }
}

export function createObjectURL (blob) {
  return URL.createObjectURL(blob)
}

export function revokeObjectURL (blobURL) {
  URL.revokeObjectURL(blobURL)
}
export async function saveBlob (blob, filePath) {
  let fd = null
  console.log(`file is saved : ${filePath}  file size: ${blob.size} bytes `)
  try {
    fd = await open(filePath, 'w+')
    const data = new Uint8Array(await blob.arrayBuffer())
    await fd.writeFile(data)
  } catch (err) {
    if (err.code == 'EEXIST') {
      console.log(err)
    } else {
      throw err
    }
  } finally {
    await fd?.close()
  }
}

export function getBlobFromURL (blobURL) {
  return resolveObjectURL(blobURL)
}


export async function FileList (filePathList) {
  if (!Array.isArray(filePathList)) return

  const blobList = []
  filePathList.forEach(filePath => {
    blobList.push(File(filePath))
  })

  return Promise.all(blobList)
}

export async function File (filePath) {
  const ab = await readFileAsArrayBuffer(filePath)
  const type = mime.getType(filePath)
  const name = path.basename(filePath)
  const blob = new BlobFile([ab], name, { type: type })
  // console.log('File: ', blob.name , blob.type, blob.size )
  return blob
}



export function getFileSizeSync (filePath) {
  let fd, stat

  try {
    fd = openSync(filePath, 'r')
    stat = fstatSync(fd)
  } catch (err) {
    throw err
    /* Handle the error */
  } finally {
    if (fd !== undefined) { closeSync(fd) }
  }

  return stat.size
}

export async function getFileSize (filepath) {
  let fd = null
  try {
    fd = await open(filepath, 'r')
    const stat = await fd.stat()
    // console.log('statsize',stat.size)
    return stat.size
  } catch (err) {
    throw err
  } finally {
    await fd?.close()
  }
}

export async function getStat (filepath) {
  let fd = null
  try {
    fd = await open(filepath, 'r')
    const stat = await fd.stat()
    return stat
  } catch (err) {
    console.log(' err', err)
  } finally {
    await fd?.close()
  }
}
export async function readFileAsArrayBufferSlice (filePath, start, end) {
  // console.log('slice', filePath, start, end)
  if (typeof filePath !== 'string' || start == NaN || end == NaN) {
    throw new Error('check arguments')
  }
  let fd = null
  const length = end - start
  if (length < 1) {
    throw new Error('slice length below 1 ')
  }
  const data = new Uint8Array(length)

  try {
    fd = await open(filePath, 'r')
    await fd.read(data, 0, length, start)
    return data.buffer

  } catch (err) {
    throw err
  } finally {
    await fd?.close()
  }
}

export async function readFileAsArrayBuffer (filePath) {
  let fd = null
  let data
  console.log('readFileAsArrayBuffer; ', filePath)
  try {
    fd = await open(filePath, 'r')
    data = await fd.readFile()
    return data.buffer
  } catch (err) {
    throw err
  } finally {
    await fd?.close()
  }
}

export function readFileAsArrayBufferSync (filePath) {
  let fd, stat, buffer
  let data 
  try {
    // fd = openSync(filePath, 'r')
    // stat = fstatSync(fd)

    data = readFileSync( filePath )
  } catch (err) {
    throw err
    /* Handle the error */
  } finally {
    // if (fd !== undefined) { closeSync(fd) }
  }

  return data.buffer 

}

export function writeRandom (filePath) {
  return new Promise(function (resolve, reject) {
    const fileSize = getFileSizeSync(filePath)
    console.log('over write random values. file size: ', fileSize)

    if (fileSize > 0) {
      const CHUNK_SIZE = 100000
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
      if (fileSize < CHUNK_SIZE) {
        inStream.chunksize = fileSize
      } else {
        inStream.chunksize = CHUNK_SIZE
      }
      inStream.pipe(fileStream)

      fileStream.on('close', e => {
        console.log('close', e)
        resolve('success')
      })
    }
  })
}
