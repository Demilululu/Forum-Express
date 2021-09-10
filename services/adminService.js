const db = require('../models')
const Restaurant = db.Restaurant
const User = db.User
const Category = db.Category
const Comment = db.Comment

const fs = require('fs')
const imgur = require('imgur-node-api')
const { brotliCompress } = require('zlib')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

const adminService = {
  // users
  // User Index
  getUsers: async (req, res, cb) => {
    const users = await User.findAll({ raw: true, nest: true })
    users.forEach(user => {
      user.role = user.isAdmin ? 'admin' : 'user'
    })
    cb({ users })
  },
  toggleAdmin: async (req, res, cb) => {
    const adminNum = await User.count({ where: { isAdmin: 1 } })

    User.findByPk(req.params.id)
      .then((user) => {
        if (Number(user.isAdmin) === 1 && adminNum === 1) {
          return cb({ status: 'error', message: 'need to have at least one admin' })
        }
        user.isAdmin = (Number(user.isAdmin) === 1) ? 0 : 1
        user.update({ isAdmin: user.isAdmin })
          .then((user) => {
            return cb({ status: 'success', message: `user ${user.name} was updated successfully` })
          })
      })
  },
  // restaurants
  // index
  getRestaurants: async (req, res, cb) => {
    const restaurants = await Restaurant.findAll({ raw: true, nest: true, include: [Category] })
    cb({ restaurants })
  },
  // create
  createRestaurant: async (req, res, cb) => {
    const categories = await Category.findAll({ raw: true, nest: true })
    cb({ categories })
  },
  postRestaurant: (req, res, cb) => {
    const { name, tel, address, opening_hours, description, categoryId } = req.body
    const { file } = req

    if (!name) {
      cb({ status: 'error', message: 'name is a required field' })
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
            cb({ status: 'success', message: 'restaurant was created successfully' })
          })
      })
    } else {
      Restaurant.create({ name, tel, address, opening_hours, description, image: null, CategoryId: categoryId })
        .then(() => {
          cb({ status: 'success', message: 'restaurant was created successfully' })
        })
    }
  },
  // detail
  getRestaurant: async (req, res, cb) => {
    let restaurant = await Restaurant.findByPk(req.params.id, {
      include: [Category, { model: Comment, include: [User] }]
    })
    cb({ restaurant: restaurant.toJSON() })
  },
  // edit
  editRestaurant: async (req, res, cb) => {
    const restaurant = await Restaurant.findByPk(req.params.id, { raw: true })
    const categories = await Category.findAll({ raw: true, nest: true })

    cb({ restaurant, categories })
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
  //delete
  deleteRestaurant: async (req, res, cb) => {
    const id = req.params.id

    await Restaurant.destroy({ where: { id } })

    cb({ status: 'success', message: 'restaurant was removed successfully' })
  }
}


module.exports = adminService