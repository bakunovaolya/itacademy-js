
class HashStorageFunc {
    constructor(){
        this._hash={};
    }
    addValue(key, value) {
        this._hash[key] = value;
    }
    getValue(key) {
        return this._hash[key] ;
    }
    deleteValue(key) {
        delete this._hash[key];
    }
    getKeys() {
        return Object.keys(this._hash);
    }
}
// task2
const drinkStorage = new HashStorageFunc();
drinkStorage.addValue('rom-kola', 'alk, kola and rom');
drinkStorage.addValue('b-52', 'alk, vodka and liker');
console.log('list of drinks:', drinkStorage.getKeys());
console.log('receipe of b-52:', drinkStorage.getValue('b-52'))
console.log('delete recipe b-52');
drinkStorage.deleteValue('b-52');
console.log('receipe of rom-kola:',drinkStorage.getValue('rom-kola'));
console.log('list of drinks',drinkStorage.getKeys());

//task3
document.addEventListener("DOMContentLoaded", function(){
    const drinkStorageHTML = new HashStorageFunc();
    document.getElementById('addInfo').onclick = function() {
        const title = prompt('Название напитка');
        const alc = prompt('Алкогольный?');
        const receipe = prompt('введите рецепт');
        drinkStorageHTML.addValue(title, {alckey: alc, receipekey: receipe});
        console.log(drinkStorageHTML.getKeys());  
    }
    document.getElementById('getInfo').onclick = function() {
        const title = prompt('Название напитка');
        const receipe = drinkStorageHTML.getValue(title);
        console.log(receipe);
        if (!receipe) {
            alert('Такой напиток не найден')
        } else {
            alert(`напиток ${title} \nалкогольный: ${receipe.alckey} \nрецепт приготовления:\n ${receipe.receipekey}`); 
        }
    }
    document.getElementById('deleteInfo').onclick = function() {
        const title = prompt('Название напитка');
        const receipe = drinkStorageHTML.getValue(title);
        if (!receipe) {
            alert('Такой напиток не найден')
        } else {
            drinkStorageHTML.deleteValue(title); 
        }
        console.log(drinkStorageHTML.getKeys());
    }
    document.getElementById('getList').onclick = function() {
            alert(`${drinkStorageHTML.getKeys().join(',')}`);
        
    }
});

