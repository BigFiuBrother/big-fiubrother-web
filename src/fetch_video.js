var Minio = require('minio')
var logger = require('./logger')

var minioClient = new Minio.Client({
    endPoint: 'localhost',
    port: 9500,
    useSSL: false,
    accessKey: 'fiubrother',
    secretKey: 'alwayswatching'
})

function fetch_video(video_chunk_id, success_callback) {
  minioClient.getObject('processed-video-chunks', `${video_chunk_id}.mp4`, function(err, dataStream) {
    if (err) {
      return console.log(err)
    }
    
    var chunks = []

    logger.debug(`Starting to fetch ${video_chunk_id} from S3!`)

    dataStream.on('data', function(chunk) {
      chunks.push(chunk)
    })

    dataStream.on('end', function() {
      var buffer = Buffer.concat(chunks)
      
      logger.debug(`Finished fetch ${video_chunk_id} from S3!`)

      success_callback(buffer)
    })

    dataStream.on('error', function(err) {
      console.log(err)
    })
  })
}

module.exports = fetch_video