const pgClient = require('./pg_client')

const analysisQuery = `
  SELECT chunk.frame_count as frame_count,
         chunk.offset as offset, 
         chunk.bounding_box as bounding_box, 
         chunk.is_match as is_match, 
         chunk.probability_classification as probability, 
         person.name as name
  FROM (
    SELECT *
    FROM video_chunk, frame, face
    WHERE video_chunk.id = frame.video_chunk_id AND
          frame.id = face.frame_id AND
          video_chunk.id = $1
  ) chunk
  LEFT JOIN person
  ON chunk.classification_id = person.id
  ORDER BY chunk.offset ASC;
`

class VideoAnalysis {
  constructor (id) {
    this.promise = pgClient.query(analysisQuery, [id]).then((res) => {
      return new Promise((resolve, reject) => {
        const result = { chunkId: id, frameCount: res.rows[0].frame_count }
        const frames = []

        res.rows.forEach((row) => {
          let frame

          if (frames.length > 0 && frames[frames.length - 1].offset === row.offset) {
            frame = frames[frames.length - 1]
          } else {
            frame = { offset: row.offset, faces: [] }
            frames.push(frame)
          }

          frame.faces.push({
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
