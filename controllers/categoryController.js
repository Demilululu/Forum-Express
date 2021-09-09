const db = require('../models')
const Category = db.Category

const categoryService = require('../services/categoryService')

const categoryController = {
  // Categories
  // Index
  getCategories: async (req, res) => {
    categoryService.getCategories(req, res, data => {
      return res.render('admin/categories', data)
    })

  },
  // Create
  postCategories: (req, res) => {
    categoryService.postCategories(req, res, data => {
      if (data['status'] === 'error') {
        req.flash('error_messages', data.message)
        return res.redirect('back')
      }
    req.flash('success_messages', data.message)
    res.redirect('/admin/categories')
  })
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