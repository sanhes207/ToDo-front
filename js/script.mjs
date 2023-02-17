import Cookies from "../node_modules/js-cookie/dist/js.cookie.min.mjs";
import {getUser, getTask, getCategorys, createCategory, createTask, updateTask} from './axios_instance.js'; 

// Переменные для кнопок
const btnAuth = document.querySelector('.auth__accept-button');
const btnAddTask = document.querySelector('.header__add-task');
const btnCancelAddTask = document.querySelector('.task__cancel-button');
const btnAcceptAddTask = document.querySelector('.task__accept-button');
const btnAcceptAddCategory = document.querySelector('.category__accept-button');
const btnCancelAddCategory = document.querySelector('.category__cancel-button');

// убирает класс hidden
function setHidden(className) {
  const elem = document.querySelector(`.${className}`);
  elem.classList.add('hidden');
}

// убирает класс hidden
function removeHidden(className) {
  const elem = document.querySelector(`.${className}`);
  elem.classList.remove('hidden');
}

function removeLineTrought(elem) {
  elem.classList.remove('line-trought');
}

function addLineTrought(elem) {
  elem.classList.add('line-trought');
}

async function toggle(checkbox, taskParam) {
  const checkboxId = checkbox.id
  if (checkbox.checked == false) {
    const description = document.querySelector(`#task${checkboxId}`);
    removeLineTrought(description);
    updateTask(taskParam, checkbox.checked);
  } else {
    const description = document.querySelector(`#task${checkboxId}`);
    addLineTrought(description);
    updateTask(taskParam, checkbox.checked);
  }
}

// Создаем передаваемый элемент с передаваемым классом 
function createElementWithClass(el, className) {
  const element = document.createElement(el);
  element.classList.add(className);
  return element;
}

async function updateCategoryList() {
  const userCategoryList = document.querySelector('.task-category');
  userCategoryList.innerHTML = `
  <option value="" disabled selected>Категории...</option>
  <option value="Новая категория">Новая категория</option>
  `
  const categorysList = await getCategorys();

  categorysList.forEach(category => {
    const option = document.createElement('option');
    option.value = category.title;
    option.textContent = category.title;

    userCategoryList.append(option);
  })
}

// Авторизация пользователей
btnAuth.addEventListener('click', async () => {
  const userName = document.querySelector('.auth__title');
  const headerTitle = document.querySelector('.header__title');

  await getUser(userName.value);

  headerTitle.textContent += Cookies.get('userName') + "а"
  
  appendCard();

  setHidden('modal__auth')
});

// Добавить новую карточку
async function appendCard() {

  const categorysList = await getCategorys();
  const main = document.querySelector('.main');
  main.innerHTML = '';

  categorysList.forEach(category => {

    const card = composeCard(category);

    main.append(card);

    appendTask(category);
  })
}

// Создается и заполняется макет карточки категорий
function composeCard(category) {
  const card = createElementWithClass('div', 'card');
  card.id = `card${category.id}`;

  const cardHeader = createElementWithClass('div', 'card__header');

  const cardTitle = createElementWithClass('h2', 'card__title');
  cardTitle.textContent = `${category.title}`;

  const cardTask = createElementWithClass('div', 'card__tasks');

  cardHeader.append(cardTitle);
  card.append(cardHeader);
  card.append(cardTask);

  return card;
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

// Создается и заполняется макет задач 
function composeTask(tasksParam) {

  const task = createElementWithClass('div', 'task')

  const cardCheckbox = createElementWithClass('div', 'card__checkbox');

  const checkbox = createElementWithClass('input', 'checkbox')
  checkbox.type = 'checkbox';
  checkbox.checked = tasksParam.is_checked;
  checkbox.id = tasksParam.id;

  cardCheckbox.append(checkbox);
  task.append(cardCheckbox);

  const taskDescription = createElementWithClass('p', `tasks__description`);
  taskDescription.textContent = tasksParam.description;
  taskDescription.id =`task${tasksParam.id}` ;
  task.append(taskDescription);

  checkbox.addEventListener('change', () => {
    toggle(checkbox, tasksParam);
  })

  if (checkbox.checked == true) addLineTrought(taskDescription);

  return task;
}

// Кнопка добавления новой задачи
btnAddTask.addEventListener('click', async () => {
  removeHidden('modal__task');

  updateCategoryList();
})

// Добавление новой задачи
btnAcceptAddTask.addEventListener('click', async () => {
  const selectValue = document.querySelector('.task-category').value

  if (selectValue == "Новая категория") {
    removeHidden('modal__category');
  } else if (selectValue == '') {

  } else {
    const categoryList = await getCategorys();
    const category = categoryList.filter(el => el.title == selectValue);
    const taskDescription = document.querySelector('.new-task__title').value;
    createTask(category[0].id, taskDescription);
  }

  appendCard();

})

// Добавление новой категории
btnAcceptAddCategory.addEventListener('click', async () => {
  const categoryTitle = document.querySelector('.new-category__title').value;
  await createCategory(categoryTitle);
  appendCard()

  updateCategoryList();

  setHidden('modal__category')
})

// Закрыть меню добавления задач
btnCancelAddTask.addEventListener('click', () => {
  setHidden('modal__task');
})

// Закрыть меню добавления категорий
btnCancelAddCategory.addEventListener('click', () => {
  setHidden('modal__category');
})

