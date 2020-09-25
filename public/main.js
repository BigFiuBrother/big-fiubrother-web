var socketClient = new SocketClient();
var videoIndex = new VideoIndex();
socketClient.onBoxes(videoIndex.addBoxes);

var videoCanvas = new VideoCanvas(videoIndex);

var mime = 'video/mp4; codecs="avc1.f4001f"';
var mediaSource = new MediaSource();

var video = document.getElementById('video');
video.src = URL.createObjectURL(mediaSource);

mediaSource.addEventListener('sourceopen', (e) => {
  var mediaSource = e.target;
  mediaSource.duration = Number.POSITIVE_INFINITY;

  var sourceBuffer = mediaSource.addSourceBuffer(mime);
  var videoBuffer = new VideoBuffer(sourceBuffer, videoIndex);

  var hasSwitchedTabs = false;

  function resume() {
    if (video.paused) {
      video.play();
    }
  }

  window.onblur = () => {
    hasSwitchedTabs = true;
  }

  window.onfocus = () => { 
    if (hasSwitchedTabs) {
      hasSwitchedTabs = false
      var lastChunk = videoBuffer.lastChunk();
      video.currentTime = videoBuffer.timeAppended() - lastChunk.duration;
      videoCanvas.updateToChunk(videoIndex.id);
      resume();
    }
  }

  socketClient.onChunk((chunk) => {
    if (videoBuffer.appendChunk(chunk)) {
      resume();
    }
  })
})


