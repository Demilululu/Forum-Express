const db = require('../models')
const Restaurant = db.Restaurant

const fs = require('fs')
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

const adminController = {
  // Index
  getRestaurants: (req, res) => {
    Restaurant.findAll({ raw: true })
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
    return Restaurant.findByPk(req.params.id, { raw: true })
      .then(restaurant => {
        return res.render('admin/restaurant', { restaurant })
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