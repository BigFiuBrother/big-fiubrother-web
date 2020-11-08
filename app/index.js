const express = require('express')
const bodyParser = require('body-parser')
const http = require('http')

const SocketServer = require('./socket_server')
const VideoChunk = require('./video_chunk')
const VideoAnalysis = require('./video_analysis')

// Create app and server
const app = express()
const server = http.Server(app)

// Expose public
app.use(express.static('public'))

// Use body parser
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Create SocketServer
const socketServer = new SocketServer(server)

// Video endpoint
app.post('/video/chunk', (req, res) => {
  socketServer.sendChunk(new VideoChunk(req.body))

  res.status(200).send('OK')
})

// Analysis endpoint
app.post('/video/analysis', (req, res) => {
  socketServer.sendAnalysis(new VideoAnalysis(req.body))

  res.status(200).send('OK')
})

module.exports = server
