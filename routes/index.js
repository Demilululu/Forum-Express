const restController = require('../controllers/restController.js')
const adminController = require('../controllers/adminController.js') 
const userController = require('../controllers/userController')

module.exports = app => {
  // Users
  app.get('/', (req, res) => res.redirect('/restaurants'))
  app.get('/restaurants', restController.getRestaurants)

  // Admin
  app.get('/admin', (req, res) => res.redirect('/admin/restaurants'))
  app.get('/admin/restaurants', adminController.getRestaurants)

  // Signup
  app.get('/signup', userController.signUpPage)
  app.post('/signup', userController.signUp)

  // Signin
  app.get('/signin', userController.signInPage)
}