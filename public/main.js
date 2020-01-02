// var mime = 'video/mp4; codecs="avc1.64001F"';
// var mediaSource = new MediaSource();

// var player = document.getElementById('video-player');
// player.src = URL.createObjectURL(mediaSource);

// mediaSource.addEventListener('sourceopen', sourceOpen);

// function sourceOpen(e) {
//   URL.revokeObjectURL(player.src);

//   var mediaSource = e.target;
//   var sourceBuffer = mediaSource.addSourceBuffer(mime);

// };

var socket = io.connect('http://localhost:8080/video', { 'forceNew': true });

socket.on('feed', function(data) {
  console.log(data);
});
