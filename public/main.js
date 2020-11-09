import { SocketClient } from './socket_client'
import { VideoIndex } from './video_index'
import { VideoCanvas } from './video_canvas'
import { VideoBuffer } from './video_buffer'

const socketClient = new SocketClient()
const videoIndex = new VideoIndex()
socketClient.onAnalysis(videoIndex.addAnalysis)

const videoCanvas = new VideoCanvas(videoIndex)

const mime = 'video/mp4; codecs="avc1.f4001f"'
// eslint-disable-next-line no-undef
const mediaSource = new MediaSource()

const video = document.getElementById('video')
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
