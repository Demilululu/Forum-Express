const db = require('../models')
const Restaurant = db.Restaurant
const Category = db.Category
const User = db.User
const Comment = db.Comment

const helpers = require('../_helpers')
const pageLimit = 10

const restService = {
  getRestaurants: async (req, res, cb) => {
    let whereQuery = {}
    let categoryId = Number(req.query.categoryId)
    let page = Number(req.query.page) || 1
    let offset = (page - 1) * pageLimit

    if (categoryId) {
      whereQuery['CategoryId'] = categoryId
    }

    const restaurantsData = await Restaurant.findAndCountAll({
      include: Category,
      where: whereQuery,
      offset, limit: pageLimit
    })
    const pages = Math.ceil(restaurantsData.count / pageLimit)
    const totalPage = Array.from({ length: pages }).map((item, index) => index + 1)
    const prev = page - 1 < 1 ? 1 : page - 1
    const next = page + 1 > pages ? pages : page + 1

    const categories = await Category.findAll({ raw: true, nest: true })
    const restaurants = restaurantsData.rows.map(r => ({
      ...r.dataValues,
      description: r.dataValues.description.substring(0, 50),
      categoryName: r.Category.name,
      isFavorited: helpers.getUser(req).FavoritedRestaurants.map(d => d.id).includes(r.id),
      isLiked: helpers.getUser(req).LikedRestaurants.map(d => d.id).includes(r.id)
    }))

    return cb({restaurants, categories, categoryId, page, totalPage, prev, next})
  },

  getRestaurant: async (req, res, cb) => {
    const id = req.params.id
    const userId = helpers.getUser(req).id
    const restaurant = await Restaurant.findByPk(id, {
      include: [Category,
        { model: User, as: 'FavoritedUsers' },
        { model: User, as: 'LikedUsers' },
        { model: Comment, include: [User] }]
    })

    const isFavorited = restaurant.FavoritedUsers.map(d => d.id).includes(userId)
    const isLiked = restaurant.LikedUsers.map(d => d.id).includes(userId)

    await restaurant.increment(['viewCounts'])
    return cb({ restaurant: restaurant.toJSON(), isFavorited, isLiked })
  },

  getFeeds: async (req, res, cb) => {
    const restaurants = await Restaurant.findAll({ raw: true, nest: true, include: [Category], limit: 10, order: [['createdAt', 'DESC']] })
    const comments = await Comment.findAll({ raw: true, nest: true, include: [User, Restaurant], limit: 10, order: [['createdAt', 'DESC']] })

    return cb({ restaurants, comments })
  },

  getDashBoard: async (req, res, cb) => {
    const id = req.params.id
    const restaurant = await Restaurant.findByPk(id, { include: [Category] })
    const n_comments = await Comment.count({ where: { RestaurantId: id } })

    return cb({ restaurant: restaurant.toJSON(), n_comments })
  },
  // Top
  getTopRestaurant: async (req, res, cb) => {
    let restaurants = await Restaurant.findAll({ include: [{ model: User, as: 'FavoritedUsers' }] })
    restaurants = restaurants.map(r => ({
      ...r.dataValues,
      description: r.dataValues.description ? r.dataValues.description.substring(0, 50): 'No description provided',
      FavoritedCount: r.FavoritedUsers.length,
      isFavorited: helpers.getUser(req).FavoritedRestaurants.map(d => d.id).includes(r.id)
    }))
    restaurants.sort((a, b) => b.FavoritedCount - a.FavoritedCount)
    restaurants = restaurants.slice(0, 10)
    
    return cb({ restaurants })
  }
}
module.exports = restService