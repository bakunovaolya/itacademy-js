import { renderTag } from "./../libs/render.js";
import { jwtCreate } from "./../libs/jwt.js";

export const loginPage = (APP, renderPage) => {
  APP.innerHTML = ""; // clear

  const wrapper = renderTag("div", { class: "wrapper" });
  const wrapperImg = renderTag("div", { class: "img-wrapper" });
  const wrapperTabs = renderTag("div", { class: "tabs-wrapper" });

  const login = renderTag("div", { class: "login" });
  const wrapperForm = renderTag("div", { class: "wrapper_form fadeInDown" });

  const formContent = renderTag("div", { id: "formContent" });

  // icon
  const icon = renderTag("div", { class: "fadeIn" });
  icon.append(renderTag("img", { src: "./img/logo.png", id: "icon" }));
  wrapperForm.append(icon);

  // tabs
  formContent.append(renderTag("h2", { id: "sign-in", class: "active", innerHTML: "Войти" }));
  formContent.append(renderTag("h2", { id: "sign-up", class: "inactive underlineHover", innerHTML: "Регистрация" }));

  // login form
  const signInFormBlock = renderTag("div", { id: "login-form", class: "display" });
  const signInForm = renderTag("form", { id: "idINForm" });
  signInForm.append(renderTag("input", { type: "text", id: "signin-login", class: "fadeIn", name: "signin-login", placeholder: "Email", onchange: "return validate(this,'not-empty,email')" }), renderTag("div", { class: "validation-error hide", id: "error-signin-login" }), renderTag("input", { type: "password", id: "signin-password", class: "fadeIn", name: "signin-password", placeholder: "Пароль", onchange: "return validate(this,'not-empty')" }), renderTag("div", { class: "validation-error hide", id: "error-signin-password" }), renderTag("input", { type: "submit", class: "fadeIn first", value: "Войти" }));
  signInFormBlock.append(signInForm);
  formContent.append(signInFormBlock);

  // signup form
  const signUpFormBlock = renderTag("div", { id: "signup-form", class: "hide" });
  const signUpForm = renderTag("form", { id: "idUPForm" });
  signUpForm.append(
    renderTag("input", { type: "text", id: "signup-name", class: "fadeIn", name: "signup-name", placeholder: "Имя", onchange: "return validate(this,'not-empty,min-len:3')" }),
    renderTag("div", { class: "validation-error hide", id: "error-signup-name" }),
    renderTag("input", { type: "text", id: "signup-login", class: "fadeIn", name: "signup-login", placeholder: "Email", onchange: "return validate(this,'not-empty,email')" }),
    renderTag("div", { class: "validation-error hide", id: "error-signup-login" }),
    renderTag("input", { type: "password", id: "signup-password", class: "fadeIn", name: "signup-password", placeholder: "Пароль", onchange: "return validate(this,'not-empty,range:3|10')" }),
    renderTag("div", { class: "validation-error hide", id: "error-signup-password" }),
    renderTag("input", { type: "password", id: "signup-password2", class: "fadeIn", name: "signup-password2", placeholder: "Повторите пароль", onchange: "return validate(this,'not-empty')" }),
    renderTag("div", { class: "validation-error hide", id: "error-signup-password2" }),
    renderTag("input", { type: "submit", class: "fadeIn first", value: "Зарегистрироваться" })
  );
  signUpFormBlock.append(signUpForm);
  formContent.append(signUpFormBlock);

  wrapperForm.append(formContent);
  login.append(wrapperForm);
  wrapperTabs.append(login);

  wrapper.append(wrapperImg);
  wrapper.append(wrapperTabs);

  APP.append(wrapper);

  // listeners
  addActionForForm(renderPage);
};

function addActionForForm(renderPage) {
  const signIn = document.querySelector("#login-form");
  const signUp = document.querySelector("#signup-form");
  const tabSignUp = document.querySelector("#sign-up");
  const tabSignIn = document.querySelector("#sign-in");

  tabSignUp.onclick = () => {
    signIn.classList.remove("display");
    signIn.classList.add("hide");
    signUp.classList.remove("hide");
    signUp.classList.add("display");
    tabSignIn.classList.add("inactive");
    tabSignIn.classList.add("underlineHover");
    tabSignIn.classList.remove("active");
    tabSignUp.classList.add("active");
    tabSignUp.classList.remove("inactive");
    tabSignUp.classList.remove("underlineHover");
  };

  tabSignIn.onclick = () => {
    signIn.classList.remove("hide");
    signIn.classList.add("display");
    signUp.classList.remove("display");
    signUp.classList.add("hide");
    tabSignIn.classList.remove("inactive");
    tabSignIn.classList.remove("underlineHover");
    tabSignIn.classList.add("active");
    tabSignUp.classList.remove("active");
    tabSignUp.classList.add("inactive");
    tabSignUp.classList.add("underlineHover");
  };
  // обработка отправки формы регистрации
  const upForm = document.querySelector("#idUPForm");
  upForm.addEventListener("submit", function (e) {
    e.preventDefault();

    // валидация
    let globalErrors = [];
    for (const elem of upForm.elements) {
      if (elem.onchange) {
        const localErrors = elem.onchange();
        if (localErrors && Array.isArray(localErrors) && localErrors.length > 0) {
          if (globalErrors.length === 0) {
            elem.scrollIntoView();
            elem.focus();
          }
          globalErrors = globalErrors.concat(localErrors);
        }
      }
    }

    if (globalErrors.length === 0) {
      const loginUp = upForm.elements["signup-login"].value;
      const nameUp = upForm.elements["signup-name"].value;
      const passwordUp = upForm.elements["signup-password"].value;
      const passwordUp2 = upForm.elements["signup-password2"].value;
      // дополнительная проверка
      if (passwordUp !== passwordUp2) {
        alert("Пароли не совпадают");
      } else if (localStorage.getItem(loginUp) === null) {
        localStorage.setItem(loginUp, JSON.stringify({ login: loginUp, name: nameUp, password: CryptoJS.SHA512(passwordUp).toString(CryptoJS.enc.Base64) }));
        upForm.reset();
        tabSignIn.onclick();
        alert("Регистрация прошла успешно");
      } else {
        alert("Такой логин уже существует");
      }
    }
  });

  // обработка формы входа
  const inForm = document.querySelector("#idINForm");
  inForm.addEventListener("submit", function (e) {
    e.preventDefault();

    // валидация
    let globalErrors = [];
    for (const elem of inForm.elements) {
      if (elem.onchange) {
        const localErrors = elem.onchange();
        if (localErrors && Array.isArray(localErrors) && localErrors.length > 0) {
          if (globalErrors.length === 0) {
            elem.scrollIntoView();
            elem.focus();
          }
          globalErrors = globalErrors.concat(localErrors);
        }
      }
    }

    if (globalErrors.length === 0) {
      const loginIn = inForm.elements["signin-login"].value;
      const passwordIn = inForm.elements["signin-password"].value;

      if (localStorage.getItem(loginIn) === null) {
        alert("такого пользователя нет");
      } else {
        const user = JSON.parse(localStorage.getItem(loginIn));
        if (CryptoJS.SHA512(passwordIn).toString(CryptoJS.enc.Base64) === user.password) {
          localStorage.setItem("token", jwtCreate({ user: loginIn }));
          renderPage();
        } else {
          alert("Логин или пароль введен неверно");
        }
      }
    }
  });
}
