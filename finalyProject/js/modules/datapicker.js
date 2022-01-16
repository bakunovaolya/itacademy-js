import { renderTag } from "./../libs/render.js";
import { Calendar } from "./../libs/calendar.js";
import { Modal } from "../libs/modal.js";

export const datapickerPage = (APP, renderPage, USER) => {
  APP.innerHTML = ""; // clear
  // заготовка под модальное окно
  APP.append(renderTag("div", { id: "modal" }));

  // panel
  const panel = renderTag("div", { class: "menu" });
  const logo = renderTag("div", { class: "left-class" });
  logo.append(renderTag("img", { src: "./../img/logo_small.png" }));
  panel.append(logo);

  // user
  const user = renderTag("div", { class: "right-class" });
  user.append(renderTag("div", { class: "man", innerHTML: USER.name }));
  user.append(renderTag("a", { class: "setting", id: "setting", innerHTML: " Настройки" }));
  user.append(renderTag("a", { class: "exit", id: "exit", innerHTML: " Выйти" }));
  panel.append(user);
  APP.append(panel);

  // calendar
  const calendarWrapper = renderTag("div", { id: "calendar-wrap" });
  const calendarDate = renderTag("div", { id: "calendar-date" });
  calendarDate.append(renderTag("select", { id: "calendar-month" }));
  calendarDate.append(renderTag("select", { id: "calendar-year" }));
  calendarWrapper.append(calendarDate);

  const calendarContainer = renderTag("div", { id: "calendar-container" });
  calendarWrapper.append(calendarContainer);
  APP.append(calendarWrapper);

  // calendar
  const calendar = new Calendar({ user: { name: USER.name, login: USER.login } });
  document.calendar = calendar; //ссылка на объект календаря
  calendar.init(); // строим селекты (заполняем)
  calendar.render(); // строим сетку и события

  calendarWrapper.append(calendarContainer);
  APP.append(calendarWrapper);

  const modal = new Modal();
  document.modal = modal;
  modal.init(); // каркас модального окна

  // формируем обработчики событий
  listeners(USER, renderPage);
};

function listeners(USER, renderPage) {
  
  //обработка настройки
  document.querySelector("#setting").onclick = () => {
    const settingsCode = `${USER ? USER.login + "-" : ""}settings`;
    // data получаем настройки пользователя, если есть
    let settings = localStorage.getItem(settingsCode);
    if (!settings) {
      settings = { datapicker: { startAtMonday: true } };
    } else {
      settings = JSON.parse(settings);
    }

    // render формируем модальное окно с настройками
    const settingBlock = renderTag("div");
    const fieldset = renderTag("fieldset");
    fieldset.append(renderTag("legend", { innerHTML: "Настройки календаря" }));
    fieldset.append(renderTag("input", { type: "checkbox", id: "isStartAtMonday", name: "startmonday", checked: settings.datapicker.startAtMonday === true ? true : undefined }));
    fieldset.append(renderTag("label", { for: "startmonday", innerHTML: "Начинать неделю с понедельника?" }));
    settingBlock.append(fieldset);
    const buttonDiv = renderTag("div", { class: "modal-buttons-area" });
    const actionButton = renderTag("input", { type: "button", value: "Сохранить" });
    buttonDiv.append(actionButton);
    settingBlock.append(buttonDiv);
    document.modal.render(settingBlock);

    // события
    actionButton.onclick = () => {
      settings.datapicker.startAtMonday = document.querySelector("#isStartAtMonday").checked;
      localStorage.setItem(settingsCode, JSON.stringify(settings)); // сохраняем настройки календаря
      document.calendar.reloadSettings(); //перезагружает настройки и перерисовывает календарь
      document.modal.close();
    };

  };

  document.querySelector("#exit").onclick = function () {
    localStorage.removeItem("token");
    renderPage();
  };
}
