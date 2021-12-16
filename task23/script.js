var formDef1=[
    {label:'Название сайта:', kind:'longtext', name:'sitename'},
    {label:'URL сайта:', kind: 'longtext', name: 'siteURL'},
    {label:'Посетителей в сутки:', kind: 'number', name: 'visitors'},
    {label:'E-mail для связи:', kind: 'shorttext', name: 'email'},
    {label:'Рубрика каталога:', kind: 'combo', name: 'division',
    variants:[{text:'здоровье', value:1}, {text:'домашний уют', value:2}, {text:'бытовая техника', value:3}]},
    {label:'Размещение:', kind:'radio', name:'payment',
    variants:[{text:'бесплатное', value:1}, {text: 'платное', value:2}, {text:'VIP', value:3}]},
    {label:'Разрешить отзывы:', kind: 'check', name:'votes'},
    {label:'Описание сайта:', kind: 'memo', name:'description'},
    {caption:'Опубликовать', kind:'submit'}
];

var formDef2=[
    {label:'Фамилия:', kind:'longtext', name:'lastname'},
    {label:'Имя:', kind:'longtext', name:'firstname'},
    {label:'Отчество:', kind:'longtext', name:'secondname'},
    {label:'Возраст:', kind:'number', name:'age'},
    {caption:'Зарегистрироваться', kind:'submit'}
];
document.addEventListener("DOMContentLoaded", function(){
    console.log('loaded');
    function createHTML(idForm, config) {

        const obj = document.getElementById(idForm);
        
        if(!obj) {
            alert(`Not found`);
            return;
        }
        const html = [];
        for (val of config){
            switch (val.kind){
                case 'longtext':{
                    html.push(`${val.label}<input size='15' name=${val.name}></input>`);
                    break;
                }
                case 'number':{
                    html.push(`${val.label}<input size='5' type='number' name=${val.name}></input>`);
                    break
                }
                case 'shorttext':{
                    html.push(`${val.label}<input size='15' name=${val.name}></input>`);
                    break;
                }
                case 'combo':{
                    let options = [];
                    for (i of val.variants){
                        options.push(`<option value='${i.value}'>${i.text}</option>`);
                    }
                    html.push(`${val.label} <select name='${val.name}'>${options.join('\n')}</select>`);
                    break;
                }
                case 'radio':{
                    let options = [];
                    for (i of val.variants){
                        options.push(`<input type='radio', name='${val.name}' value='${i.value}'>${i.text}</input>`);
                    }
                    html.push(`${val.label} ${options.join('  ')} `);
                    break;
                }
                case 'check':{
                    html.push(`${val.label}<input  type='checkbox' checked name=${val.name}></input>`);
                    break; 
                }
                case 'memo':{
                    html.push(`${val.label} <br> <textarea  name=${val.name}></textarea>`);
                    break; 
                }
                case 'submit':{
                    html.push(`<input type='submit'  value=${val.caption}></input>`);
                    break; 
                }

            }
        }

        obj.innerHTML = html.join('<br>');
    };

    createHTML('formDef1', formDef1);
    createHTML('formDef2', formDef2);


    
});