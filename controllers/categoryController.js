const db = require('../models')
const Restaurant = db.Restaurant
const User = db.User
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
  putCategory: (req, res) => {
    const { name } = req.body
    const id = req.params.id

    if (!name) {
      req.flash('error_message', 'name didn\'t exist')
      return res.redirect('back')
    }
    return Category.findByPk(id)
      .then((category) => {
        category.update({ name })
          .then(() => res.redirect('/admin/categories'))
      })
  },
  // Delete
  deleteCategory: (req, res) => {
    const id = req.params.id
    return Category.findByPk(id)
      .then((category) => {
        category.destroy()
          .then(() => res.redirect('/admin/categories'))
      })
  }

}

module.exports = categoryController