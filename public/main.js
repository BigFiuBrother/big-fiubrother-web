const PriorityQueue = require('./priority_queue')

var mime = 'video/mp4; codecs="avc1.64001F"';
var mediaSource = new MediaSource();

var player = document.getElementById('video-player');
player.src = URL.createObjectURL(mediaSource);

var socket = io.connect('http://localhost:8080/video', { 'forceNew': true });

mediaSource.addEventListener('sourceopen', function(e) {
  URL.revokeObjectURL(player.src);
  
  var mediaSource = e.target;
  mediaSource.duration = Number.POSITIVE_INFINITY
  
  var sourceBuffer = mediaSource.addSourceBuffer(mime);

  var queue = new PriorityQueue(function (a,b) {
    return a.timestamp > b.timestamp;
  });

  sourceBuffer.addEventListener('updateend', function(e) {
    if (!sourceBuffer.updating && !queue.isEmpty()) {
      var buffer = queue.pop().payload;
      sourceBuffer.appendBuffer(buffer);
    }
  });

  sourceBuffer.addEventListener('error', function(e) {
    console.log(e);
  });

  socket.on('feed', function(data) {
    if (sourceBuffer.updating) {
      queue.push(data);
    } else {
      sourceBuffer.appendBuffer(data.payload);
    }
  });
});



