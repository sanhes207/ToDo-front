baseURL = "http://localhost:8080/api"

window.addEventListener('load', () => {
  console.log('Страница загрузилась');
  getLoadRequest(1);
})

async function getLoadRequest(id) {
  await axios.get(`${baseURL}/tasks/${id}`)
  .then(res => console.log(res.data));
}