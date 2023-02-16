import {getUser, getTask, getCategorys} from './axios_instance.js'; 

// Переменные для кнопок
const btnAuth = document.querySelector('.auth__accept-button');
const btnAddTask = document.querySelector('.header__add-task');


// Авторизация пользователей
btnAuth.addEventListener('click', async () => {
  const userName = document.querySelector('.auth__title');
  const modalAuth = document.querySelector('.modal__auth')

  await getUser(userName.value);
  const categorysList = await getCategorys();

  categorysList.forEach(category => {
    appendCard(category)
  })

  modalAuth.classList.add('hidden')
});

// Создаем передаваемый элемент с передаваемым классом 
function createElementWithClass(el, className) {
  const element = document.createElement(el);
  element.classList.add(className);
  return element;
}

// Добавить новую карточку
async function appendCard(category) {

  const main = document.querySelector('.main');

  const card = createElementWithClass('div', 'card');
  card.id = category.id;

  const cardHeader = createElementWithClass('div', 'card__header');

  const cardTitle = createElementWithClass('h2', 'card__title');
  cardTitle.textContent = `${category.title}`;

  const cardTask = createElementWithClass('div', 'card');

  cardHeader.append(cardTitle);
  card.append(cardHeader);
  card.append(cardTask);
  main.append(card);
}

// Добавить новую задачу
async function appendTask() {

}