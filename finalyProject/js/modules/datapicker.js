import { renderTag } from "./../libs/render.js";
import { Calendar } from "./../libs/calendar.js";
import { Modal } from "../libs/modal.js";

export const datapickerPage = (APP, renderPage, USER) => {

    APP.innerHTML = ""; // clear
    // modal
    APP.append(renderTag('div', {id : "modal"}))

    // panel
    const panel = renderTag('div', {class : "menu"});
    const logo = renderTag('div', {class : "left-class"})
    logo.append(renderTag('img', {src : "./img/logo.svg", class : 'icon-class'}))
    logo.append(renderTag('a', {innerHTML : "Календарь"}))
    panel.append(logo);

    // user
    const user = renderTag("div", { class : 'right-class'})
    user.append(renderTag('div', {class : "man", innerHTML : USER.name}))
    user.append(renderTag('a', {class : "setting", id : "setting", innerHTML : ' Настройки'}))
    user.append(renderTag('a', {class : "exit", id : "exit", innerHTML : ' Выйти'}))
    panel.append(user);
    APP.append(panel);


    // calendar
    const calendarWrapper = renderTag('div', {id : "calendar-wrap"})
    const calendarDate = renderTag('div', {id : "calendar-date"})
    calendarDate.append(renderTag('select', {id : "calendar-month"}))
    calendarDate.append(renderTag('select', {id : "calendar-year"}))
    calendarWrapper.append(calendarDate);
    
    const calendarContainer = renderTag('div', {id : "calendar-container"});
    calendarWrapper.append(calendarContainer);
    APP.append(calendarWrapper);
    
    // calendar
    const calendar = new Calendar({user : USER.name});
    document.calendar = calendar; //ссылка на объект календаря
    calendar.init(); // строим селекты (заполняем)
    calendar.render(); // строим сетку и события

    calendarWrapper.append(calendarContainer);
    APP.append(calendarWrapper);

    const modal = new Modal()
    document.modal = modal;
    modal.init()
    document.querySelector('#setting').onclick = () => {
        const settingsCode = `${USER ? USER.name + "-" : ""}settings`;
        // data
        let settings = localStorage.getItem(settingsCode);
        if(!settings) {
            settings = { datapicker : { startAtMonday : true } }
        } else {
            settings = JSON.parse(settings);
        }

        // render
        const settingBlock = renderTag('div');
        const fieldset = renderTag('fieldset');
        fieldset.append(renderTag('legend', {innerHTML : "Настройки календаря"}));
        fieldset.append(renderTag('input', {type : "checkbox", id : "isStartAtMonday", name : "startmonday", checked : settings.datapicker.startAtMonday === true ? true : undefined}))
        fieldset.append(renderTag('label', {for : "startmonday", innerHTML : "Начинать неделю с понедельника?"}))
        settingBlock.append(fieldset);
        const actionButton = renderTag('button', {innerHTML : "Сохранить"})
        actionButton.onclick = () => {
            settings.datapicker.startAtMonday = document.querySelector('#isStartAtMonday').checked; 
            localStorage.setItem(settingsCode, JSON.stringify(settings)); 
            calendar.reloadSettings(); 
            modal.close()
        };
        settingBlock.append(actionButton);
        modal.render(settingBlock)

    }


    // listeners
    listeners(renderPage);

}

function listeners(renderPage) {
    document.querySelector("#exit").onclick = function() {
        localStorage.removeItem("token");
        renderPage();

    }
}