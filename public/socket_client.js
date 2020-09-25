class SocketClient {
  constructor() {
    this.client = io.connect('http://localhost:8080/video', { forceNew: true })    
  }

  onChunk(callback) {
    this.client.on('chunk', callback)
  }

  onBoxes(callback) {
    this.client.on('boxes', callback)
  }
}



