const db = require('../models')
const Restaurant = db.Restaurant
const User = db.User
const Category = db.Category
const Comment = db.Comment

const fs = require('fs')
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

const adminService = require('../services/adminService')

const adminController = {
  // User Index
  getUsers: async (req, res) => {
    const users = await User.findAll({ raw: true, nest: true })

    users.forEach(user => {
      user.role = user.isAdmin ? 'admin' : 'user'
    })
    return res.render('admin/users', { users })

  },
  toggleAdmin: async (req, res) => {
    const adminNum = await User.count({ where: { isAdmin: 1 } })

    User.findByPk(req.params.id)
      .then((user) => {
        if (Number(user.isAdmin) === 1 && adminNum === 1) {
          req.flash('error_messages', "need to have at least one admin")
          return res.redirect('/admin/users')
        }
        user.isAdmin = (Number(user.isAdmin) === 1) ? 0 : 1
        user.update({ isAdmin: user.isAdmin })
          .then((user) => {
            req.flash('success_messages', `user ${user.name} was updated successfully`)
            return res.redirect('/admin/users')
          })
      })
  },

  // Restaurants
  // Index
  getRestaurants: (req, res) => {
    adminService.getRestaurants(req, res, (data) => {
      return res.render('admin/restaurants', data)
    })

  },
  // Create
  createRestaurant: async (req, res) => {
    const categories = await Category.findAll({ raw: true, nest: true })

    return res.render('admin/create', { categories })
  },
  postRestaurant: (req, res) => {
    adminService.postRestaurant(req, res, data => {
      if (data.status === 'error') {
        req.flash('error_messages', data.message)
        return res.redirect('back')
      }
      req.flash('success_messages', data.message)
      res.redirect('/admin/restaurants')
    })

  },
  // Detail
  getRestaurant: async (req, res) => {
    adminService.getRestaurant(req, res, data => {
      return res.render('admin/restaurant', data)
    })
  },
  // Edit
  editRestaurant: async (req, res) => {
    const restaurant = await Restaurant.findByPk(req.params.id, { raw: true })
    const categories = await Category.findAll({ raw: true, nest: true })

    return res.render('admin/create', { restaurant, categories })
  },
  putRestaurant: (req, res) => {
    adminService.putRestaurant(req, res, data => {
      if (data.status === 'error') {
        req.flash('error_messages', data.message)
        return res.redirect('back')
      }
      req.flash('success_messages', data.message)
      res.redirect('/admin/restaurants')
    })
  },
  // Delete
  deleteRestaurant: (req, res) => {
    adminService.deleteRestaurant(req, res, data => {
      if (data.status === 'success') {
        return res.redirect('/admin/restaurants')
      }
    })
  },
}

module.exports = adminController