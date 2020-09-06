function formatDate(date) {
    // Hours part from the timestamp
    var hours = date.getHours();
    // Minutes part from the timestamp
    var minutes = "0" + date.getMinutes();
    // Seconds part from the timestamp
    var seconds = "0" + date.getSeconds();

    // Will display time in 10:30:23 format
    return hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
}

function debugTime(timestamp) {
    var timestampDate = new Date(Math.floor(timestamp * 1000));

    console.log(`Feed time: ${formatDate(timestampDate)} - Current time: ${formatDate(new Date())}`)

    var video = document.getElementById('video-player')
    console.log(`Video time: ${video.currentTime}`)
}

var mime = 'video/mp4; codecs="avc1.f4001f"'
var mediaSource = new MediaSource()

var video = document.getElementById('video-player')
video.src = URL.createObjectURL(mediaSource)

var socket = io.connect('http://localhost:8080/video', { forceNew: true })

mediaSource.addEventListener('sourceopen', function (e) {
  var mediaSource = e.target
  mediaSource.duration = Number.POSITIVE_INFINITY

  var sourceBuffer = mediaSource.addSourceBuffer(mime)
  sourceBuffer.mode = 'sequence'

  var lastTimestamp = 0
  var playTime = 0
  var firstChunkDuration = 0

  var hasSwitchedTabs = false

  // Set when tab is inactive
  window.onfocus = function () { 
    if (hasSwitchedTabs) {
      hasSwitchedTabs = false
      //console.log(`Tabs switched! Changing video time to: ${playTime}`)
      video.currentTime = playTime
      
      if (video.paused) {
        video.play()
      }
    }
  };

  window.onblur = function() {
    hasSwitchedTabs = true
  }

  var queue = new PriorityQueue(function (a, b) {
    return a.timestamp > b.timestamp
  })

  function appendBuffer (buffer, data) {
    if (data.timestamp > lastTimestamp) {
      console.log(`Appending buffer ${data.timestamp}`)
      buffer.appendBuffer(data.payload)
      lastTimestamp = data.timestamp
      
      if (video.paused) {
        video.play()
      }
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
    if (sourceBuffer.updating || firstChunkDuration == 0) {
      if (firstChunkDuration == 0) {
        firstChunkDuration = data.duration
      }
      queue.push(data)
    } else {
      appendBuffer(sourceBuffer, data)
    }

    setTimeout(function() {
      var expected = playTime + data.duration
      var actual = video.currentTime + firstChunkDuration
      console.log(`Difference time: ${expected - actual}`)
      playTime = expected
    }, data.duration * 1000)
  })
})
