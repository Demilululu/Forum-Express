const db = require('../models')
const Category = db.Category

const categoryController = {
  // Categories
  // Index
  getCategories: async (req, res) => {
    const id = req.params.id
    const categories = await Category.findAll({
      raw: true,
      nest: true
    })
    if (id) {
      const category = await Category.findByPk(id)
      return res.render('admin/categories', { categories, category: category.toJSON() })
    }
    return res.render('admin/categories', { categories })
  },
  // Create
  postCategories: (req, res) => {
    const { name } = req.body
    if (!name) {
      req.flash('error_message', 'name didn\'t exist')
      return res.redirect('back')
    }

    return Category.create({ name })
      .then(() => res.redirect('/admin/categories'))
  },
  // Edit
  putCategory: async (req, res) => {
    const { name } = req.body
    const id = req.params.id

    if (!name) {
      req.flash('error_message', 'name didn\'t exist')
      return res.redirect('back')
    } else {
      const category = await Category.findByPk(id)
      category.name = name
      await category.save()
    }
    return res.redirect('/admin/categories')
  },
  // Delete
  deleteCategory: async (req, res) => {
    const id = req.params.id

    await Category.destroy({ where: { id } })
    return res.redirect('/admin/categories')
  }
}

module.exports = categoryController