import { renderTag } from "./render.js";
import { declinationOfNumber } from "./declination.js";

export class Calendar {
  constructor(options = {}) {
    this.startAtMonday = (options && options.startAtMonday) || true;
    this.monthName = (options && options.monthName) || ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];
    this.dayNameDefault = (options && options.dayNameDefault) || ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];
    this.dayName = this.dayNameDefault; // текущее значение порядка дней в сетке
    this.selectedDate = { day: 0, month: 0, year: 0 }; // текущая дата
    this.containerTag = (options && options.containerTag) || "#calendar-container";
    this.container = null;
    this.user = (options && options.user) || null;

    this.selections = {
      month: null,
      year: null,
    };
    this.monthEvents = {};
  }

  init() {
    //

    this.loadSettings(); // загружаем настройки пользователя

    this.selections.month = document.querySelector("#calendar-month");
    this.selections.year = document.querySelector("#calendar-year");
    this.container = document.querySelector(this.containerTag);
    this.container.innerHTML = ""; // чистим контейнер (стираем старую таблицу)

    let now = new Date(), //получаем текущую дату
      nowMonth = parseInt(now.getMonth()),
      nowYear = parseInt(now.getFullYear());

    if (this.startAtMonday) {
      this.dayName = Object.assign([], this.dayNameDefault); // клонируем значение по умолчанию
      this.dayName.push(this.dayName.shift()); // вс переставляем в конец (по умолчанию вс первый день недели)
    } else {
      this.dayName = Object.assign([], this.dayNameDefault); // начинаем с воскресенья
    }

    // selections

    // month строим выпадающее меню
    this.selections.month.innerHTML = "";
    for (let i = 0; i < 12; i++) {
      const options = { value: i, innerHTML: this.monthName[i], selected: i === nowMonth ? true : undefined };
      this.selections.month.appendChild(renderTag("option", options));
    }
    this.selections.month.onchange = this.render.bind(this);

    // year
    this.selections.year.innerHTML = "";
    for (let i = nowYear - 10; i <= nowYear + 10; i++) {
      const options = { value: i, innerHTML: i, selected: i === nowYear ? true : undefined };
      this.selections.year.appendChild(renderTag("option", options));
    }
    this.selections.year.onchange = this.render.bind(this); // работаем с календарем, а не select
  }

  loadSettings() {
    let settings = localStorage.getItem(`${this.user ? this.user.login + "-" : ""}settings`); // объект настроек для пользователя
    if (!settings) {
      settings = { datapicker: { startAtMonday: this.startAtMonday } }; // если его нет, задаем по умолчанию
    } else {
      settings = JSON.parse(settings);
    }

    // append settings
    this.startAtMonday = settings.datapicker.startAtMonday;
  }

  reloadSettings() {
    //перезагрузка настроек

    this.loadSettings();
    this.init();
    this.render();
  }
  //рисуем таблицу календаря
  render() {

    this.selectedDate.month = parseInt(this.selections.month.value); // текущий выбранный месяц из select
    this.selectedDate.year = parseInt(this.selections.year.value);

    let daysInMonth = new Date(this.selectedDate.year, this.selectedDate.month + 1, 0).getDate(), // кол-во дней в выбранном месяце в выбранном году
      startDay = new Date(this.selectedDate.year, this.selectedDate.month, 1).getDay(), // первый день месяца
      endDay = new Date(this.selectedDate.year, this.selectedDate.month, daysInMonth).getDay(), // посл день месяца
      now = new Date(), // текущая дата
      nowMonth = now.getMonth(), // текущий месяц
      nowYear = parseInt(now.getFullYear()), // тек год для подсветки фона
      nowDay = this.selectedDate.month === nowMonth && this.selectedDate.year === nowYear ? now.getDate() : null;

    const eventCode = `${this.user ? this.user.login + "-" : ""}events-${this.selectedDate.month}-${this.selectedDate.year}`; // строка для поиска события, которое уже сохранено  в LS

    // load events
    const eventStore = localStorage.getItem(eventCode); // получение событий из LS
    if (eventStore) {
      this.monthEvents = JSON.parse(eventStore);
    } else {
      this.monthEvents = {};
    }

    // построение сетки
    let squares = [];
    if (this.startAtMonday && startDay != 1) {
      //неделя начинается с пн
      let blanks = startDay == 0 ? 7 : startDay; // вычисляем количество пустых ячеек перед первым днем недели
      for (let i = 1; i < blanks; i++) {
        squares.push(0);
      }
    }

    if (!this.startAtMonday && startDay != 0) {
      for (let i = 0; i < startDay; i++) {
        squares.push(0);
      }
    }

    // Заполнение сетки числами
    for (let i = 1; i <= daysInMonth; i++) {
      squares.push(i);
    }
    // пустые ячейки в конце месяца
    if (this.startAtMonday && endDay != 0) {
      let blanks = endDay == 6 ? 1 : 7 - endDay;
      for (let i = 0; i < blanks; i++) {
        squares.push(0);
      }
    }

    if (!this.startAtMonday && endDay != 6) {
      let blanks = endDay == 0 ? 6 : 6 - endDay;
      for (let i = 0; i < blanks; i++) {
        squares.push(0);
      }
    }

    let container = document.querySelector("#calendar-container"),
      calendarTable = renderTag("table", { id: "calendar" });

    container.innerHTML = ""; // чистим контейнер
    container.append(calendarTable);

    // формируем строку дней недели
    let row = renderTag("tr");

    for (let day of this.dayName) {
      let cell = renderTag("td", { innerHTML: day });
      row.append(cell);
    }
    row.classList.add("head");
    calendarTable.append(row);

    // таблица дней в месяце
    let total = squares.length;
    row = renderTag("tr");
    row.classList.add("day");
    for (let i = 0; i < total; i++) {
      let cell = renderTag("td");
      if (!squares[i]) {
        cell.classList.add("blank");
      } else {
        if (nowDay == squares[i]) {
          cell.classList.add("today");
        }
        cell.append(renderTag("div", { class: "dd", innerHTML: squares[i] })); //число в таблице
        // проверка на наличие события в это число
        if (this.monthEvents[squares[i]] && this.monthEvents[squares[i]].length > 0) {
          // формируем блок с количеством событий
          const eventBlock = renderTag("div", {
            class: "event",
            innerHTML: `${this.monthEvents[squares[i]].length} ${declinationOfNumber(this.monthEvents[squares[i]].length, ["событие", "события", "событий"])}`,
          });
          // создание модал по клику на блок событий
          eventBlock.onclick = (e) => {

            //не даем делать клик по родителю на блоке
            e.stopPropagation();
            const eventsListBlock = renderTag("div");
            //создание блока со всеми событиями
            for (const eventIndex in this.monthEvents[squares[i]]) {
              const event = this.monthEvents[squares[i]][eventIndex];
              const deleteButton = renderTag("input", { type: "button", class: "modal-delete-event-btn", value: "X" });
              const fieldset = renderTag("fieldset", { class: "fieldset-event" });
              fieldset.append(renderTag("legend", { innerHTML: `${event.title || "Без названия"}` }));
              fieldset.append(renderTag("div", { innerHTML: event.text }));
              fieldset.append(deleteButton);
              eventsListBlock.append(fieldset);

              // события
              deleteButton.onclick = (delEvent) => {
                //удаление сробытий из списка
                this.monthEvents[squares[i]].splice(eventIndex, 1);

                localStorage.setItem(eventCode, JSON.stringify(this.monthEvents));
                document.calendar.render(); //перерисовываем календарь с новыми значениями
                document.modal.close();
              };

            }
            document.modal.render(eventsListBlock); //рисуем модальное окно и открываем
          };
          //добавляем блок в ячейку
          cell.append(eventBlock);
        }
      }

      row.appendChild(cell);
      
      // вычисляем перенос строки в таблице
      if (i != 0 && (i + 1) % 7 == 0) {
        calendarTable.appendChild(row); //закрываем строку и начинаем новую
        row = renderTag("tr");
        row.classList.add("day");
      }

      cell.onclick = () => {

        //формирование модального окна для записи событий
        const eventBlock = renderTag("div");
        const fieldset = renderTag("fieldset");
        fieldset.append(renderTag("legend", { innerHTML: "Событие" }));
        fieldset.append(renderTag("div", { innerHTML: "Название события" }));
        fieldset.append(renderTag("input", { type: "text", id: "event_title", name: "event_title" }));
        fieldset.append(renderTag("div", { innerHTML: "Текст события" }));
        fieldset.append(renderTag("input", { type: "text", id: "event_text", name: "event_text" }));
        eventBlock.append(fieldset);
        const actionButton = renderTag("input", { type: "button", value: "Сохранить" });
        const buttonDiv = renderTag("div", { class: "modal-buttons-area" });
        buttonDiv.append(actionButton);
        eventBlock.append(buttonDiv); //кнопка сохранить в окне создания событий
        document.modal.render(eventBlock); // отображение модал окна с формой

        // события
        actionButton.onclick = () => {
          //нажатие на сохранить
          let currentEvents = {}; //текущие события это месяца
          const eventStore = localStorage.getItem(eventCode);
          if (eventStore) {
            currentEvents = JSON.parse(eventStore);
          }
          if (!currentEvents[squares[i]]) {
            //создаем пустой массив, если для данной даты нет событий
            currentEvents[squares[i]] = [];
          }
          //добавление нового события в массив
          currentEvents[squares[i]].push({ text: document.querySelector("#event_text").value, title: document.querySelector("#event_title").value });
          localStorage.setItem(eventCode, JSON.stringify(currentEvents));
          document.calendar.render(); //перерисовываем календарь с новыми значениями
          document.modal.close();
        };
        
      };
    }

    this.container.append(calendarTable);
  }
}
