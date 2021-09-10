const db = require('../models')
const Category = db.Category

const categoryService = require('../services/categoryService')

const categoryController = {
  // Categories
  // Index
  getCategories: (req, res) => {
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
      return res.redirect('/admin/categories')
    })
  },
  // Edit
  putCategory: (req, res) => {
    categoryService.putCategory(req, res, data => {
      if (data['status'] === 'error') {
        req.flash('error_messages', data.message)
        return res.redirect('back')
      }
      req.flash('success_messages', data.message)
      return res.redirect('/admin/categories')
    })
  },
  // Delete
  deleteCategory: (req, res) => {
    categoryService.deleteCategory(req, res, data => {
      if (data.status === 'success') {
        req.flash('success_messages', data.message)
        return res.redirect('/admin/categories')
      }
    })
  }
}

module.exports = categoryController