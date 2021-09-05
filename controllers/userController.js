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

const userController = {
  // Sing Up
  signUpPage: (req, res) => {
    return res.render('signup')

  },
  signUp: (req, res) => {
    const { name, email, passwordCheck } = req.body
    const password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null)

    if (passwordCheck !== req.body.password) {
      req.flash('error_messages', '兩次密碼輸入不同！')
      return res.redirect('/signup')
    }

    User.findOne({ where: { email } })
      .then(user => {
        if (user) {
          req.flash('error_messages', '這個Email已經註冊過了。')
          return res.redirect('/signup')
        } else {
          User.create({ name, email, password })
            .then(user => res.redirect('/signin'))
            .catch(err => console.log(err))
        }
      })
  },
  // Sign In
  signInPage: (req, res) => {
    return res.render('signin')
  },

  signIn: (req, res) => {
    req.flash('success_messages', '成功登入！')
    res.redirect('/restaurants')
  },

  // Logout
  logout: (req, res) => {
    req.flash('success_messages', '登出成功！')
    req.logout()
    res.redirect('/signin')
  },

  // Profile
  getUser: async (req, res) => {
    const id = req.params.id
    const userId = helpers.getUser(req).id
    const user = await User.findByPk(id)
    const commentData = await Comment.findAndCountAll({
      where: { UserId: id }, raw: true, nest: true, attributes: ['RestaurantId'],
      include: { model: Restaurant, attributes: ['id', 'image'] }
    })

    return res.render('profile', {
      userData: user.toJSON(), userId,
      comment: commentData.rows, n_comments: commentData.count
    })
  },
  editUser: async (req, res) => {
    const id = req.params.id
    const userId = helpers.getUser(req).id

    if (Number(id) !== Number(userId)) {
      req.flash('error_messages', '只能編輯自己的profile。')
      return res.redirect(`/users/${userId}`)
    }

    const user = await User.findByPk(id)
    return res.render('edit', { user: user.toJSON() })
  },
  putUser: (req, res) => {
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
                req.flash('success_messages', 'user was updated successfully')
                res.redirect(`/users/${id}`)
              })
          })
      })
    } else {
      return User.findByPk(id)
        .then((user) => {
          user.update({ name, email, image: user.image })
            .then(() => {
              req.flash('success_messages', 'user was updated successfully')
              res.redirect(`/users/${id}`)
            })
        })
    }
  },
  // Favorites
  addFavorite: async (req, res) => {
    const UserId = helpers.getUser(req).id
    const RestaurantId = req.params.restaurantId

    await Favorite.create({ UserId, RestaurantId })
    return res.redirect('back')
  },
  removeFavorite: async (req, res) => {
    const UserId = helpers.getUser(req).id
    const RestaurantId = req.params.restaurantId

    await Favorite.destroy({ where: { UserId, RestaurantId } })
    return res.redirect('back')
  },
  // Likes
  addLike: async (req, res) => {
    const UserId = helpers.getUser(req).id
    const RestaurantId = req.params.restaurantId

    await Like.create({ UserId, RestaurantId })
    return res.redirect('back')
  },
  removeLike: async (req, res) => {
    const UserId = helpers.getUser(req).id
    const RestaurantId = req.params.restaurantId

    await Like.destroy({ where: { UserId, RestaurantId } })
    return res.redirect('back')
  },
  // Followships
  getTopUser: async (req, res) => {
    let users = await User.findAll({ include: [{ model: User, as: 'Followers' }] })
    users = users.map(user => ({
      ...user.dataValues,
      FollowerCount: user.Followers.length,
      isFollowed: helpers.getUser(req).Followings.map(d => d.id).includes(user.id)
    }))
    users = users.sort((a, b) => b.FollowerCount - a.FollowerCount)
    return res.render('topUser', { users })
  },
  addFollowing: async (req, res) => {
    const followerId = helpers.getUser(req).id
    const followingId = req.params.userId

    await Followship.create({ followerId, followingId })
    return res.redirect('back')
  },
  removeFollowing: async (req, res) => {
    const followerId = helpers.getUser(req).id
    const followingId = req.params.userId

    await Followship.destroy({ where: { followerId, followingId } })
    return res.redirect('back')
  }
}
module.exports = userController