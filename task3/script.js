let str = prompt('введите строку');

function glasCount(str){
    let glas = 'аяоёуюэеиы';
    let count = 0;
    for (let i = 0; i < str.length-1; i++) {
        if (glas.indexOf(str[i]) !== -1) {count++;}   
    }
    return count;
} 
console.log(glasCount(str));