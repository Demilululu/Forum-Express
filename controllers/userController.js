const bcrypt = require('bcryptjs')

const db = require('../models')
const User = db.User

const fs = require('fs')
const imgur = require('imgur-node-api')
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
    const userId = req.user.id
    const user = await User.findByPk(id)

    return res.render('profile', { userData: user.toJSON(), userId })
  },
  editUser: async (req, res) => {
    const id = req.params.id
    const userId = req.user.id

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
    let imageUrl = ''

    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID);
      imgur.upload(file.path, (err, img) => {
        imageUrl = img.data.link
      })
    }
    return User.findByPk(id)
      .then((user) => {
        user.update({ name, email, image: file ? imageUrl : user.image })
          .then(() => {
            req.flash('success_messages', 'user was updated successfully')
            res.redirect(`/users/${id}`)
          })
      })

  }

}
module.exports = userController