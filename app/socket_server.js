const logger = require('./logger')

class SocketServer {
  constructor (server) {
    this.io = require('socket.io')(server)

    this.io.of('/video').on('connection', function () {
      logger.info('New client connected!')
    })
  }

  sendVideoChunk (chunk) {
    logger.info(`Starting to send chunk ${chunk.id} to clients!`)

    chunk.payloadPromise.then((payload) => {
      chunk.metadataPromise.then((metadata) => {
        this.io.of('/video').emit('chunk', { ...metadata, payload: payload })
      })
    })
  }

  sendVideoAnalysis (analysis) {
    logger.info(`Starting to send analysis ${analysis.chunkId} to clients!`)

    analysis.promise.then((videoAnalysis) => {
      this.io.of('/video').emit('analysis', videoAnalysis)
    })
  }
}

module.exports = SocketServer