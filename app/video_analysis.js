const pgClient = require('./pg_client')

const analysisQuery = `
  SELECT frame_and_face.offset as offset, 
          frame_and_face.bounding_box as bounding_box, 
          frame_and_face.is_match as is_match, 
          frame_and_face.probability_classification as probability, 
          person.name as name
  FROM (
      SELECT * 
      FROM frames as frame
      INNER JOIN faces as face
      ON frame.id = face.frame_id
      WHERE frame.video_chunk_id = $1
  ) frame_and_face
  LEFT JOIN people as person
  ON frame_and_face.classification_id = person.id;
`

class VideoAnalysis {
  constructor (request) {
    this.promise = pgClient.query(analysisQuery, [this.id]).then((res) => {
      return new Promise((resolve, reject) => {
        const result = { chunkId: request.id }

        res.rows.forEach((row) => {
          const offset = row.offset

          if (!(offset in result)) {
            result[offset] = []
          }

          result[offset].append({
            boundingBox: row.bounding_box,
            isMatch: row.is_match,
            probability: row.probability,
            name: row.name
          })
        })

        resolve(result)
      })
    }, console.log)
  }
}

module.exports = VideoAnalysis
