const db = require('../models')
const Comment = db.Comment

const helpers = require('../_helpers');

const commentService = {
  // Post
  postComment: async (req, res, cb) => {
    const { text } = req.body
    const RestaurantId = req.body.restaurantId
    const UserId = helpers.getUser(req).id

    await Comment.create({ text, RestaurantId, UserId })
    return cb({ status: 'success', message: 'comment is added successfully', RestaurantId})
  },
  // Delete
  deleteComment: async (req, res, cb) => {
    const id = req.params.id

    await Comment.destroy({ where: { id } })
    return cb({ status: 'success', message: 'comment is removed successfully'})
  }
}

module.exports = commentService