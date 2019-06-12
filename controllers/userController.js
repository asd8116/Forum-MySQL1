const bcrypt = require('bcrypt-nodejs')
const db = require('../models')
const User = db.User

const userController = {
  signUpPage: (req, res) => {
    return res.render('signup')
  },

  signUp: (req, res) => {
    if (req.body.passwordCheck !== req.body.password) {
      req.flash('error_messages', '兩次密碼輸入不同！')
      return res.redirect('/signup')
    } else {
      User.findOne({ where: { email: req.body.email } }).then(user => {
        if (user) {
          req.flash('error_messages', '信箱重複！')
          return res.redirect('/signup')
        } else {
          User.create({
            name: req.body.name,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null)
          }).then(user => {
            req.flash('success_messages', '成功註冊帳號！')
            return res.redirect('/signin')
          })
        }
      })
    }
  },

  signInPage: (req, res) => {
    return res.render('signin')
  },

  signIn: (req, res) => {
    req.flash('success_messages', '成功登入！')
    res.redirect('/restaurants')
  },

  logout: (req, res) => {
    req.flash('success_messages', '登出成功！')
    req.logout()
    res.redirect('/signin')
  },

  editUsers: (req, res) => {
    return User.findAll().then(users => {
      return res.render('admin/users', { users: users })
    })
  },

  putUsers: (req, res) => {
    return User.findByPk(req.params.id).then(user => {
      const { isAdmin } = user
      const updatedAdmin = !isAdmin
      const output = updatedAdmin ? 'admin' : 'user'

      user.update({ isAdmin: updatedAdmin }).then(user => {
        req.flash('success_messages', `${output} was successfully to update`)
        res.redirect('/admin/users')
      })
    })
  },

  getUser: (req, res) => {
    return User.findByPk(req.params.id).then(user => {
      return res.render('users/profile', { profile: user })
    })
  },

  editUser: (req, res) => {
    return User.findByPk(req.params.id).then(user => {
      return res.render('users/edit', { user: user })
    })
  },

  putUser: (req, res) => {
    return User.findByPk(req.params.id).then(user => {
      user.update({ name: req.body.name }).then(user => {
        res.redirect(`/users/${req.params.id}`)
      })
    })
  }
}

module.exports = userController
