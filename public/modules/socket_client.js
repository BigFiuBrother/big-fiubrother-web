export class SocketClient {
  constructor () {
    this.client = io.connect('http://localhost:8080/video', { forceNew: true })
    console.log("Connected to web server!")
  }

  onChunk (callback) {
    this.client.on('chunk', callback)
  }

  onAnalysis (callback) {
    this.client.on('analysis', callback)
  }
}
