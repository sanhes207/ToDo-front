import Cookies from "../node_modules/js-cookie/dist/js.cookie.min.mjs";

// Создаем путь до статичного localhost
const instance = axios.create({
  baseURL: "http://localhost:8080/api"
});

// Возвращаем авторизованного пользователя
async function getUser(userName) {
  await instance.get(`/user/${userName}`)
  .then(res => {
    Cookies.set('userID', res.data.id);
    Cookies.set('userName', res.data.name)
  });
}

// Получаем задачи пользователя
async function getTask(categoryID) {
  const response = await instance.get('/task', {  
    params: {
      'category_id': categoryID
    },
    headers: {
      'user_id': Cookies.get('userID')
    }
  })
  .catch(err => console.log(err));

  return await response.data;
}

// Получаем категории пользователя
async function getCategorys() {
  const response = await instance.get('/category', {
    params: {
      'user_id': Cookies.get('userID')
    }
  })
  .catch(err => console.log(err));

  return await response.data;
}

// Получаем категории пользователя
async function getColor() {
  const response = await instance.get('/category/color')
  .catch(err => console.log(err));

  return await response.data;
}

// Создание новой категории
async function createCategory(categoryTitle,categoryColor) {
  await instance.post('/category', {
    'user_id': Cookies.get('userID'),
    'title': categoryTitle,
    'color_id': categoryColor || 1
  })
  .then (res => console.log(res))
  .catch(err => console.log(err));
}

// Создание новой задачи
async function createTask(categoryId, taskDescription) {
  await instance.post('/task', {
    "category_id":  categoryId,
    "description": taskDescription
  })
  .then(res => console.log(res))
  .catch(err => console.log(err));
}

// Обновление состояния задачи
async function updateTask(task, isChecked) {
  const {id} = task;

  await instance.put('/task', {
    "is_checked": isChecked,
    "task_id": id
  })
  .then(res => console.log(res))
  .catch(err => console.log(err));
}

export {getUser, getTask, getCategorys, createCategory, createTask, updateTask, getColor};