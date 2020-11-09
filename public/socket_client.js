import io from 'socket.io-client'

export class SocketClient {
  constructor () {
    this.client = io.connect('http://localhost:8080/video', { forceNew: true })
  }

  onChunk (callback) {
    this.client.on('chunk', callback)
  }

  onAnalysis (callback) {
    this.client.on('analysis', callback)
  }
}
