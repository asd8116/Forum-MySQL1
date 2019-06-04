const db = require('../models')
const Restaurant = db.Restaurant

const adminController = {
  getRestaurants: (req, res) => {
    return Restaurant.findAll().then(restaurants => {
      return res.render('admin/restaurants', { restaurants: restaurants, user: req.user, isAuthenticated: req.isAuthenticated })
    })
  },

  createRestaurant: (req, res) => {
    return res.render('admin/create')
  },

  postRestaurant: (req, res) => {
    if (!req.body.name) {
      req.flash('error_messages', "name didn't exist")
      return res.redirect('back')
    }
    return Restaurant.create({
      name: req.body.name,
      tel: req.body.tel,
      address: req.body.address,
      opening_hours: req.body.opening_hours,
      description: req.body.description
    }).then(restaurant => {
      req.flash('success_messages', 'restaurant was successfully created')
      res.redirect('/admin/restaurants')
    })
  },

  getRestaurant: (req, res) => {
    return Restaurant.findByPk(req.params.id).then(restaurant => {
      return res.render('admin/restaurant', { restaurant: restaurant })
    })
  }
}

module.exports = adminController
