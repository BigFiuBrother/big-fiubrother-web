var os = require("os")
var graylog2 = require("graylog2")

var logger = new graylog2.graylog({
    servers: [
        { 'host': 'localhost', port: 12201 }
    ],
    hostname: os.hostname(),
    facility: 'Big Fiubrother Web Server',
    bufferSize: 1350
})

logger.on('error', function (error) {
    console.error('Error while trying to write to graylog2:', error)
})

module.exports = logger