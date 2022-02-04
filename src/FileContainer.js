import * as ft from './file-tool.js'
const encoder = new TextEncoder();
const decoder = new TextDecoder();


export default class FileContainer{
    constructor( filePathList ){
        this._info = {}  
        this._blobInfo = []
        this._blob = new ft.File([])  // append blob pushed blob data

       if( Array.isArray(filePathList) ){
            filePathList.forEach( filePath =>{
                this.push( ft.loadFileSync( filePath ) )
            })
        }


    }


    setPublicInfo( infoObj ){
        this._info.publicInfo = infoObj 
    }

    push( blobFile ){
        let file = { name: blobFile.name , size: blobFile.size, type: blobFile.type }
        this._blobInfo.push( file )
        this._blob = new ft.File([ this._blob, blobFile ])
        return this
    }


    async save( filePath ){
        let blob = this.buildBlob()
       return  ft.saveBlob( blob, filePath )
    }

    buildBlob(){

        this._info.blobs = this._blobInfo
        let infoJSON = JSON.stringify( this._info )
        console.log( JSON.stringify( this._info ,null, 2)  )

        let infoBuffer = encoder.encode( infoJSON )

        // TAIL [ fileInfoLength ][ mode ABCD  ][ tag  ]
        let tailBuffer = new Uint8Array( FileContainer.TAIL_LEN )

        let tailView = new DataView( tailBuffer.buffer )
        tailView.setUint32( FileContainer.TAIL_POS.INFO , infoBuffer.byteLength )
        tailView.setUint32( FileContainer.TAIL_POS.MODE, 1 ) // FileContainer file mode:  public JSON  ,  embed file,,, encryption
        tailView.setUint32( FileContainer.TAIL_POS.TAG , 0xba40ffd9 )

        let blob = new ft.File([ this._blob , infoBuffer,  tailBuffer ])

        return blob
    }

    static TAIL_LEN = 12
    static TAIL_POS = { INFO: 0, MODE: 4 ,TAG : 8 }


    static async  parseTail( blob ){
        if(blob.size < this._TAIL_LEN) return  { isFileContainer: false }

        let tailBuffer = await blob.slice( -(FileContainer.TAIL_LEN) ).arrayBuffer()
        // console.log('tailBuffer ',tailBuffer)
        let tailView = new DataView( tailBuffer )

        let isFileContainer =  0xba40ffd9 == tailView.getUint32( FileContainer.TAIL_POS.TAG )   
        if( ! isFileContainer ) return { isFileContainer: false }

        let fileInfoLength = tailView.getUint32( FileContainer.TAIL_POS.INFO )
        let mode = tailView.getUint32( FileContainer.TAIL_POS.MODE )
        let A = tailView.getUint8( FileContainer.TAIL_POS.MODE )
        let B = tailView.getUint8( FileContainer.TAIL_POS.MODE + 1 )
        let C = tailView.getUint8( FileContainer.TAIL_POS.MODE + 2 )
        let D = tailView.getUint8( FileContainer.TAIL_POS.MODE + 3 )


        return {
            isFileContainer : isFileContainer,
            tag: tailView.getUint32( FileContainer.TAIL_LEN - 4 ),
            fileInfoStart: -( fileInfoLength + this.TAIL_LEN ),
            fileInfoEnd: -(this.TAIL_LEN),
            mode: mode,
            A: A,
            B: B,
            C: C,
            D: D
        }
    }


   async parseFileInfo( blob, tailInfo ){
        if( !tailInfo.isFileContainer ) return

        let start = tailInfo.fileInfoStart
        let end = tailInfo.fileInfoEnd
       let fileInfoBuffer = await blob.slice( start, end ).arrayBuffer()

       let fileInfoStr = decoder.decode( fileInfoBuffer )
       let fileInfo
       try{
         fileInfo = JSON.parse( fileInfoStr )
       }catch(err){
        return err
       }

       fileInfo.blobStart = 0
       
       this._blob = blob 
       this._info = fileInfo 

       return fileInfo 

    }

    async setBlob( fileInfo ){
        console.log('setBlob fileInfo', fileInfo)
        let wholeBlob = this._blob
        let blobInfoList = fileInfo.blobs
        this._blobList = []
        let start =  fileInfo.blobStart
        blobInfoList.forEach( aBlobInfo=>{
            let ablob = wholeBlob.slice(start, start + aBlobInfo.size   ) 
            let partBlobFile = new ft.File( [ ablob] ,aBlobInfo.name,  { type: aBlobInfo.type})
            this._blobList.push( partBlobFile )
            start += aBlobInfo.size;
        })

        return this._blobList

    }

  async load( filePath ){
        //tail
        let blob = await ft.loadFile( filePath )
        let tailInfo = await FileContainer.parseTail(blob)
        // console.log(tailInfo)
       
        if( tailInfo.isFileContainer ){
            let fileInfo = await this.parseFileInfo( blob, tailInfo)
            let blobList = await this.setBlob(fileInfo)
            return blobList
        }
    }


}
