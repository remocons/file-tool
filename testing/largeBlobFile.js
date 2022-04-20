import * as ft from "../src/file-tool.js"
import {Buffer} from 'node:buffer'
import fs from 'fs'

/*

Problem of using large size Blob.

배경소개.
 브라우저의 경우, Blob 보관을  메모리가 아닌 파일시스템 캐시를 사용하는것으로 추정되며
 이때문에 4GB정동의 대용량 Blob을 생성 사용이 가능하다.

문제점.
 대용량 파일을 Blob 형으로 로딩하려면,  파일을 읽어서 버퍼자료를 구한뒤 이를 통해 Blob 을 생성한다.


limitation:

cause by  memory size.

cause by NodeJS restrict.

different Node vs Browser.

test

메모리로 생성한 블롭
파일을 생성후 읽어들인 블롭

*/

const MB = 2**20
const GB = 2**30

const gb1 = Buffer.alloc( GB )
const filePath1 = 'onegiga.dat'
// fs.writeFileSync( filePath1, gb1 )

// fs.rmSync( filePath1 )

console.log('mkDirSync', fs.mkdirSync('out') )