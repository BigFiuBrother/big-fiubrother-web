var mime = 'video/mp4; codecs="avc1.640028"'
var mediaSource = new MediaSource()

var video = document.getElementById('video-player')
video.src = URL.createObjectURL(mediaSource)

var socket = io.connect('http://localhost:8080/video', { forceNew: true })

mediaSource.addEventListener('sourceopen', function (e) {
  // URL.revokeObjectURL(video.src);

  var mediaSource = e.target
  mediaSource.duration = Number.POSITIVE_INFINITY

  var sourceBuffer = mediaSource.addSourceBuffer(mime)
  sourceBuffer.mode = 'sequence'

  var lastTimestamp = 0

  var queue = new PriorityQueue(function (a, b) {
    return a.timestamp > b.timestamp
  })

  function appendBuffer (buffer, data) {
    if (data.timestamp > lastTimestamp) {
      buffer.appendBuffer(data.payload)
      lastTimestamp = data.timestamp
    }
  }

  sourceBuffer.addEventListener('updateend', function (e) {
    if (!sourceBuffer.updating && !queue.isEmpty()) {
      var data = queue.pop()
      appendBuffer(sourceBuffer, data)
    }
  })

  sourceBuffer.addEventListener('error', function (e) {
    console.log(e)
  })

  socket.on('feed', function (data) {
    console.log(`Feed received! timestamp: ${data.timestamp}`)
    if (sourceBuffer.updating) {
      queue.push(data)
    } else {
      appendBuffer(sourceBuffer, data)
    }
  })
})
