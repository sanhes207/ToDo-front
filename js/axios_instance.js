import Cookies from "../node_modules/js-cookie/dist/js.cookie.min.mjs";

// Создаем путь до статичного localhost
const instance = axios.create({
  baseURL: "http://localhost:8080/api"
});

// Возвращаем id авторизованного пользователя
async function getUser(userName) {
  await instance.get(`/user/${userName}`)
  .then(res => Cookies.set('userID', res.data.id));
}

async function getTask(categoryID) {
  let response;
  await instance.get('/task', {
    headers: {
      'user_id': Cookies.get('userID'),
      'category_id': categoryID
    }
  })
  .then(res => response = res.data)
  .catch(err => response = err)

  return response;
}

async function getCategorys() {
  let response;
  await instance.get('/category', {
    headers: {
      'user_id': Cookies.get('userID')
    }
  })
  .then(res => response = res.data)
  .catch(err => response = err)

  return response;
}


export {getUser, getTask, getCategorys};