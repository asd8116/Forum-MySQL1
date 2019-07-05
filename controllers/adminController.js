const fs = require('fs')
const db = require('../models')
const { User, Restaurant, Category } = db
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

const adminController = {
  getRestaurants: async (req, res) => {
    const restaurants = await Restaurant.findAll({ include: [Category] })
    res.render('admin/restaurants', { restaurants: restaurants })
  },

  createRestaurant: async (req, res) => {
    const categories = await Category.findAll()
    res.render('admin/create', { categories: categories })
  },

  postRestaurant: async (req, res) => {
    if (!req.body.name) {
      req.flash('error_messages', "name didn't exist")
      return res.redirect('back')
    }

    const { file } = req
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID)
      imgur.upload(file.path, async (err, img) => {
        await Restaurant.create({
          name: req.body.name,
          tel: req.body.tel,
          address: req.body.address,
          opening_hours: req.body.opening_hours,
          description: req.body.description,
          image: file ? img.data.link : null,
          CategoryId: req.body.categoryId
        })

        req.flash('success_messages', 'restaurant was successfully created')
        res.redirect('/admin/restaurants')
      })
    } else {
      await Restaurant.create({
        name: req.body.name,
        tel: req.body.tel,
        address: req.body.address,
        opening_hours: req.body.opening_hours,
        description: req.body.description,
        image: null,
        CategoryId: req.body.categoryId
      })

      req.flash('success_messages', 'restaurant was successfully created')
      res.redirect('/admin/restaurants')
    }
  },

  getRestaurant: async (req, res) => {
    const restaurant = await Restaurant.findByPk(req.params.id, { include: [Category] })
    res.render('admin/restaurant', { restaurant: restaurant })
  },

  editRestaurant: async (req, res) => {
    const restaurant = await Restaurant.findByPk(req.params.id)
    const categories = await Category.findAll()
    res.render('admin/create', { categories: categories, restaurant: restaurant })
  },

  putRestaurant: async (req, res) => {
    if (!req.body.name) {
      req.flash('error_messages', "name didn't exist")
      return res.redirect('back')
    }

    const { file } = req
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID)
      imgur.upload(file.path, async (err, img) => {
        const restaurantYes = await Restaurant.findByPk(req.params.id)
        await restaurantYes.update({
          name: req.body.name,
          tel: req.body.tel,
          address: req.body.address,
          opening_hours: req.body.opening_hours,
          description: req.body.description,
          image: file ? img.data.link : restaurant.image,
          CategoryId: req.body.categoryId
        })

        req.flash('success_messages', 'restaurant was successfully to update')
        res.redirect('/admin/restaurants')
      })
    } else {
      const restaurantNo = await Restaurant.findByPk(req.params.id)
      await restaurantNo.update({
        name: req.body.name,
        tel: req.body.tel,
        address: req.body.address,
        opening_hours: req.body.opening_hours,
        description: req.body.description,
        image: restaurant.image,
        CategoryId: req.body.categoryId
      })

      req.flash('success_messages', 'restaurant was successfully to update')
      res.redirect('/admin/restaurants')
    }
  },

  deleteRestaurant: async (req, res) => {
    const restaurant = await Restaurant.findByPk(req.params.id)
    await restaurant.destroy()
    res.redirect('/admin/restaurants')
  },

  editUsers: async (req, res) => {
    const users = await User.findAll()
    res.render('admin/users', { users: users })
  },

  putUsers: async (req, res) => {
    const user = await User.findByPk(req.params.id)
    const { isAdmin } = user
    const updatedAdmin = !isAdmin
    const output = updatedAdmin ? 'admin' : 'user'
    await user.update({ isAdmin: updatedAdmin })

    req.flash('success_messages', `${output} was successfully to update`)
    res.redirect('/admin/users')
  }
}

module.exports = adminController
