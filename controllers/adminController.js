//引入 lib

//引入 model
const db = require("../models");
const User = db.User;
const Tweet = db.Tweet;

//設定controller
const adminController = {
  //推文總攬
  tweetsPage: (req, res) => {
    Tweet.findAll({ include: [User] }).then(tweets => {
      console.log(tweets[0]);
      tweets = tweets.map(tweet => ({
        ...tweet.dataValues,
        description: tweet.dataValues.description.substring(0, 50)
      }));
      res.render("admin_tweets", { tweets });
    });
    // User.findAll({ include: [Tweet] }).then(users => {
    //   //處理description | 僅顯示50字元
    //   //map + operator +修改description屬性
    //   users = users.map(user => ({
    //     ...user.dataValues,
    //     description: user.Tweets.description.substring(0, 50)
    //   }));
    //   res.render("admin_tweets", { users });
    // });
  },
  //推文總攬-刪除推文
  deleteTweets: (req, res) => {
    res.send("你已經刪除推文");
  },
  //用戶總攬
  usersPage: (req, res) => {
    res.render("admin_users");
  }
};

//匯出
module.exports = adminController;
