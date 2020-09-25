var express = require('express')
var bodyParser = require('body-parser')
var http = require('http')

const SocketServer = require('./socket_server')
const Chunk = require('./chunk')


// Create app and server
var app = express()
var server = http.Server(app)

// Expose public
app.use(express.static('public'))

// Use body parser 
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Create SocketServer
var socketServer = new SocketServer(server)

// Video endpoint
app.post('/video', (req, res) => {
  var chunk = new Chunk(req.body)

  socketServer.sendChunk(chunk)

  res.status(200).send('OK')
})

// Boxes endpoint
app.post('/boxes', (req, res) => {
  socketServer.sendBoxes(req.body)

  res.status(200).send('OK')
})


module.exports = server