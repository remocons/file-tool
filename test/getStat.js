import * as ft from '../src/file-tool.js'

ft.getStat('gom.jpg')
    .then( stat =>{
        console.log(stat.size , stat.isFile() )
    })
    .catch( err=>console.log( err ) )

// stat = await ft.getStat('nofile')



try {
    let stat = ft.getStatSync('gokm.jpg') 
    if(!stat) console.log('nofile')
    console.log(stat.size) 
} catch (error) {

    console.log(error.message)
}

  


// let dirstat = await ft.getStat('test-dir')

// console.log(dirstat.size, dirstat.isFile() )
