# file-tool

- This is simple wrapper library of nodeJS fs(file system IO).
- It support simplified browser's File interface.  
- NodeJS doesn't support File.

```js
export class File extends Blob {
  constructor(data, name, options = {}) {
    super(data, options)
    this.name = name || 'noname'
    this.lastModified = new Date()
  }
}

```