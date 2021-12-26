import { loginPage } from './modules/login.js'
import { datapickerPage } from './modules/datapicker.js'
import { jwtPayload } from "./libs/jwt.js"

document.addEventListener("DOMContentLoaded", function () {
    const APP = document.querySelector('#app');
    function renderPage() {
        const token = localStorage.getItem('token'); // авторизован в данный момент
        const payload = jwtPayload(token); // получаем объект с указателем на user (полезная инф)
        if(payload) {
            const user = localStorage.getItem(payload.user);
            if(!user) {
                alert('Пользователь не найден');
                loginPage(APP, renderPage);    
            } else {
                datapickerPage(APP, renderPage, JSON.parse(user));
            }
            
        } else {
            loginPage(APP, renderPage);
        }
    }
    renderPage();
});