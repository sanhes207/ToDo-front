import {getUser, getTask} from './axios_instance.js'; 

// Переменные для кнопок
const btnAuth = document.querySelector('.auth__accept-button');
const btnAddTask = document.querySelector('.header__add-task');


// Авторизация пользователей
btnAuth.addEventListener('click', () => {
  const userName = document.querySelector('.auth__title');
  const modalAuth = document.querySelector('.modal__auth')

  const userID =  getUser(userName.value);
  const taskList = getTask(userID);

  modalAuth.classList.add('hidden')
});