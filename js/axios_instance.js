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
    headers: {
      'user_id': Cookies.get('userID'),
      'category_id': categoryID
    }
  })
  .catch(err => console.log(err));

  return await response.data;
}

// Получаем категории пользователя
async function getCategorys() {
  const response = await instance.get('/category', {
    headers: {
      'user_id': Cookies.get('userID')
    }
  })
  .catch(err => console.log(err));

  return await response.data;
}

// Создание новой категории
async function createCategory(categoryTitle) {
  await instance.post('/category', {
    'user_id': Cookies.get('userID'),
    'title': categoryTitle
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

export {getUser, getTask, getCategorys, createCategory, createTask, updateTask};