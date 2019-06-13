const db = require('../models')
const Comment = db.Comment

const commentController = {
  postComment: (req, res) => {
    return Comment.create({
      text: req.body.text,
      RestaurantId: req.body.restaurantId,
      UserId: req.user.id
    })
      .then(restaurant => {
        res.redirect(`/restaurants/${req.body.restaurantId}`)
      })
      .catch(err => {
        console.log(err)
        return res.status(422).json(err)
      })
  },

  deleteComment: (req, res) => {
    return Comment.findByPk(req.params.id).then(comment => {
      comment.destroy().then(() => {
        res.redirect(`/restaurants/${comment.RestaurantId}`)
      })
    })
  }
}

module.exports = commentController
