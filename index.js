const express = require('express')

let app = express()
let env = process.env.NODE_ENV || 'development'
let config = require('./server/config/config')[env]
require('./server/config/database')(config)
require('./server/config/express')(app, config)
require('./server/config/routes')(app)
require('./server/config/passport')()

app.listen(config.port)

console.log(`Express listening on ${config.port}`)