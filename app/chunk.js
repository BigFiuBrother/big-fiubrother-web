var fetchVideo = require('./fetch_video')


class Chunk {
  constructor(request) {
    this.id = request.video_chunk_id
    this.timestamp = request.timestamp
    this.duration = request.duration
    this.payloadPromise = fetchVideo(this.id)
  }
}


module.exports = Chunk