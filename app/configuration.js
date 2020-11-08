const args = require('args-parser')(process.argv)
const fs = require('fs')
const yaml = require('js-yaml')

let configuration = {}

try {
  const filename = './config/' + (args.env || 'development') + '.yml'

  const file = fs.readFileSync(filename, 'utf8')

  configuration = yaml.safeLoad(file)
} catch (e) {
  console.log(e)
}

module.exports = configuration
