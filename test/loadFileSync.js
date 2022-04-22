import { Blob } from 'buffer'
import { File, loadFileSync, loadFileListSync ,pathJoin} from '../src/file-tool.js'
import t from 'tap'


  const filename = 'lock.jpg'
  const path = pathJoin('test',filename )

  const blobFile = loadFileSync(path)
  t.equal( blobFile.name , filename) 
  t.ok( blobFile instanceof File , 'is File' )
  t.ok( blobFile instanceof Blob  , 'is Blob')

  const filePathList = [
    pathJoin('test', 'host.jpg'),    
    pathJoin('test', 'lock.jpg')    
  ]

  const blobFileList = loadFileListSync( filePathList )
  t.equal( blobFileList[0].name , 'host.jpg') 
  t.equal( blobFileList[1].name , 'lock.jpg') 

  // console.log( blobFileList)


