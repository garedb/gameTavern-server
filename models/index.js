let mongoose = require('mongoose')

// SET SERVER NAME HERE
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/mern-sei', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
})

module.exports.User = require('./user')
