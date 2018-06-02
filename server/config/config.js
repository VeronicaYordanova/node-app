const path = require('path')

let rootPath = path.normalize(path.join(__dirname, '../../'))

module.exports = {
  development: {
    rootPath: rootPath,
    db: 'mongodb://localhost:27017/nodeApp',
    port: process.env.PORT || 1337
  },
  production: {}
}