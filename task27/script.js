var formDef1=[
    {label:'Название сайта:', kind:'longtext', name:'sitename', vrules : ['not-empty','min-len:5']},
    {label:'URL сайта:', kind: 'longtext', name: 'siteURL', vrules : ['not-empty']},
    {label:'Дата запуска сайта:', kind: 'date', name: 'siteDate', vrules : ['not-empty']},
    {label:'Посетителей в сутки:', kind: 'number', name: 'visitors', vrules : ['not-empty']},
    {label:'E-mail для связи:', kind: 'shorttext', name: 'email', vrules : ['email']},
    {label:'Рубрика каталога:', kind: 'combo', name: 'division', vrules : ['not-empty'],
    variants:[{text:'здоровье', value:1}, {text:'домашний уют', value:2}, {text:'бытовая техника', value:3}]},
    {label:'Размещение:', kind:'radio', name:'payment', vrules : ['not-empty'],
    variants:[{text:'бесплатное', value:1}, {text: 'платное', value:2}, {text:'VIP', value:3}]},
    {label:'Разрешить отзывы:', kind: 'check', name:'votes'},
    {label:'Описание сайта:', kind: 'memo', name:'description', vrules : ['not-empty']},
    {caption:'Опубликовать', kind:'submit'}
];

function validateFormBeforeSubmit(idForm) {
    const form = document.getElementById(idForm);
    form.addEventListener('submit', function(e){
        e.preventDefault();
        
        let globalErrors = [];
        for(const elem of form.elements) {
            if(elem.onchange) {
                const localErrors = elem.onchange();
                if(Array.isArray(localErrors) && localErrors.length > 0) {
                    if(globalErrors.length === 0) {
                        elem.scrollIntoView();
                        elem.focus();
                    }
                    globalErrors = globalErrors.concat(localErrors);
                }
            }
        }

        if(globalErrors.length == 0) {
            this.submit();
        }
    })    
}

function validate(target, rules) {
    if(rules === 'null') {
        return;
    }

    const targetType = target.tagName.toLowerCase();
    const targetErrorBlock = document.getElementById(`error-${target.name}`);
    
    if(!targetErrorBlock) {
        alert(`Не найден блок ошибки для поля ${target.name}`);
        return;
    }

    rules = rules.split(',');
    const errors = [];
    for(const rule of rules) {
        let [type, params] = rule.split(':');
        params = params ? params.split('|') : null;

        switch(type) {
            case 'not-empty' : {
                switch(targetType) {
                    case 'input' : {
                        if(target.value.trim().length === 0) {
                            errors.push('Поле не должно быть пустым');
                        }
                        break;
                    }
                    case 'textarea' : {
                        if(target.value.trim().length === 0) {
                            errors.push('Поле не должно быть пустым');
                        }
                        break;
                    }
                    case 'select' : {
                        if(!target.value){
                            errors.push('Выпадающее поле не должно быть пустым');    
                        }
                        break;
                    }
                    default : {
                        alert(`Тип элемента ${targetType} не обработал в валидаторе not-empty`)
                    }
                }
                break;
            }
            case 'email' : {
                if(!/^[^@]+@\w+(\.\w+)+\w$/.test(target.value.trim())) {
                    errors.push('Поле должно быть email');
                }
                break;
            }
            case 'min-len' : {
                const limiter = params ? params[0] : 1;
                if(target.value.trim().length < limiter) {
                    errors.push(`Поле не должно быть меньше ${limiter}`);
                }
                break;
            }
            default : {
                alert(`Валидатор ${type} не найден`)
            }
        }
    }
    targetErrorBlock.innerHTML = errors.length > 0 ? errors.join(', ') : "";
    return errors;
}

document.addEventListener("DOMContentLoaded", function(){
    console.log('loaded');

    function createHTML(idForm, config) {

        function createErrorBlock(name) {
            return `<span style='color: red' id="error-${name}"></span>`;
        }

        const obj = document.getElementById(idForm);
        
        if(!obj) {
            alert(`Not found`);
            return;
        }
        const html = [];
        for (val of config){
            switch (val.kind){
                case 'longtext':{
                    html.push(`${val.label}<input onchange="return validate(this, '${val.vrules ? val.vrules.join(',') : null}')" size='15' name=${val.name}></input> ${createErrorBlock(val.name)}`);
                    break;
                }
                case 'number':{
                    html.push(`${val.label}<input onchange="return validate(this, '${val.vrules ? val.vrules.join(',') : null}')" size='5' type='number' name=${val.name}></input> ${createErrorBlock(val.name)}`);
                    break
                }
                case 'date':{
                    html.push(`${val.label}<input onchange="return validate(this, '${val.vrules ? val.vrules.join(',') : null}')" size='5' type='date' name=${val.name}></input> ${createErrorBlock(val.name)}`);
                    break
                }
                case 'shorttext':{
                    html.push(`${val.label}<input onchange="return validate(this, '${val.vrules ? val.vrules.join(',') : null}')" size='15' name=${val.name}></input> ${createErrorBlock(val.name)}`);
                    break;
                }
                case 'combo':{
                    let options = [];
                    for (i of val.variants){
                        if(i.value) {
                            options.push(`<option value='${i.value}'>${i.text || ''}</option>`);
                        } else {
                            options.push(`<option>${i.text || ''}</option>`);
                        }
                    }
                    html.push(`${val.label} <select onchange="return validate(this, '${val.vrules ? val.vrules.join(',') : null}')" name='${val.name}'>${options.join('\n')}</select> ${createErrorBlock(val.name)}`);
                    break;
                }
                case 'radio':{
                    let options = [];
                    for (i in val.variants){
                        const valI = val.variants[i]
                        options.push(`<input ${i == 0 ? 'checked' : ""} onchange="return validate(this, '${val.vrules ? val.vrules.join(',') : null}')" type='radio', name='${val.name}' value='${valI.value}'>${valI.text}</input>`);
                    }
                    html.push(`${val.label} ${options.join('  ')}  ${createErrorBlock(val.name)}`);
                    break;
                }
                case 'check':{
                    html.push(`${val.label}<input  onchange="return validate(this, '${val.vrules ? val.vrules.join(',') : null}')"  type='checkbox' checked name=${val.name}></input>  ${createErrorBlock(val.name)}`);
                    break; 
                }
                case 'memo':{
                    html.push(`${val.label} <br> <textarea  onchange="return validate(this, '${val.vrules ? val.vrules.join(',') : null}')"  name=${val.name}></textarea> ${createErrorBlock(val.name)}`);
                    break; 
                }
                case 'submit':{
                    html.push(`<input type='submit'  value=${val.caption}></input> ${createErrorBlock(val.name)}`);
                    break; 
                }

            }
        }

        obj.innerHTML = html.join('<br>');
    };

    createHTML('formDef1', formDef1);
    validateFormBeforeSubmit('formDef1');


    
});