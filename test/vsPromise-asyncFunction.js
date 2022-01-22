// lib 만들때, 함수를 어떤 형태로 해야하는지?

async function a(tag){
   
   let r =  await p(1000)
   console.log(tag, r)
   let r2 = await p(1100)
   console.log(tag, r2)
}

function p( msec){
    return new Promise( function(resolve, reject){
        setTimeout(() => {
            resolve( msec )
        }, msec );

    })
}
function broken( msec){
    return new Promise( function(resolve, reject){
        console.log('well')
    })
}

 

 a('first')
 a('2nd') 

 broken().then(p)