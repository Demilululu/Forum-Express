const db = require('../models')
const Restaurant = db.Restaurant
const Category = db.Category


const restController = {
  getRestaurants: async (req, res) => {
    let whereQuery = {}
    let categoryId = Number(req.query.categoryId)

    if (categoryId) {
      whereQuery['CategoryId'] = categoryId
    }

    const restaurantsData = await Restaurant.findAll({ include: Category, where: whereQuery })
    const categories = await Category.findAll({ raw: true, nest: true })
    const restaurants = restaurantsData.map(r => ({
      ...r.dataValues,
      description: r.dataValues.description.substring(0, 50),
      categoryName: r.Category.name
    }))
    res.render('restaurants', { restaurants, categories, categoryId })
  },

  getRestaurant: async (req, res) => {
    const id = req.params.id
    const restaurant = await Restaurant.findByPk(id, { include: Category })

    return res.render('restaurant', { restaurant: restaurant.toJSON() })
  }
}
module.exports = restController