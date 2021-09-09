const db = require('../models')
const Category = db.Category

const categoryService = {
  // Categories
  // Index
  getCategories: async (req, res, cb) => {
    const id = req.params.id
    const categories = await Category.findAll({
      raw: true,
      nest: true
    })
    if (id) {
      const category = await Category.findByPk(id)
      cb({ categories, category: category.toJSON() })
    }
    cb({ categories })
  },
  postCategories: (req, res, cb) => {
    const { name } = req.body
    if (!name) {
      return cb({ status: 'error', message: 'name is a required field' })
    }
    Category.create({ name })
      .then(() => {
        cb({ status: 'success', message: 'category was created successfully' })
      })
  }
}


module.exports = categoryService

