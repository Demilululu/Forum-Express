const bcrypt = require('bcryptjs')

const db = require('../models')
const User = db.User

const userController = {
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
  
  signInPage: (req, res) => {
    return res.render('signin')
  },

  signIn: (req, res) => {
    req.flash('success_messages', '成功登入！')
    res.redirect('/restaurants')
  },

  logout: (req, res) => {
    req.flash('success_messages', '登出成功！')
    req.logout()
    res.redirect('/signin')
  }

}
module.exports = userController