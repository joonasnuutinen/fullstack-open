const mongoose = require('mongoose')

const blogSchema = mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number
})

blogSchema.set('toJSON', {
  transform: (doc, obj) => {
    obj.id = obj._id.toString()
    delete obj._id
  }
})

module.exports = mongoose.model('Blog', blogSchema)
