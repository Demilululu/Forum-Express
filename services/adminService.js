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
  postRestaurant: (req, res, cb) => {
    const { name, tel, address, opening_hours, description, categoryId } = req.body
    const { file } = req

    if (!name) {
      cb({ status: 'error', message: 'name is a required field'})
    }
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID);
      imgur.upload(file.path, (err, img) => {
        return Restaurant.create({
          name, tel, address, opening_hours, description,
          image: file ? img.data.link : null,
          CategoryId: categoryId
        })
          .then(() => {
            cb({ status: 'success', message: 'restaurant was created successfully'})
          })
      })
    } else {
      Restaurant.create({ name, tel, address, opening_hours, description, image: null, CategoryId: categoryId })
        .then(() => {
          cb({ status: 'success', message: 'restaurant was created successfully' })
        })
    }
  }, 
  putRestaurant: (req, res, cb) => {
    const { name, tel, address, opening_hours, description, categoryId } = req.body
    const { file } = req

    if (!name) {
      cb({ status: 'error', message: 'name is a required field' })
    }
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID);
      imgur.upload(file.path, (err, img) => {
        return Restaurant.findByPk(req.params.id)
          .then((restaurant) => {
            restaurant.update({
              name, tel, address, opening_hours, description,
              image: file ? img.data.link : restaurant.image,
              CategoryId: categoryId
            })
              .then(() => {
                cb({ status: 'success', message: 'restaurant was updated successfully' })
              })
          })
      })
    } else {
      return Restaurant.findByPk(req.params.id)
        .then((restaurant) => {
          restaurant.update({ name, tel, address, opening_hours, description, image: restaurant.image, CategoryId: categoryId })
            .then(() => {
              cb({ status: 'success', message: 'restaurant was updated successfully' })
            })
        })
    }
  },
  deleteRestaurant: async (req, res, cb) => {
    const id = req.params.id

    await Restaurant.destroy({ where: { id } })

    cb({ status: 'success', message:'restaurant was removed successfully'})
  },
}


module.exports = adminService