import { Blob } from 'buffer'
import { loadFile, saveBlob, File ,pathJoin , deleteFile }from '../src/file-tool.js'
import { existsSync } from 'fs'
import t from 'tap'


const filename = 'lock.jpg'
const path = pathJoin('test',filename)


t.test('file life cycle async', async t=>{
   let blobFile = await loadFile(path)
    t.equal( blobFile.name , filename  )
    t.ok( blobFile instanceof File)
    t.ok( blobFile instanceof Blob)    

    //save copy
    const newFilePath = path + '-copy'
    await saveBlob( blobFile, newFilePath)

    //check copy
    t.ok( existsSync( newFilePath ) )
    t.pass('copied')

    // check size
    let copyBlob = await loadFile( newFilePath )
    t.equal( copyBlob.size , blobFile.size )

    // delete
    await deleteFile( newFilePath )
    t.notOk( existsSync( newFilePath ) )


})
