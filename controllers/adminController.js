//引入 lib

//引入 model
const db = require("../models");
const User = db.User;
const Tweet = db.Tweet;

//設定controller
const adminController = {
  //推文總攬
  tweetsPage: (req, res) => {
    //總頁數|上頁|下頁|每頁資料 | 初始值
    let offset = 0;
    let limit = 10;
    //設定偏移量
    if (req.query.page) {
      //請求的頁數
      offset = (req.query.page - 1) * limit;
    }
    //開始調用資料 | 指定 偏移量 + limit
    Tweet.findAndCountAll({
      include: [User],
      limit: limit,
      offset: offset
    }).then(tweets => {
      //取得當前頁碼
      let page = Number(req.query.page) || 1;
      //取得總頁碼
      let pages = Math.ceil(tweets.count / limit);
      //製造頁碼陣列
      let totalPage = Array.from({ length: pages }).map(
        (item, index) => index + 1
      );
      //計算前頁|次頁頁碼
      let pre = page - 1 < 1 ? page : page - 1;
      let next = page + 1 > pages ? pages : page + 1;
      tweets = tweets.rows.map(tweet => ({
        ...tweet.dataValues,
        description: tweet.dataValues.description.substring(0, 50)
      }));

      res.render("admin_tweets", { tweets, pre, next, totalPage, page });
    });
  },
  getSearchUser: (req, res) => {
    let userName = req.body.name;
    User.findOne({ where: { name: userName } }).then(user => {
      Tweet.findAll({
        include: [User],
        where: { UserId: user.id }
      }).then(tweets => {
        tweets = tweets.map(tweet => ({
          ...tweet.dataValues,
          description: tweet.dataValues.description.substring(0, 50)
        }));

        res.render("admin_tweets", { tweets });
      });
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
      //處理description | 僅顯示50字元
      //map + operator + 修改description屬性
      let userIndex = 1;
      users = users.map(user => ({
        ...user.dataValues,
        userIndex: userIndex++,
        TweetsAcount: user.userTweets.length,
        FollowingsAcount: user.Followings.length,
        FollowersAcount: user.Followers.length,
        LikesAcount: user.likedTweets.length //
      }));

      //生成user 陣列
      // let userList=Array.from({length:users.length}).map((item,index)=>
      //   index+1
      // )

      users = users.sort((a, b) => b.TweetsAcount - a.TweetsAcount);
      res.render("admin_users", { users });
    });
  }
};

//匯出
module.exports = adminController;
