var express  = require('express');
var app = express();
var bodyParser = require("body-parser");
var server = require('http').Server(app);
var io = require('socket.io')(server);
var fs = require('fs');

// const PriorityQueue = require('./public/priority_queue')
// var queue = new PriorityQueue
app.use(express.static('public'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post('/video', (req, res) => {
  fs.readFile(req.body.filepath, function(err, data) {
    if (err) {
      throw err;
    }
    
    io.of('/video').emit('feed', {
      timestamp: req.body.timestamp,
      payload: data
    });
  });

  res.status(200).send()
});

io.on('connection', function(socket) {
  console.log('New client connected!');
});

server.listen(8080, function() {
  console.log('Listening on port 8080!');
});