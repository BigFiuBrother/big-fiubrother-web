const fetchVideo = require('./fetch_video')
const pgClient = require('./pg_client')

const metadataQuery = `
  SELECT frame_count, duration_ms, timestamp 
  FROM video_chunk
  WHERE id = $1;
`

class Chunk {
  constructor (id) {
    this.payloadPromise = fetchVideo(id)
    this.metadataPromise = pgClient.query(metadataQuery, [id]).then((res) => {
      return new Promise((resolve, reject) => {
        const result = res.rows[0]

        resolve({
          id: id,
          frameCount: result.frame_count,
          duration: result.duration_ms,
          timestamp: result.timestamp
        })
      })
    }, console.log)
  }
}

module.exports = Chunk
