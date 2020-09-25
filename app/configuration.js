const args = require("args-parser")(process.argv)
const fs = require('fs')
const yaml = require('js-yaml')


var configuration = {}

try {
  const filename = './config/' + (args.env || 'development') + '.yml'

  var file = fs.readFileSync(filename, 'utf8')

  configuration = yaml.safeLoad(file)
} catch (e) {
  console.log(e)
}


module.exports = configuration