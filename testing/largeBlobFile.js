import * as ft from "../src/file-tool.js"
import {Buffer} from 'node:buffer'
import fs from 'fs'

/*

Problem of using large size Blob.

배경소개.
 브라우저의 경우, Blob 보관을  메모리가 아닌 파일시스템 캐시를 사용하는것으로 추정되며
 이때문에 4GB정도의 대용량 Blob을 생성 사용이 가능하다.

문제점.
 대용량 파일을 Blob 형으로 로딩하려면,  파일을 읽어서 버퍼자료를 구한뒤 이를 통해 Blob 을 생성한다.


Loading Large Blob File. 
- 대용량 파일의 경우, n 등분으로 나눠서 읽어들이는 기능
- Blob 의 누적 기능을 이용.
- 순간 메모리 대규모 소비시 메모리 부족문제 해결위함.
- 브라우저에선 효과적임 확인됨.
- 노드의 경우엔 심각한 문제가 있어서 큰 도움이 안됨.
- 노드는 대용량 파일 읽기가 애초에 불가함. 2GB 정도 제한.
- 브라우저에선 Blob의 경우, 디스크 캐시를 사용하는걸로 추정됨. 이때문에 누적 방식을 사용할 경우 대용량 (가령 4GB) 파일을 생성 가능. 
- 브라우저의 경우도 한번에 대용량 요청시 메모리문제로 뻗어버림.


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