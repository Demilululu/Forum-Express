const commentService = require('../../services/commentService')

const commentController = {
  // Post
  postComment: (req, res) => {
    commentService.postComment(req, res, data => {
      return res.json(data)
    })
  },
  // Delete
  deleteComment: (req, res) => {
    commentService.deleteComment(req, res, data => {
      return res.json(data)
    })
  }
}

module.exports = commentController