var express = require('express')
var app = express()
var bodyParser = require('body-parser')
var server = require('http').Server(app)
var io = require('socket.io')(server)
var fs = require('fs')

app.use(express.static('public'))

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

io.of('/video').on('connection', function () {
  console.log('New client connected!')
})

app.post('/video', (req, res) => {
  fs.readFile(req.body.filepath, function (err, data) {
    if (err) {
      throw err
    }

    console.log('Sending chunk!')

    io.of('/video').emit('feed', {
      timestamp: req.body.timestamp,
      payload: data
    })
  })

  res.status(200).send('OK')
})

server.listen(8080, function () {
  console.log('Listening on port 8080!')
})
