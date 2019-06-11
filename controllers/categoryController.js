const db = require('../models')
const Category = db.Category

const categoryController = {
  getCategories: (req, res) => {
    return Category.findAll().then(categories => {
      return res.render('admin/categories', { categories: categories })
    })
  }
}
module.exports = categoryController
