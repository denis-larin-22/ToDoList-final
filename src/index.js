import Controller from './modules/controller.js';

const todo = new Controller;

const authTodo = document.querySelector('.auth-todo');

function loginTextHendler (event) {
    const authTodoText = document.querySelector('.auth-todo__text');
    let loginText = '';

    if (event.target.type === 'submit') {
        loginText = authTodoText.value;
        todo.handleLogin(loginText, 'dev');
    }
}

authTodo.addEventListener('click', loginTextHendler);


//Сделай подсказку напоминалку логина, запиши в локал и напоминай по клику
