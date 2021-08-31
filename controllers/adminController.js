const db = require('../models')
const Restaurant = db.Restaurant
const User = db.User
const Category = db.Category

const fs = require('fs')
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

const adminController = {
  // User Index
  getUsers: (req, res) => {
    User.findAll({ raw: true })
      .then(users => {
        users.forEach(user => {
          user.role = user.isAdmin ? 'admin' : 'user'
        });
        return res.render('admin/users', { users })
      })
  },
  toggleAdmin: (req, res) => {
    User.findByPk(req.params.id)
      .then((user) => {
        user.isAdmin = (Number(user.isAdmin) === 1) ? 0 : 1
        user.update({ isAdmin: user.isAdmin })
          .then((user) => {
            req.flash('success_messages', `user ${user.name} was updated successfully`)
            return res.redirect('/admin/users')
          })
      })
  },
  // Restaurant Index
  getRestaurants: (req, res) => {
    Restaurant.findAll({
      raw: true,
      nest: true,
      include: [Category]
    })
      .then(restaurants => {
        return res.render('admin/restaurants', { restaurants })
      })
  },
  // Create
  createRestaurant: (req, res) => {
    return res.render('admin/create')
  },
  postRestaurant: (req, res) => {
    const { name, tel, address, opening_hours, description } = req.body
    const { file } = req

    if (!name) {
      req.flash('error_messages', "name is a required field")
      return res.redirect('back')
    }
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID);
      imgur.upload(file.path, (err, img) => {
        return Restaurant.create({
          name, tel, address, opening_hours, description,
          image: file ? img.data.link : null
        })
          .then((restaurant) => {
            req.flash('success_messages', 'restaurant was created successfully')
            return res.redirect('/admin/restaurants')
          })
      })
    } else {
      Restaurant.create({ name, tel, address, opening_hours, description, image: null })
        .then((restaurant) => {
          req.flash('success_messages', 'restaurant was created successfully')
          res.redirect('/admin/restaurants')
        })
    }
  },
  // Detail
  getRestaurant: (req, res) => {
    return Restaurant.findByPk(req.params.id, { include: [Category] })
      .then(restaurant => {
        return res.render('admin/restaurant', {
          restaurant: restaurant.toJSON()
        })
      })
  },
  // Edit
  editRestaurant: (req, res) => {
    return Restaurant.findByPk(req.params.id, { raw: true })
      .then(restaurant => {
        return res.render('admin/create', { restaurant })
      })
  },
  putRestaurant: (req, res) => {
    const { name, tel, address, opening_hours, description } = req.body
    const { file } = req

    if (!name) {
      req.flash('error_messages', "name didn't exist")
      return res.redirect('back')
    }
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID);
      imgur.upload(file.path, (err, img) => {
        return Restaurant.findByPk(req.params.id)
          .then((restaurant) => {
            restaurant.update({
              name, tel, address, opening_hours, description,
              image: file ? img.data.link : restaurant.image
            })
              .then((restaurant) => {
                req.flash('success_messages', 'restaurant was successfully to update')
                res.redirect('/admin/restaurants')
              })
          })
      })
    } else {
      return Restaurant.findByPk(req.params.id)
        .then((restaurant) => {
          restaurant.update({ name, tel, address, opening_hours, description, image: restaurant.image })
            .then((restaurant) => {
              req.flash('success_messages', 'restaurant was updated successfully ')
              res.redirect('/admin/restaurants')
            })
        })
    }
  },
  // Delete
  deleteRestaurant: (req, res) => {
    return Restaurant.findByPk(req.params.id)
      .then((restaurant) => {
        restaurant.destroy()
          .then((restaurant) => {
            req.flash('success_messages', 'restaurant was removed successfully')
            res.redirect('/admin/restaurants')
          })
      })
  }

}

module.exports = adminController