const db = require('../models')
const Category = db.Category

const categoryController = {
  getCategories: async (req, res) => {
    const categories = await Category.findAll()
    if (req.params.id) {
      const category = await Category.findByPk(req.params.id)
      res.render('admin/categories', { categories: categories, category: category })
    } else {
      res.render('admin/categories', { categories: categories })
    }
  },

  postCategory: async (req, res) => {
    if (!req.body.name) {
      req.flash('error_messages', "name didn't exist")
      return res.redirect('back')
    } else {
      await Category.create({ name: req.body.name })
      res.redirect('/admin/categories')
    }
  },

  putCategory: async (req, res) => {
    if (!req.body.name) {
      req.flash('error_messages', "name didn't exist")
      return res.redirect('back')
    } else {
      const category = await Category.findByPk(req.params.id)
      await category.update(req.body)
      res.redirect('/admin/categories')
    }
  },

  deleteCategory: async (req, res) => {
    const category = await Category.findByPk(req.params.id)
    await category.destroy()
    res.redirect('/admin/categories')
  }
}

module.exports = categoryController
