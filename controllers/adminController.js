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
  },
  //推文總攬-刪除推文
  deleteTweets: (req, res) => {
    let tweetId = req.params.id;
    Tweet.findByPk(tweetId).then(tweet => {
      tweet.destroy().then(data => {
        req.flash("success_messages", "成功訊息｜你已刪除一筆資料");
        res.redirect("back");
      });
    });
  },
  //用戶總攬
  usersPage: (req, res) => {
    //user 為核心，跟tweet 調推文數| 跟 followship 調 followings followers | 跟 like 調讚數
    User.findAll({
      include: [
        { model: Tweet, as: "userTweets" },
        { model: User, as: "Followings" },
        { model: User, as: "Followers" },
        { model: Tweet, as: "likedTweets" }
      ]
    }).then(users => {
      console.log(users[0]);
      //處理description | 僅顯示50字元
      //map + operator + 修改description屬性
      users = users.map(user => ({
        ...user.dataValues,
        TweetsAcount: user.userTweets.length,
        FollowingsAcount: user.Followings.length,
        FollowersAcount: user.Followers.length,
        LikesAcount: user.likedTweets.length //
      }));
      res.render("admin_users", { users });
    });
  }
};

//匯出
module.exports = adminController;
