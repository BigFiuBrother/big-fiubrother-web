const axios = require('axios')

axios
  .post('http://localhost:8080/video/chunk/8', {})
  .then(res => {
    console.log(`statusCode: ${res.status}, statusText: ${res.statusText}`)
  })
  .catch(error => {
    console.error(error)
  })