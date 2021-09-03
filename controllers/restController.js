const db = require('../models')
const Restaurant = db.Restaurant
const Category = db.Category

const pageLimit = 10

const restController = {
  getRestaurants: async (req, res) => {
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
      categoryName: r.Category.name
    }))

    res.render('restaurants', { restaurants, categories, categoryId, page, totalPage, prev, next })
  },

  getRestaurant: async (req, res) => {
    const id = req.params.id
    const restaurant = await Restaurant.findByPk(id, { include: Category })

    return res.render('restaurant', { restaurant: restaurant.toJSON() })
  }
}
module.exports = restController