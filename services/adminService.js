const db = require('../models')
const Restaurant = db.Restaurant
const User = db.User
const Category = db.Category
const Comment = db.Comment

const fs = require('fs')
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

const adminService = {
  getRestaurants: async (req, res, cb) => {
    const restaurants = await Restaurant.findAll({ raw: true, nest: true, include: [Category] })
    cb({ restaurants })
  },
  getRestaurant: async (req, res, cb) => {
    let restaurant = await Restaurant.findByPk(req.params.id, {
      include: [Category, { model: Comment, include: [User] }]
    })
    cb({ restaurant: restaurant.toJSON() })
  },
  deleteRestaurant: async (req, res, cb) => {
    const id = req.params.id

    await Restaurant.destroy({ where: { id } })

    cb({status: 'success', message:''})
  },
}


module.exports = adminService