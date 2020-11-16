import { SocketClient } from './modules/socket_client.js'
import { VideoIndex } from './modules/video_index.js'
import { VideoCanvas } from './modules/video_canvas.js'
import { VideoBuffer } from './modules/video_buffer.js'

const socketClient = new SocketClient()
const videoIndex = new VideoIndex()
socketClient.onAnalysis(videoIndex.addAnalysis)

const videoCanvas = new VideoCanvas(videoIndex)

const mime = 'video/mp4; codecs="avc1.f4001f"'
// eslint-disable-next-line no-undef
const mediaSource = new MediaSource()

const video = document.getElementById('auxiliary-video')
video.src = URL.createObjectURL(mediaSource)

mediaSource.addEventListener('sourceopen', (e) => {
  const mediaSource = e.target
  // Set duration for infinite stream
  mediaSource.duration = Number.POSITIVE_INFINITY

  const sourceBuffer = mediaSource.addSourceBuffer(mime)
  const videoBuffer = new VideoBuffer(sourceBuffer, videoIndex)

  let hasSwitchedTabs = false

  function resume () {
    if (video.paused) {
      video.play()
    }
  }

  window.onblur = () => {
    hasSwitchedTabs = true
  }

  window.onfocus = () => {
    if (hasSwitchedTabs) {
      hasSwitchedTabs = false
      const lastChunk = videoBuffer.getLastChunk()
      video.currentTime = videoBuffer.getTimeAppended() - lastChunk.duration
      videoCanvas.updateToChunk(videoIndex.id)
      resume()
    }
  }

  socketClient.onChunk((chunk) => {
    if (videoBuffer.preBufferChunk(chunk)) {
      resume()
    }
  })
})
