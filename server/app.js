const Koa = require('koa');
const app = new Koa();

const server = require('http').createServer(app.callback());

const io = require('socket.io')(server);

const video = fs.readSyncFile('resources/video.mp4')

var cameras = io
  .of('/video')
	.on('connection', function (socket) {
    socket.emit('Connected to server!');
    socket.on('camera-feed', (fn) => {
      fn(video);
    });
  });

server.listen(3000);