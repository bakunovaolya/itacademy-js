let surname, name, patronomic, age;
while (true){
    surname = prompt ('Введите фамилию');
    if (surname.trim().length !== 0){
        break;
    } 
}
while (true){
    name = prompt ('Введите имя');
    if (name.trim().length !== 0){
        break;
    } 
}
while (true){
    patronymic = prompt ('Введите отчество');
    if (patronymic.trim().length !== 0){
        break;
    } 
}
while (true){
    age = prompt ('Ваш возраст (полных лет)');
    if (!isNaN(parseInt(age))){
        break;
    } 
}

let gender = confirm ('Ваш пол мужской?');
 
alert(`ваше ФИО ${surname} ${name} ${patronymic}
ваш возраст в годах ${age}
ваш возраст в днях ${age*365}
через пять лет вам будет ${age+5}
ваш пол ${gender?'мужской':'женский'}
вы на пенсии ${gender?( age > 63 ? 'да' : 'нет') : (age > 58 ? 'да': 'нет')}`);