const express = require('express')
const exphbs = require('express-handlebars')
const session = require('express-session')
const methodOverride = require('method-override')
const flash = require('connect-flash')
const helpers = require('./_helpers');

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const db = require('./models')
const app = express()
const port = process.env.PORT || 3000

const passport = require('./config/passport')

app.engine('hbs', exphbs({ 
  defaultLayout: 'main', 
  extname: '.hbs',
  helpers: require('./config/handlebars-helpers')
 }))
app.set('view engine', 'hbs')
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(methodOverride('_method'))
app.use(express.static('public'))
app.use('/upload', express.static(__dirname + '/upload'))
app.use(session({ secret: 'secret', resave: false, saveUninitialized: true }))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())

app.use((req, res, next) => {
  res.locals.user = helpers.getUser(req)
  res.locals.success_messages = req.flash('success_messages')
  res.locals.error_messages = req.flash('error_messages')
  next()
})

app.listen(port, () => {
  db.sequelize.sync()
  console.log(`Example app listening at http://localhost:${port}`)
})

require('./routes')(app)

module.exports = app
