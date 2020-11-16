const logger = require('./logger')
const configuration = require('./configuration')

const Minio = require('minio')
const minioClient = new Minio.Client(configuration.storage)

function onSuccess (videoChunkId, stream) {
  logger.debug(`Starting to fetch ${videoChunkId} from S3!`)

  return new Promise((resolve, reject) => {
    const chunks = []

    stream.on('error', function (err) {
      reject(err)
    })

    stream.on('data', function (chunk) {
      chunks.push(chunk)
    })

    stream.on('end', function () {
      const buffer = Buffer.concat(chunks)

      logger.debug(`${videoChunkId} fetched from S3!`)

      resolve(buffer)
    })
  })
}

function onError (videoChunkId, err) {
  logger.error(`Fetched failed for ${videoChunkId}!`, err)
}

function fetchVideo (videoChunkId) {
  const promise = minioClient.getObject('video-chunks', `${videoChunkId}.mp4`)

  return promise.then(onSuccess.bind(null, videoChunkId), onError.bind(null, videoChunkId))
}

module.exports = fetchVideo
