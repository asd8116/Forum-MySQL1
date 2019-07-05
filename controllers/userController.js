const bcrypt = require('bcrypt-nodejs')
const db = require('../models')
const { User, Comment, Restaurant, Favorite, Like, Followship } = db
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

const userController = {
  signUpPage: (req, res) => {
    return res.render('signup')
  },

  signUp: async (req, res) => {
    if (req.body.passwordCheck !== req.body.password) {
      req.flash('error_messages', '兩次密碼輸入不同！')
      return res.redirect('/signup')
    } else {
      const user = await User.findOne({ where: { email: req.body.email } })
      if (user) {
        req.flash('error_messages', '信箱重複！')
        return res.redirect('/signup')
      } else {
        await User.create({
          name: req.body.name,
          email: req.body.email,
          password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null)
        })

        req.flash('success_messages', '成功註冊帳號！')
        res.redirect('/signin')
      }
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

  getUser: async (req, res) => {
    const user = await User.findByPk(req.params.id, {
      include: [{ model: Comment, include: [Restaurant] }, { model: Restaurant, as: 'FavoritedRestaurants' }, { model: User, as: 'Followings' }, { model: User, as: 'Followers' }]
    })
    const isFollowed = req.user.Followings.map(d => d.id).includes(user.id)

    let map = user.Comments.reduce((map, { Restaurant }) => {
      if (Restaurant && !map.has(Restaurant.id)) {
        map.set(Restaurant.id, Restaurant)
      }
      return map
    }, new Map())

    res.render('users/profile', { profile: user, isFollowed: isFollowed, restaurantArray: [...map.values()] })
  },

  editUser: async (req, res) => {
    const user = await User.findByPk(req.params.id)
    res.render('users/edit', { user: user })
  },

  putUser: async (req, res) => {
    if (Number(req.params.id) !== req.user.id) {
      return res.redirect(`/users/${req.user.id}`)
    }

    const { file } = req
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID)
      imgur.upload(file.path, async (err, img) => {
        const userYes = await User.findByPk(req.params.id)
        await userYes.update({ name: req.body.name, image: file ? img.data.link : user.image })

        res.redirect(`/users/${req.params.id}`)
      })
    } else {
      const userNO = await User.findByPk(req.params.id)
      await userNO.update({ name: req.body.name })

      res.redirect(`/users/${req.params.id}`)
    }
  },

  addFavorite: async (req, res) => {
    await Favorite.create({ UserId: req.user.id, RestaurantId: req.params.restaurantId })
    res.redirect('back')
  },

  removeFavorite: async (req, res) => {
    const favorite = await Favorite.findOne({ where: { UserId: req.user.id, RestaurantId: req.params.restaurantId } })
    await favorite.destroy()
    res.redirect('back')
  },

  addLike: async (req, res) => {
    await Like.create({ UserId: req.user.id, RestaurantId: req.params.restaurantId })
    res.redirect('back')
  },

  removeLike: async (req, res) => {
    const like = await Like.findOne({ where: { UserId: req.user.id, RestaurantId: req.params.restaurantId } })
    await like.destroy()
    res.redirect('back')
  },

  getTopUser: async (req, res) => {
    const users = await User.findAll({ include: [{ model: User, as: 'Followers' }] })
    let usersData = users.map(user => ({
      ...user.dataValues,
      // 計算追蹤者人數
      followerCount: user.Followers.length,
      // 判斷目前登入使用者是否已追蹤該 User 物件
      isFollowed: req.user.Followings.map(d => d.id).includes(user.id)
    }))

    usersData = usersData.sort((a, b) => b.followerCount - a.followerCount)
    res.render('topUser', { users: usersData })
  },

  addFollowing: async (req, res) => {
    await Followship.create({ followerId: req.user.id, followingId: req.params.userId })
    res.redirect('back')
  },

  removeFollowing: async (req, res) => {
    const followship = await Followship.findOne({ where: { followerId: req.user.id, followingId: req.params.userId } })
    await followship.destroy()
    res.redirect('back')
  }
}

module.exports = userController
