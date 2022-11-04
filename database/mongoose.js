const mongoose = require('mongoose')
const config = require('../config/config')

mongoose.connect(config.MONGO_URL,
  {
    useNewUrlParser: true
  }
)
const db = mongoose.connection
db.on(' error ', console.error.bind(console, 'connection error: '))
db.once('open', function () {
  console.log('Database Connection successfull')
})
