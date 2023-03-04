import Cookies from "../node_modules/js-cookie/dist/js.cookie.min.mjs";
import {getUser, getTask, getCategorys, createCategory, createTask, updateTask, getColor} from './axios_instance.js'; 

// Переменные для кнопок
const btnAuth = document.querySelector('.auth__accept-button');
const btnAddTask = document.querySelector('.header__add-task');
const btnCancelAddTask = document.querySelector('.task__cancel-button');
const btnAcceptAddTask = document.querySelector('.task__accept-button');
const btnAcceptAddCategory = document.querySelector('.category__accept-button');
const btnCancelAddCategory = document.querySelector('.category__cancel-button');

function hex2rgb(c) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(c);
  return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
  } : null;
}

// Добавление сообщения о неправильном заполнении поля
function errorMsg(elem) {
  const modalMain = document.querySelector(`.modal__${elem} .modal__main`);
  const elemTitle = document.querySelector(`.new-${elem}__title`);

  const errorMsg = createElementWithClass('h3', 'error-msg');
  errorMsg.textContent = `Введено не верная форма ${elem == 'category'? 'категории': 'задачи'}`;

  modalMain.prepend(errorMsg);
  elemTitle.classList.add('.error-box');
}

// меняет класс hidden
function toggleHidden(className) {
  const elem = document.querySelector(`.${className}`);

  elem.classList.toggle('hidden');
};

// Переключение перечеркивающихся задач
function toggleLineTrought(desc, checked) {
  desc.classList.remove('line-trought');

  if (checked) desc.classList.add('line-trought');
};

//  Переключатель
async function toggle(checkbox, taskParam) {
  const checkboxId = checkbox.id;
  const description = document.querySelector(`#task${checkboxId}`);

  updateTask(taskParam, checkbox.checked);

  toggleLineTrought(description, checkbox.checked);
};

// Создаем передаваемый элемент с передаваемым классом 
function createElementWithClass(el, className) {
  const element = document.createElement(el);

  element.classList.add(className);

  return element;
};

async function updateColorList() {
  const colorCategoryList = document.querySelector('.category-color');
  const colorList = await getColor();

  console.log(colorList);

  colorCategoryList.innerHTML = `<option value="" disabled selected>Выберите цвет...</option>`;

  colorList.forEach(color => {
    const option = document.createElement('option');

    option.value = color.id;
    option.textContent = color.title;

    colorCategoryList.append(option);
  });
};

// функция обновляет selector с категориями
async function updateCategoryList() {
  const userCategoryList = document.querySelector('.task-category');

  userCategoryList.innerHTML = `
  <option value="" disabled selected>Категории...</option>
  <option value="Новая категория">Новая категория</option>
  `;
  const categorysList = await getCategorys();

  categorysList.forEach(category => {
    const option = document.createElement('option');

    option.value = category.title;
    option.textContent = category.title;

    userCategoryList.append(option);
  });
};

// Авторизация пользователей
btnAuth.addEventListener('click', async () => {
  const userName = document.querySelector('.auth__title');
  const headerTitle = document.querySelector('.header__title');

  await getUser(userName.value);

  headerTitle.textContent += Cookies.get('userName') + "а";
  
  appendCard();

  toggleHidden('modal__auth');
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
  });
};

// Создается и заполняется макет карточки категорий
function composeCard(category) {
  const card = createElementWithClass('div', 'card');
  const rgbaColor = hex2rgb(category.hex_code);
  card.style.background = `rgba(${rgbaColor.r}, ${rgbaColor.g}, ${rgbaColor.b}, .5)`;

  card.id = `card${category.id}`;

  const cardHeader = createElementWithClass('div', 'card__header');
  const cardTitle = createElementWithClass('h2', 'card__title');

  cardTitle.textContent = `${category.title}`;

  const cardTask = createElementWithClass('div', 'card__tasks');

  cardHeader.append(cardTitle);
  card.append(cardHeader);
  card.append(cardTask);

  return card;
};

// Добавить новую задачу
async function appendTask(categoryParam) {
  const cardTask = document.querySelector(`#card${categoryParam.id} > .card__tasks`);
  cardTask.innerHTML = ''
  const tasksList = await getTask(categoryParam.id);

  tasksList.forEach(task => {
    cardTask.append(composeTask(task));
  });

  return cardTask;
};

// Создается и заполняется макет задач 
function composeTask(tasksParam) {
  const task = createElementWithClass('div', 'task');
  const cardCheckbox = createElementWithClass('div', 'card__checkbox');
  const checkbox = createElementWithClass('input', 'checkbox');

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
  });

  toggleLineTrought(taskDescription, checkbox.checked);

  return task;
};

// Кнопка добавления новой задачи
btnAddTask.addEventListener('click', async () => {
  toggleHidden('modal__task');

  updateCategoryList();
});

// Добавление новой задачи
btnAcceptAddTask.addEventListener('click', async () => {
  const selectValue = document.querySelector('.task-category').value;

  if (selectValue == "Новая категория") {
    toggleHidden('modal__category');

    updateColorList();
  } else if (selectValue) {
    const categoryList = await getCategorys();
    const category = categoryList.filter(el => el.title == selectValue);
    const taskDescription = document.querySelector('.new-task__title').value;

    if (taskDescription && taskDescription.length > 3 && !taskDescription.startsWith(' ')) {
      await createTask(category[0].id, taskDescription);
      
      appendTask(category[0]);
    } else {
      errorMsg('task');
    }
  };
});

// Добавление новой категории
btnAcceptAddCategory.addEventListener('click', async () => {
  const categoryTitle = document.querySelector('.new-category__title').value;
  const categoryColor = document.querySelector('.category-color').value;

  if (categoryTitle && categoryTitle.length > 3 && !categoryTitle.startsWith(' ')) {
    await createCategory(categoryTitle, categoryColor);

    appendCard();

    updateCategoryList();

    toggleHidden('modal__category');
  } else {
    errorMsg('category');
  }
});

// Закрыть меню добавления задач
btnCancelAddTask.addEventListener('click', () => {
  toggleHidden('modal__task');
});

// Закрыть меню добавления категорий
btnCancelAddCategory.addEventListener('click', () => {
  toggleHidden('modal__category');
});