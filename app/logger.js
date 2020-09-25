var os = require("os")
var graylog2 = require("graylog2")
const configuration = require("./configuration")


var logger = new graylog2.graylog({
    servers: [
        {
          'host': configuration.logger.host,
          'port': configuration.logger.port 
        }
    ],
    hostname: os.hostname(),
    facility: 'Big Fiubrother Web Server',
    bufferSize: 1350
})

logger.on('error', function (error) {
    console.error('Error while trying to write to graylog2:', error)
})


module.exports = logger