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
    adminService.getUsers(req, res, data => {
      return res.render('admin/users', data)
    })
  },
  toggleAdmin: async (req, res) => {
    adminService.toggleAdmin(req, res, data => {
      if(data.status === 'error') {
        req.flash('error_messages', data.message)
        return res.redirect('/admin/users')
      }
      req.flash('success_messages', data.message)
      return res.redirect('/admin/users')
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
  createRestaurant: (req, res) => {
    adminService.createRestaurant(req, res, data => {
      return res.render('admin/create', data)
    })
  },
  postRestaurant: (req, res) => {
    adminService.postRestaurant(req, res, data => {
      if (data['status'] === 'error') {
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
    adminService.editRestaurant(req, res, data => {
      return res.render('admin/create', data)
    })
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