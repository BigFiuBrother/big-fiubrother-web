const pgClient = require('./pg_client')

const analysisQuery = `
  SELECT chunk.frame_count as frame_count
         chunk.offset as offset, 
         chunk.bounding_box as bounding_box, 
         chunk.is_match as is_match, 
         chunk.probability_classification as probability, 
         person.name as name
  FROM (
    SELECT *
    FROM video_chunks as chunk, frames as frame, faces as face
    WHERE chunk.id = frame.video_chunk_id AND
          frame.id = face.frame_id AND
          video_chunk.id = $1
  ) chunk
  LEFT JOIN people as person
  ON chunk.classification_id = person.id
  SORT BY chunk.offset ASC;
`

class VideoAnalysis {
  constructor (request) {
    this.promise = pgClient.query(analysisQuery, [this.id]).then((res) => {
      return new Promise((resolve, reject) => {
        const result = { chunkId: request.id }
        const frames = []

        res.rows.forEach((row) => {
          let frame

          if (frames.length > 0 && frames[frames.length - 1] === frame.offset) {
            frame = frames[frames.length - 1]
          } else {
            frame = { offset: row.offset, frameCount: row.frame_count, faces: [] }
            result.frames.push(frame)
          }

          frame.faces.append({
            box: row.bounding_box,
            isMatch: row.is_match,
            probability: row.probability,
            name: row.name
          })
        })

        result.frames = frames

        resolve(result)
      })
    }, console.log)
  }
}

module.exports = VideoAnalysis
