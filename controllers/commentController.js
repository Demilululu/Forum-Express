const db = require('../models')
const Restaurant = db.Restaurant
const User = db.User
const Comment = db.Comment

const helpers = require('../_helpers');


const commentController = {
  // Post
  postComment: async (req, res) => {
    const { text } = req.body
    const RestaurantId = req.body.restaurantId
    const UserId = helpers.getUser(req).id

    await Comment.create({ text, RestaurantId, UserId })
    return res.redirect(`/restaurants/${RestaurantId}`)
  },
  // Delete
  deleteComment: async (req, res) => {
    const id = req.params.id

    await Comment.destroy({ where: { id } })
    return res.redirect('back')
  }
}

module.exports = commentController