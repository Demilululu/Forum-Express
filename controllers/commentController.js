const db = require('../models')
const Restaurant = db.Restaurant
const User = db.User
const Comment = db.Comment

const helpers = require('../_helpers');


const commentController = {
  // Post
  postComment: (req, res) => {
    const { text } = req.body
    const RestaurantId = req.body.restaurantId
    const UserId = helpers.getUser(req).id

    return Comment.create({ text, RestaurantId, UserId })
      .then(() => res.redirect(`/restaurants/${RestaurantId}`))
  },
  // Delete
  deleteComment: (req, res) => {
    const id = req.params.id
    return Comment.findByPk(id)
      .then((comment) => {
        const restaurantId = comment.RestaurantId
        comment.destroy()
          .then(() => {
            res.redirect(`/restaurants/${restaurantId}`)
          })
      })
  }
}

module.exports = commentController