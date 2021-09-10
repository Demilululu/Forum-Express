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

const userService = require('../services/userService')

const userController = {
  // Sign Up
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
  getUser: (req, res) => {
    userService.getUser(req, res, data => {
      return res.render('profile', data)
    })
  },
  editUser: (req, res) => {
    userService.editUser(req, res, data => {
      if (data.status === 'error') {
        req.flash('error_messages', data.message)
        return res.redirect(`/users/${data.userId}`)
      }
      return res.render('edit', data)
    })
  },
  putUser: (req, res) => {
    userService.putUser(req, res, data => {
      req.flash('success_messages', data.message)
      return res.redirect(`/users/${data.id}`)
    })
  },
  // Favorites
  addFavorite: (req, res) => {
    userService.addFavorite(req, res, data => {
      if (data.status === 'success') {
        return res.redirect('back')
      }
    })
  },
  removeFavorite: (req, res) => {
    userService.removeFavorite(req, res, data => {
      if (data.status === 'success') {
        return res.redirect('back')
      }
    })
  },
  // Likes
  addLike: (req, res) => {
    userService.addLike(req, res, data => {
      if (data.status === 'success') {
        return res.redirect('back')
      }
    })
  },
  removeLike: (req, res) => {
    userService.removeLike(req, res, data => {
      if (data.status === 'success') {
        return res.redirect('back')
      }
    })
  },
  // Followships
  getTopUser: (req, res) => {
    userService.getTopUser(req, res, data => {
      return res.render('topUser', data)
    })

  },
  addFollowing: (req, res) => {
    userService.addFollowing(req, res, data => {
      if (data.status === 'success') {
        return res.redirect('back')
      }
    })
  },
  removeFollowing: (req, res) => {
    userService.removeFollowing(req, res, data => {
      if (data.status === 'success') {
        return res.redirect('back')
      }
    })
  }
}
module.exports = userController