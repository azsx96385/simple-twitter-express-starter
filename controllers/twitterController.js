//引用資料庫
const db = require("../models");
const Tweet = db.Tweet;
const User = db.User;
const Reply = db.Reply;

const helpers = require("../_helpers");

const twitterController = {
  getTwitters: (req, res) => {
    //看到所有的推文
    Tweet.findAll({
      include: [User, Reply, { model: User, as: "LikedUsers" }]
    }).then(tweets => {
      //重製tweets資料，加上isLiked
      tweets = tweets.map(tweet => ({
        ...tweet.dataValues,
        //紀錄是否被like
        isLiked: tweet.LikedUsers.map(d => d.id).includes(req.user.id)
      }));
      console.log(tweets);

      //TOP10 Followings users
      return User.findAll({ include: [{ model: User, as: "Followers" }] }).then(
        users => {
          //重設定users集合，賦予followerCount與isFollowed
          users = users.map(user => ({
            ...user.dataValues,
            FolloweCount: user.Followers.length,
            isFollowed: user.Followers.map(d => d.id).includes(req.user.id)
          }));
          //依followerCount sort users
          users = users.sort((a, b) => b.FolloweCount - a.FolloweCount);
          //取前十名
          users = users.slice(0, 10);
          return res.render("tweets", { tweets: tweets, users: users });
        }
      );
    });
  },
  //create 新貼文
  postTwitters: (req, res) => {
    //推文字數不能超過140 或 空白
    if (req.body.content === "") {
      req.flash("error_messages", "推文不能為空白！");
      return res.redirect("back");
    }

    if (req.body.content.length > 140) {
      req.flash("error_messages", "你的推文不能超過140個字!!");
      return res.redirect("back");
    } else {
      return Tweet.create({
        description: req.body.content,
        UserId: helpers.getUser(req).id
      }).then(tweets => {
        return res.redirect("/tweets");
      });
    }
  },
  //reply頁面
  replyPage: (req, res) => {
    return Tweet.findByPk(req.params.tweet_id, {
      include: [
        {
          model: Reply,
          include: [User, Tweet]
        },
        {
          model: User,
          include: [
            { model: Tweet, as: "UserTweets" },
            { model: User, as: "Followings" },
            { model: User, as: "Followers" },
            { model: Tweet, as: "LikedTweets" }
          ]
        },
        { model: User, as: "LikedUsers" }
      ]
    }).then(tweet => {
      //重構replies 以時間新舊排序
      let tweetReplies = tweet.Replies.sort(
        (a, b) => b.FolloweCount - a.FolloweCount
      );
      //取出tweet的user
      const tweetUser = tweet.User;
      //判斷撰寫tweet的user是否已追蹤
      let isFollowed = tweetUser.id === req.user.id;
      return res.render("tweetReply", {
        tweetUser,
        tweetReplies,
        isFollowed,
        tweet
      });
    });
  },
  reply: (req, res) => {
    //回文不能為空白
    if (req.body.comment === "") {
      req.flash("error_messages", "你還沒輸入你的回覆！");
      return res.redirect("back");
    }

    return Reply.create({
      TweetId: req.params.tweet_id,
      UserId: req.user.id,
      comment: req.body.comment
    }).then(reply => {
      res.redirect("back");
    });
  }
};
module.exports = twitterController;
