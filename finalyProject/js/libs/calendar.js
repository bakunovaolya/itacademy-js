import { renderTag } from "./render.js";

export class Calendar {
    constructor(options = {}) {
        this.startAtMonday = (options && options.startAtMonday) || true;
        this.monthName = (options && options.monthName) || ["Янв", "Фев", "Мар", "Апр", "Май", "Июн", "Июл", "Авг", "Сен", "Окт", "Ноя", "Дек"]
        this.dayNameDefault = (options && options.dayNameDefault) || ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];
        this.dayName = this.dayNameDefault; // текущее значение порядка дней в сетке
        this.selectedDate = { day : 0, month : 0, year : 0 } // текущая дата
        this.containerTag =  ( options && options.containerTag) || "#calendar-container";
        this.container = null; 
        this.user = ( options && options.user) || null;

        this.selections = {
            month : null,
            year : null
        }
        this.monthEvents = {};
    }

    init() {

        this.loadSettings();

        this.selections.month = document.querySelector("#calendar-month");
        this.selections.year = document.querySelector("#calendar-year");
        this.container = document.querySelector(this.containerTag);
        this.container.innerHTML = "" // чистим контейнер (стираем старую таблицу)

        let now = new Date(),
        nowMonth = now.getMonth(),
        nowYear = parseInt(now.getFullYear());

        if (this.startAtMonday) { 
            this.dayName = Object.assign([], this.dayNameDefault); // клонируем значение по умолчанию
            this.dayName.push(this.dayName.shift())  // меняем местами пн и вс (по умолчанию вс первый день недели)
        } else { 
            this.dayName = Object.assign([], this.dayNameDefault); 
        }

        // selections

        // month строим выпадающее меню 
        for (let i = 0; i < 12; i++) {
            const options = {value : i, innerHTML : this.monthName[i], selected : (i === nowMonth ? true : false)}
            this.selections.month.appendChild(renderTag('option', options));
        }
        this.selections.month.onchange = this.render.bind(this);

        // year
        for (let i = nowYear - 10; i <= nowYear + 10; i++) {
            const options = {value : i, innerHTML : i, selected : (i === nowYear ? true : undefined)}
            this.selections.year.appendChild(renderTag('option', options));
        }
        this.selections.year.onchange = this.render.bind(this); // работаем с календарем, а не select
    }

    loadSettings() {

        let settings = localStorage.getItem(`${this.user ? this.user + "-" : ""}settings`); // объект настроек для пользователя
        if(!settings) {
            settings = { datapicker : { startAtMonday : this.startAtMonday } } // есои его нет, задаем по умолчанию
        } else {
            settings = JSON.parse(settings);
        }

        // append settings
        this.startAtMonday = settings.datapicker.startAtMonday;
    }

    reloadSettings() {
        
        this.loadSettings();
        this.init();
        this.render();

    }

    render() {
        //console.log('render');

        this.selectedDate.month = parseInt(this.selections.month.value); // текущий месяц из select
        this.selectedDate.year = parseInt(this.selections.year.value); 

        let daysInMonth = new Date(this.selectedDate.year, this.selectedDate.month + 1, 0).getDate(), // кол-во дней в выбранном месяце в выбранном году
            startDay = new Date(this.selectedDate.year, this.selectedDate.month, 1).getDay(), // первый день месяца
            endDay = new Date(this.selectedDate.year, this.selectedDate.month, daysInMonth).getDay(), // посл день месяца
            now = new Date(), // текущая дата
            nowMonth = now.getMonth(), // текущий месяц
            nowYear = parseInt(now.getFullYear()), // тек год для подсветки фона
            nowDay = this.selectedDate.month === nowMonth && this.selectedDate.year === nowYear ? now.getDate() : null ;
        
        const eventCode = `${this.user ? this.user + "-" : ""}events-${this.selectedDate.month}-${this.selectedDate.year}`;  // строка для поиска в LS
        //console.log(eventCode);  
        // load events
        const eventStore = localStorage.getItem(eventCode); // получение событий из LS
        if(eventStore) {
            this.monthEvents = JSON.parse(eventStore);
        } else {
            this.monthEvents = {};    
        }        

        // построение сетки
        let squares = [];
        if ( this.startAtMonday && startDay != 1) {
            let blanks = startDay==0 ? 7 : startDay ;
            for (let i=1; i<blanks; i++) { squares.push(0); }
        }

        if (!this.startAtMonday && startDay != 0) {
            for (let i=0; i<startDay; i++) { squares.push(0); }
        }

        // Заполнение сетки числами
        for (let i=1; i<=daysInMonth; i++) { squares.push(i); }

        if (this.startAtMonday && endDay != 0) {
            let blanks = endDay==6 ? 1 : 7-endDay;
            for (let i=0; i<blanks; i++) { squares.push(0); }
        }

        if (!this.startAtMonday && endDay != 6) {
            let blanks = endDay==0 ? 6 : 6-endDay;
            for (let i=0; i<blanks; i++) { squares.push(0); }
        }

        let container = document.querySelector("#calendar-container"),
            calendarTable = renderTag("table"); 
        calendarTable.id = "calendar";
        container.innerHTML = ""; // чистим контейнер
        container.appendChild(calendarTable);

        // формируем строку дней недели
        let row = renderTag("tr");
       
        for (let day of this.dayName) {
            let cell = renderTag("td");
            cell.innerHTML = day;
            row.appendChild(cell);
        }
        row.classList.add("head");
        calendarTable.appendChild(row);
        

        // таблица дней в месяце
        let total = squares.length;
        row = renderTag("tr");
        row.classList.add("day");
        for (let i=0; i<total; i++) {
            let cell = renderTag('td');
            if (!squares[i]) { cell.classList.add("blank"); }
            else {
                if (nowDay==squares[i]) { cell.classList.add("today"); }
                cell.append(renderTag('div', {class : 'dd', innerHTML : squares[i]}));//число в таблице
                // проверка на наличие события в это число
                if(this.monthEvents[squares[i]]) {
                    // формируем блок с количеством событий 
                    const eventBlock = renderTag('div', {class : 'event', innerHTML : `${this.monthEvents[squares[i]].length} события`})
                    // создание модал по клику на блок событий
                    eventBlock.onclick = (e) => {
                        console.log('event list');
                        //не даем делать клик по родителю на блоке
                        e.stopPropagation();
                        const eventsListBlock = renderTag('div');
                        //создание блока со всеми событиями 
                        for(const event of this.monthEvents[squares[i]]) {
                            const fieldset = renderTag('fieldset');
                            fieldset.append(renderTag('legend', {innerHTML : `${event.title || 'Без названия'}`}));
                            fieldset.append(renderTag('div', {innerHTML : "Текст события"}))
                            fieldset.append(renderTag('div', {innerHTML : event.text}))
                            eventsListBlock.append(fieldset);
                        }  
                        document.modal.render(eventsListBlock)
                    }
                    //добавляем блок в ячейку
                    cell.append(eventBlock);    
                }

                cell.onclick = () => {
                    //console.log('add event');
                    //формирование формы для записи событий
                    const eventBlock = renderTag('div');
                    const fieldset = renderTag('fieldset');
                    fieldset.append(renderTag('legend', {innerHTML : "Событие"}));
                    fieldset.append(renderTag('div', {innerHTML : "Название события"}))
                    fieldset.append(renderTag('input', {type : "text", id : "event_title", name : "event_title"}))
                    fieldset.append(renderTag('div', {innerHTML : "Текст события"}))
                    fieldset.append(renderTag('input', {type : "text", id : "event_text", name : "event_text"}))
                    eventBlock.append(fieldset);
                    const actionButton = renderTag('button', {innerHTML : "Сохранить"})
                    actionButton.onclick = () => {
                       // console.log('save');
                        
                        let currentEvents = {}; //текущее событие
                        const eventStore = localStorage.getItem(eventCode);
                        if(eventStore) {
                            currentEvents = JSON.parse(eventStore);
                        }
                        if(!currentEvents[squares[i]]) {
                            currentEvents[squares[i]] = [];
                        }

                        currentEvents[squares[i]].push({text : document.querySelector('#event_text').value, title : document.querySelector('#event_title').value});
                        localStorage.setItem(eventCode, JSON.stringify(currentEvents));
                        document.calendar.render(); //перерисовываем календарь с новыми значениями
                        document.modal.close();
                    };
                    eventBlock.append(actionButton); //кнопка сохранить в форме создания событий
                    document.modal.render(eventBlock) // отображение модал окна с формой
                    
                }
            }
            row.appendChild(cell);
            // вычисляем перенос строки в таблице
            if (i!=0 && (i+1)%7==0) {
                calendarTable.appendChild(row);
                row = renderTag("tr");
                row.classList.add("day");
            }
        }

        this.container.append(calendarTable);
}
}