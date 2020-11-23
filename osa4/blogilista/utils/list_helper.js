const _ = require('lodash')

// eslint-disable-next-line no-unused-vars
const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((sum, b) => sum + b.likes, 0)
}

const favoriteBlog = (blogs) => {
  return blogs.reduce((b1, b2) => b2.likes > b1.likes ? b2 : b1)
}

const mostBlogs = (blogs) => {
  const blogsByAuthor = _.groupBy(blogs, 'author')
  const countsByAuthor = _.map(blogsByAuthor, (blogs, author) => {
    return {
      author,
      blogs: blogs.length
    }
  })
  return _.maxBy(countsByAuthor, ab => ab.blogs)
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
}
