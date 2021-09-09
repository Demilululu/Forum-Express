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
  },
  putCategory: async (req, res, cb) => {
    const { name } = req.body
    const id = req.params.id

    if (!name) {
      return cb({ status: 'error', message: 'name is a required field' })
    } else {
      const category = await Category.findByPk(id)
      category.name = name
      await category.save()
    }
    return cb({ status: 'success', message: 'category was updated successfully' })
  },
  deleteCategory: async (req, res, cb) => {
    const id = req.params.id

    await Category.destroy({ where: { id } })
    return cb({ status: 'success', message: 'category was deleted successfully' })
  }
}


module.exports = categoryService

