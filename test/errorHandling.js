

function promi(msec){
    return new Promise(  function(resolve, reject){
        setTimeout(() => {
            resolve(33)
            // reject('fail')
        }, msec);
        
    })
} 

promi(3000).then(p).catch( p ).then(p)



async function a( msec ){
    setTimeout(() => {
       return msec
        // reject('fail')
    }, msec);
}

function p(arg){
    console.log(arg)
    return arg
}

a(1000).then( p)

console.log('FIN END')


