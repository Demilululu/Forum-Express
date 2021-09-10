const commentService = require('../services/commentService')

const commentController = {
  // Post
  postComment: (req, res) => {
    commentService.postComment(req, res, data => {
      if(data.status === 'success'){
        return res.redirect(`/restaurants/${data.RestaurantId}`)
      }
    })
  },
  // Delete
  deleteComment: (req, res) => {
    commentService.deleteComment(req, res, data => {
      if (data.status === 'success') {
        return res.redirect('back')
      }
    })
  }
}

module.exports = commentController