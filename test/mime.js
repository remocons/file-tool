import mime from 'mime'
import path from 'path'

// console.log(mime)
console.log(mime.getType('asdf.jpg'))
console.log(mime.getType('asdf.txt'))
console.log(mime.getType('asdf.png'))
console.log(mime.getType('asdf.mp3'))
console.log(mime.getType('asdf.mp4'))

console.log(path.basename('./asdf.mp4'))
