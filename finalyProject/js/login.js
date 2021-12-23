document.addEventListener("DOMContentLoaded", function () {

	const APP = document.getElementById('app');

	const wrapper = renderTag('div', { class : "wrapper fadeInDown" })
	const formContent = renderTag('div', { id : "formContent" });

	// icon
	const icon = renderTag('div', {class : "fadeIn first"});	
	icon.append( renderTag('img', { src : "./img/logo.svg",  id : "icon", alt : "User Icon" }), renderTag('br'), 'Мой ежедневник' );
	formContent.append(icon);
	
	// tabs
	formContent.append(renderTag('h2', {id : 'sign-in', class : "active", innerHTML : "Войти"}))
	formContent.append(renderTag('h2', {id : 'sign-up', class : "inactive underlineHover", innerHTML : "Регистрация"}))

	// login form
	const signInFormBlock = renderTag('div', {id : "login-form", class : "display"});
	const signInForm = renderTag('form', {id: "idINForm"});
		signInForm.append( 
			renderTag('input', {type : "text", id : "signin-login", class : "fadeIn", name : "signin-login", placeholder : "Логин"}), 
			renderTag('input', {type : "password", id : "signin-password", class: "fadeIn", name : "signin-password", placeholder : "Пароль"}), 
			renderTag('input', {type : "submit", class : "fadeIn first", value : "Войти"}) 
		);
	signInFormBlock.append(signInForm);		
	formContent.append(signInFormBlock);

	// signup form
	const signUpFormBlock = renderTag('div', {id : "signup-form", class : "hide"});
	const signUpForm = renderTag('form', {id: "idUPForm"});
		signUpForm.append( 
			renderTag('input', {type : "text", id : "signup-login", class : "fadeIn", name : "signup-login", placeholder : "Логин"}), 
			renderTag('input', {type : "password", id : "signup-password", class: "fadeIn", name : "signup-password", placeholder : "Пароль"}), 
			renderTag('input', {type : "password", id : "signup-password2", class: "fadeIn", name : "signup-password2", placeholder : "Повторите пароль"}), 
			renderTag('input', {type : "submit", class : "fadeIn first", value : "Зарегистрироваться"}) 
		);
	signUpFormBlock.append(signUpForm);		
	formContent.append(signUpFormBlock);

	
	// footer
	const footerBlock = renderTag('div', {id : "formFooter"})  		
	footerBlock.append( renderTag('a', {class : "underlineHover", href : "#", innerHTML : "Забыли пароль?"}) )
	formContent.append(footerBlock);

	wrapper.append(formContent);
	APP.append(wrapper);	

	/// listeners
	addActionForForm();

});


function addActionForForm() {

	const signIn = document.getElementById('login-form');
	const signUp = document.getElementById('signup-form');
	const tabSignUp = document.getElementById('sign-up');
	const tabSignIn = document.getElementById('sign-in');

	tabSignUp.onclick = () => {
		signIn.classList.remove('display');
		signIn.classList.add('hide');
		signUp.classList.remove('hide');
		signUp.classList.add('display');
		tabSignIn.classList.add('inactive');
		tabSignIn.classList.add('underlineHover');
		tabSignIn.classList.remove('active');
		tabSignUp.classList.add('active');
		tabSignUp.classList.remove('inactive');
		tabSignUp.classList.remove('underlineHover');
	}

	tabSignIn.onclick = () => {
		signIn.classList.remove('hide');
		signIn.classList.add('display');
		signUp.classList.remove('display');
		signUp.classList.add('hide');
		tabSignIn.classList.remove('inactive');
		tabSignIn.classList.remove('underlineHover');
		tabSignIn.classList.add('active');
		tabSignUp.classList.remove('active');
		tabSignUp.classList.add('inactive');
		tabSignUp.classList.add('underlineHover');


	}
// обработка формы регистрации
	const upForm = document.getElementById("idUPForm");
    upForm.addEventListener('submit', function(e){
		e.preventDefault();
		const loginUp = upForm.elements["signup-login"].value;
		const passwordUp = upForm.elements["signup-password"].value;
		const passwordUp2 = upForm.elements["signup-password2"].value;
		if (passwordUp != passwordUp2) {
			alert('Пароли не совпадают')
			}
		if (localStorage.getItem(loginUp) === null) {
			//json = JSON.stringify({login: loginUp, password: passwordUp, password2: passwordUp2});
			localStorage.setItem(loginUp, JSON.stringify({login: loginUp, password: CryptoJS.SHA512(passwordUp).toString(CryptoJS.enc.Base64)}));
			alert ('Регистрация прошла успешно');
		}
		else {
			alert ('Такой логин уже существует')
		} 
	});
// обработка формы входа
const inForm = document.getElementById("idINForm");
    inForm.addEventListener('submit', function(e){
		e.preventDefault();
		const loginIn = inForm.elements["signin-login"].value;
		const passwordIn = inForm.elements["signin-password"].value;
		
		
		if (localStorage.getItem(loginIn) === null) {
			alert('такого пользователя нет')
			//json = JSON.stringify({login: loginUp, password: passwordUp, password2: passwordUp2});
			//localStorage.setItem(loginUp, JSON.stringify({login: loginIn, password: passwordIp}));
			//alert ('Регистрация прошла успешно');
		}else {
		const user = JSON.parse(localStorage.getItem(loginIn));
		if (loginIn in localStorage && CryptoJS.SHA512(passwordIn).toString(CryptoJS.enc.Base64) === user.password) {
			alert('Вход выполнен успешно');
		}
		else {
			alert('такого пользователя нет или пароль введен неверно');
		}
		}
		
	});
}

