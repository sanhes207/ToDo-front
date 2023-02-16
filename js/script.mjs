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
  card.id = `card${category.id}`;

  const cardHeader = createElementWithClass('div', 'card__header');

  const cardTitle = createElementWithClass('h2', 'card__title');
  cardTitle.textContent = `${category.title}`;

  const cardTask = createElementWithClass('div', 'card__tasks');

  cardHeader.append(cardTitle);
  card.append(cardHeader);
  card.append(cardTask);
  main.append(card);

  appendTask(category);
}

// Добавить новую задачу
async function appendTask(categoryParam) {

  const cardTask = document.querySelector(`#card${categoryParam.id} > .card__tasks`);

  const tasksList = await getTask(categoryParam.id);
  
  if (tasksList.length === 1) {
    const task = composeTask(tasksList[0]);
    cardTask.append(task);
  } else {
    tasksList.forEach(task => {
      cardTask.append(composeTask(task));
    })
  }

  return cardTask;
}

function composeTask(tasksParam) {

  const task = createElementWithClass('div', 'task')

  const cardCheckbox = createElementWithClass('div', 'card__checkbox');

  const checkbox = createElementWithClass('input', 'checkbox')
  checkbox.type = 'checkbox';

  cardCheckbox.append(checkbox);
  task.append(cardCheckbox);

  const taskDescription = createElementWithClass('p', `tasks__description`);
  taskDescription.textContent = tasksParam.description;
  task.append(taskDescription);

  return task;
}