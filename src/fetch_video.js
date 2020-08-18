var Minio = require('minio')

var minioClient = new Minio.Client({
    endPoint: 'localhost',
    port: 9000,
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

    dataStream.on('data', function(chunk) {
      chunks.push(chunk)
    })

    dataStream.on('end', function() {
      success_callback(Buffer.concat(chunks))
    })

    dataStream.on('error', function(err) {
      console.log(err)
    })
  })
}

module.exports = fetch_video