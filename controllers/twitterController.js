//引用資料庫
const db = require('../models')
const Tweet = db.Tweet
const User = db.User
const hplers = require('../_helpers')


const twitterController = {
  getTwitters: (req, res) => {
    //看到所有的推文
    Tweet.findAll({ include: User }).then(tweets => {
      //TOP10 Followings users
      return User.findAll({ include: [{ model: User, as: "Followers" }] }).then(users => {
        //重設定users集合，賦予followerCount 跟 isFollowed
        users = users.map(user => ({
          ...user.dataValues,
          FolloweCount: user.Followers.length,

        }))
        //依followerCount sort users
        users = users.sort((a, b) => b.FolloweCount - a.FolloweCount)
        //取前十名
        users = users.slice(0, 10)
        return res.render('tweets', { tweets: tweets, users: users })
      }
      )
    })
  },
  //create 新貼文
  postTwitters: (req, res) => {
    //推文字數不能超過140 或 空白
    if (req.body.content === '' || req.body.content.length > 5) {
      console.log(helpers.getUser(req))
      return res.redirect('/tweets')
    }
    else {
      Tweet.create({
        description: req.body.content,
        UserId: helpers.getUser(req)

      })

      return res.render('tweets')
    }


  }
}
module.exports = twitterController

