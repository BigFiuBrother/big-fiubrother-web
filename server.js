var express = require('express')
var app = express()
var bodyParser = require('body-parser')
var server = require('http').Server(app)
var io = require('socket.io')(server)

var fetch_video = require('./src/fetch_video')
var logger = require('./src/logger')

app.use(express.static('public'))

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

io.of('/video').on('connection', function () {
  logger.info('New client connected!')
})

app.post('/video', (req, res) => {
  var video_chunk_id = req.body.video_chunk_id

  fetch_video(video_chunk_id, function(data) {
      logger.debug(`Starting to send ${video_chunk_id} to client!`)

      io.of('/video').emit('feed', {
        timestamp: req.body.timestamp,
        payload: data,
        duration: req.body.duration
      })
  })

  res.status(200).send('OK')
})

server.listen(8080, function () {
  console.log('Listening on port 8080!')
})
