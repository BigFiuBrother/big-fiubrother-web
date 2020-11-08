const configuration = require('./configuration')

const { Client } = require('pg')
const client = new Client(configuration.db)

client.connect()

module.exports = client
