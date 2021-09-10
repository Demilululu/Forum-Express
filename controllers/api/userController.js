const bcrypt = require('bcryptjs')
const db = require('../../models')
const User = db.User

// JWT
const jwt = require('jsonwebtoken')
const passportJWT = require('passport-jwt')
const ExtractJwt = passportJWT.ExtractJwt
const JwtStrategy = passportJWT.Strategy

let userController = {
  signIn: (req, res) => {
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
  }
}

module.exports = userController