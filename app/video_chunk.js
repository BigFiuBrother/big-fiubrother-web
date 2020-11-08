const fetchVideo = require('./fetch_video')
const pgClient = require('./pg_client')

const metadataQuery = `
  SELECT frame_count as frameCount, duration, timestamp 
  FROM video_chunks 
  WHERE id = $1;
`

class Chunk {
  constructor (request) {
    this.id = request.id
    this.payloadPromise = fetchVideo(this.id)
    this.metadataPromise = pgClient.query(metadataQuery, [this.id]).then((res) => {
      return new Promise((resolve, reject) => {
        const result = res.rows[0]

        resolve({
          id: request.id,
          frameCount: result.frameCount,
          duration: result.duration,
          timestamp: result.timestamp
        })
      })
    }, console.log)
  }
}

module.exports = Chunk
