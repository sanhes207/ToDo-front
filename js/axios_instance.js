// Создаем путь до статичного localhost
const instance = axios.create({
  baseURL: "http://localhost:8080/api"
});


// 
async function getUser(userName) {
  instance.get(`/user/${userName}`)
  .then(res => console.log(res.data.id))
  .catch(err => console.log(err))
}

async function getTask(userID) {
  await instance.get('/task', {
    headers: {
      'user_id': userID
    }
  })
  .then(res => {
    console.log(res);
  })
  .catch(err => console.log(err))
}


export {getUser, getTask};