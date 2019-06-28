const db = require('../models')
const Tweet = db.Tweet
const User = db.User

const userController = {
  //profile
  getUserTweets: (req, res) => {
    return User.findByPk(req.params.id, {
      include: [
        Tweet,
        { model: User, as: 'Followings' },
        { model: User, as: 'Followers' },


      ]
    }).then(user => {
      let userTweets = user.Tweets.sort((a, b) => b.createAt - a.createAt)
      console.log(user)
      return res.render('userWall', { user: user, userTweets: userTweets })

    })

  },
  getUserFollowings: (req, res) => {


  },
  getUserFollowers: (req, res) => {


  },
  getUserlikes: (req, res) => {


  },

}
module.exports = userController