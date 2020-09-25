var logger = require('./logger')


class SocketServer {
  constructor(server) {
    this.io = require('socket.io')(server)

    this.io.of('/video').on('connection', function () {
      logger.info('New client connected!')
    })
  }

  sendChunk(chunk) {
    logger.info(`Starting to send chunk ${chunk.id} to clients!`)

    chunk.payloadPromise.then((payload) =>
      this.io.of('/video').emit('chunk', {
        timestamp: chunk.timestamp,
        payload: payload,
        duration: chunk.duration
      })
    )
  }

  sendBoxes(boxes) {
    logger.info(`Starting to send boxes ${boxes.chunkId} to clients!`)

    this.io.of('/video').emit('boxes', boxes)
  }
}


module.exports = SocketServer