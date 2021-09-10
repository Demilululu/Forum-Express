const bcrypt = require('bcryptjs')

const db = require('../models')
const User = db.User
const Comment = db.Comment
const Restaurant = db.Restaurant
const Favorite = db.Favorite
const Like = db.Like
const Followship = db.Followship

const helpers = require('../_helpers');
const fs = require('fs')
const imgur = require('imgur-node-api')
const user = require('../models/user')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

const userService = {
  // Profile
  getUser: async (req, res, cb) => {
    const id = req.params.id
    const userId = helpers.getUser(req).id
    const user = await User.findByPk(id)
    const commentData = await Comment.findAndCountAll({
      where: { UserId: id }, raw: true, nest: true, attributes: ['RestaurantId'],
      include: { model: Restaurant, attributes: ['id', 'image'] }
    })
    return cb({ userData: user.toJSON(), userId, comment: commentData.rows, n_comments: commentData.count })
  },
  editUser: async (req, res, cb) => {
    const id = req.params.id
    const userId = helpers.getUser(req).id

    if (Number(id) !== Number(userId)) {
      return cb({ status: 'error', message: 'you can only edit your own profile', userId })
    }
    const user = await User.findByPk(id)
    return cb({ user: user.toJSON() })
  },
  putUser: (req, res, cb) => {
    const { name, email } = req.body
    const { file } = req
    const id = req.params.id

    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID);
      imgur.upload(file.path, (err, img) => {
        return User.findByPk(id)
          .then((user) => {
            user.update({ name, email, image: file ? img.data.link : user.image })
              .then(() => {
                cb({ status: 'success', message: 'user was updated successfully', id })
              })
          })
      })
    } else {
      return User.findByPk(id)
        .then((user) => {
          user.update({ name, email, image: user.image })
            .then(() => {
              cb({ status: 'success', message: 'user was updated successfully', id })
            })
        })
    }
  },

  // Favorites
  addFavorite: async (req, res, cb) => {
    const UserId = helpers.getUser(req).id
    const RestaurantId = req.params.restaurantId

    await Favorite.create({ UserId, RestaurantId })
    return cb({ status: 'success', message: 'restaurant is added to favorite' })
  },
  removeFavorite: async (req, res, cb) => {
    const UserId = helpers.getUser(req).id
    const RestaurantId = req.params.restaurantId

    await Favorite.destroy({ where: { UserId, RestaurantId } })
    return cb({ status: 'success', message: 'restaurant is removed from favorite' })
  },

  // Likes
  addLike: async (req, res, cb) => {
    const UserId = helpers.getUser(req).id
    const RestaurantId = req.params.restaurantId

    await Like.create({ UserId, RestaurantId })
    return cb({ status: 'success', message: 'restaurant is added to likes' })
  },
  removeLike: async (req, res, cb) => {
    const UserId = helpers.getUser(req).id
    const RestaurantId = req.params.restaurantId

    await Like.destroy({ where: { UserId, RestaurantId } })
    return cb({ status: 'success', message: 'restaurant is removed from likes' })
  },

  // Followships
  getTopUser: async (req, res, cb) => {
    let users = await User.findAll({ include: [{ model: User, as: 'Followers' }] })
    users = users.map(user => ({
      ...user.dataValues,
      FollowerCount: user.Followers.length,
      isFollowed: helpers.getUser(req).Followings.map(d => d.id).includes(user.id)
    }))
    users = users.sort((a, b) => b.FollowerCount - a.FollowerCount)
    return cb({ users })
  },
  addFollowing: async (req, res, cb) => {
    const followerId = helpers.getUser(req).id
    const followingId = req.params.userId

    await Followship.create({ followerId, followingId })
    return cb({ status: 'success', message: 'followship is created successfully' })
  },
  removeFollowing: async (req, res, cb) => {
    const followerId = helpers.getUser(req).id
    const followingId = req.params.userId

    await Followship.destroy({ where: { followerId, followingId } })
    return cb({ status: 'success', message: 'followship is removed successfully' })
  }
}
module.exports = userService