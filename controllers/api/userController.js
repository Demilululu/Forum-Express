const bcrypt = require('bcryptjs')
const db = require('../../models')
const User = db.User

// JWT
const jwt = require('jsonwebtoken')
const passportJWT = require('passport-jwt')
const ExtractJwt = passportJWT.ExtractJwt
const JwtStrategy = passportJWT.Strategy

const userService = require('../../services/userService')
const user = require('../../models/user')

let userController = {
  signUp: (req, res) => {
    const { name, email, passwordCheck } = req.body
    const password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null)

    if (passwordCheck !== req.body.password) {
      return res.json({ status: 'error', message: "password and confirm password not matched" })
    }

    User.findOne({ where: { email } })
      .then(user => {
        if (user) {
          return res.json({ status: 'error', message: "This email has already registered" })
        } else {
          User.create({ name, email, password })
            .then(() => {
              return res.json({ status: 'success', message: "New account created successfully" })
            })
        }
      })
  }
  , signIn: (req, res) => {
    // 檢查必要資料
    const { email, password } = req.body

    if (!email || !password) {
      return res.json({ status: 'error', message: "required fields didn't exist" })
    }

    User.findOne({ where: { email } })
      .then(user => {
        if (!user) return res.status(401).json({ status: 'error', message: 'no such user found' })
        if (!bcrypt.compareSync(password, user.password)) {
          return res.status(401).json({ status: 'error', message: 'passwords did not match' })
        }

        const { id, name, email, isAdmin } = user
        // 簽發 token
        var payload = { id }
        var token = jwt.sign(payload, process.env.JWT_SECRET)
        return res.json({
          status: 'success',
          message: 'ok',
          token: token,
          user: { id, name, email, isAdmin }
        })
      })
  },
  // profile
  getUser: (req, res) => {
    userService.getUser(req, res, data => {
      return res.json(data)
    })
  },
  editUser: (req, res) => {
    userService.editUser(req, res, data => {
      return res.json(data)
    })
  },
  putUser: (req, res) => {
    userService.putUser(req, res, data => {
      return res.json(data)
    })
  },
  addFavorite: (req, res) => {
    userService.addFavorite(req, res, data => {
      return res.json(data)
    })
  },
  removeFavorite: (req, res) => {
    userService.removeFavorite(req, res, data => {
      return res.json(data)
    })
  },
  addLike: (req, res) => {
    userService.addLike(req, res, data => {
      return res.json(data)
    })
  },
  removeLike: (req, res) => {
    userService.removeLike(req, res, data => {
      return res.json(data)
    })
  },
  getTopUser: (req, res) => {
    userService.getTopUser(req, res, data => {
      return res.json(data)
    })

  },
  addFollowing: (req, res) => {
    userService.addFollowing(req, res, data => {
      return res.json(data)
    })
  },
  removeFollowing: (req, res) => {
    userService.removeFollowing(req, res, data => {
      return res.json(data)
    })
  }

}

module.exports = userController