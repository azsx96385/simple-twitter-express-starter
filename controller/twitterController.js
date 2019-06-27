//引用資料庫
const db = require('../models')
const Tweet = db.Tweet
const User = db.User
const helpers = require('../_helpers');

const twitterController = {
  getTwitters: (req, res) => {
    //看到所有的推文
    Tweet.findAll({ include: User }).then(tweets => {
      return res.render('tweets', { tweets: tweets })

    })
    //TOP10 Followings users


  },
  //create 新貼文
  postTwitters: (req, res) => {
    //推文字數不能超過140 或 空白
    if (req.body.content === '' || req.body.content.length > 5) {
      return res.redirect('/tweets')

    }
    else {
      Tweet.create({
        description: req.body.content,
        UserId: helpers.getUser(req)
      })
    }
    return res.render('tweets')
  }
}
module.exports = twitterController 