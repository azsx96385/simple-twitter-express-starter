//引入套件區
const bcrypt = require("bcrypt-nodejs");
//引入model
const db = require("../models");
const helpers = require("../_helpers");
const User = db.User;

const Tweet = db.Tweet;
const Reply = db.Reply;
const Follow = db.Followship;
const Like = db.Like;
const imgur = require("imgur-node-api");
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID;

//controller 設定區
const userController = {
  //[使用者 登入 | 登出 | 註冊]
  signUpPage: (req, res) => {
    return res.render("user_signIn");
  },
  signUp: (req, res) => {
    let { name, email, password, password_confirm } = req.body;

    //驗證資料缺漏
    if (!email || !name || !password || !password_confirm) {
      console.log("錯誤訊息|資料漏填");
      req.flash("error_messages", "錯誤訊息|資料漏填");
      return res.redirect("back");
    }
    User.findOne({ where: { email: email } }).then(user => {
      if (user) {
        req.flash("error_messages", "錯誤訊息|帳號已被使用");
        return res.redirect("back");
      } else {
        if (password == password_confirm) {
          //通過-寫入資料庫
          password = bcrypt.hashSync(
            req.body.password,
            bcrypt.genSaltSync(10),
            null
          );
          User.create({ email, name, password }).then(user => {
            return res.redirect("/users/logIn");
          });
        } else {
          //驗證失敗
          console.log("錯誤訊息|密碼輸入不相同");
          req.flash("error_messages", "錯誤訊息|密碼輸入不相同");
          return res.redirect("back");
        }
      }
    });
    //驗證密碼相同
  },
  logInPage: (req, res) => {
    return res.render("user_login");
  },
  logIn: (req, res) => {
    //使用 passport 做驗證
    req.flash("success_messages", "成功訊息|你已經成功登入");
    res.redirect("/tweets");
  },
  logOut: (req, res) => {
    req.flash("success_messages", "成功訊息|你已經成功登出");
    req.logout();
    res.redirect("/users/logIn");
  },
  //profile
  getUserTweets: (req, res) => {
    return User.findByPk(req.params.id, {
      include: [
        {
          model: Tweet,
          as: "UserTweets",
          include: [
            Reply, //for 使用者的Tweets的relPy數
            { model: User, as: "LikedUsers" }
          ] //for 使用者的Tweets的like數
        },
        { model: User, as: "Followings" },
        { model: User, as: "Followers" },
        { model: Tweet, as: "LikedTweets" }
      ]
    }).then(user => {
      //判斷該user是否follow
      user.isFollowed = user.Followers.map(d => d.id).includes(
        helpers.getUser(req).id
      );

      //重構tweets資料，加入isLiked
      let userTweets = user.UserTweets.map(tweet => ({
        ...tweet.dataValues,
        user_id: user.id,
        user_avatar: user.avatar,
        user_name: user.name,
        //紀錄是否like
        isLiked: tweet.LikedUsers.map(d => d.id).includes(
          helpers.getUser(req).id
        )
      }));
      //依時間前後排序
      userTweets = userTweets.sort((a, b) => b.createAt - a.createAt);

      return res.render("userWall", { user: user, userTweets: userTweets });
    });
  },
  getUserFollowings: (req, res) => {
    return User.findByPk(req.params.id, {
      include: [
        { model: Tweet, as: "UserTweets" },
        {
          model: User,
          as: "Followings",
          include: [{ model: User, as: "Followers" }] //找尋追蹤的user ,在找尋期的追蹤者
        },
        { model: User, as: "Followers" },
        { model: Tweet, as: "LikedTweets" }
      ]
    }).then(user => {
      //判斷其是否已follow
      user.isFollowed = user.Followers.map(d => d.id).includes(
        helpers.getUser(req).id
      );
      let userFollowings = user.Followings; //取得追蹤中的users
      //console.log("------------------------------", userFollowings);
      userFollowings = userFollowings.map(followingUser => ({
        ...followingUser.dataValues,
        user_id: followingUser.id,
        user_avatar: followingUser.avatar,
        user_name: followingUser.name,
        user_introduction: followingUser.introduction, //.substring(0, 50)
        //紀錄是否追蹤過
        isFollowed: followingUser.Followers.map(d => d.id).includes(
          helpers.getUser(req).id
        )
      }));
      //依時間前後排序
      userFollowings = userFollowings.sort((a, b) => b.createAt - a.createAt);

      return res.render("userFollowing", {
        user: user,
        userFollowings: userFollowings
      });
    });
  },
  getUserFollowers: (req, res) => {
    return User.findByPk(req.params.id, {
      include: [
        { model: Tweet, as: "UserTweets" },
        { model: User, as: "Followings" },
        {
          model: User,
          as: "Followers",
          include: [{ model: User, as: "Followers" }]
        },
        { model: Tweet, as: "LikedTweets" }
      ]
    }).then(user => {
      //判斷其是否已follow
      user.isFollowed = user.Followers.map(d => d.id).includes(
        helpers.getUser(req).id
      );
      let userFollowers = user.Followers;
      //console.log("----------------", userFollowers[0]);
      userFollowers = userFollowers.map(followedUser => ({
        ...followedUser.dataValues,
        user_id: followedUser.id,
        user_avatar: followedUser.avatar,
        user_name: followedUser.name,
        user_introduction: followedUser.introduction, //.substring(0, 50),
        //紀錄是否追蹤過
        isFollowed: followedUser.Followers.map(d => d.id).includes(
          helpers.getUser(req).id
        )
      }));
      //依時間前後排序
      userFollowers = userFollowers.sort((a, b) => b.createAt - a.createAt);
      res.render("userFollower", {
        user: user,
        userFollowers: userFollowers
      });
    });
  },
  getUserLikes: (req, res) => {
    return User.findByPk(req.params.id, {
      include: [
        { model: Tweet, as: "UserTweets" },
        { model: User, as: "Followings" },
        { model: User, as: "Followers" },
        {
          model: Tweet,
          as: "LikedTweets",
          include: [User, Reply, { model: User, as: "LikedUsers" }]
        }
      ]
    }).then(user => {
      //判斷其是否已follow
      user.isFollowed = user.Followers.map(d => d.id).includes(
        helpers.getUser(req).id
      );
      //依時間前後排序
      let userLikedTweets = user.LikedTweets.sort(
        (a, b) => b.createdAt - a.createdAt
      );
      //重組likeTweet的資料 加上isliked屬性
      userLikedTweets = userLikedTweets.map(tweet => ({
        ...tweet.dataValues,
        isLiked: tweet.LikedUsers.map(d => d.id).includes(
          helpers.getUser(req).id
        )
      }));

      return res.render("userLike", {
        user: user,
        userLikedTweets: userLikedTweets
      });
    });
  },
  follow: (req, res) => {
    //如果目前使用者是自己導回
    if (Number(req.body.id) === Number(helpers.getUser(req).id)) {
      console.log("錯誤|使用者不能夠追蹤自己");
      return res.render(`partials/error_message`, {
        error_message: "很抱歉! 您無法追蹤自己",
        lastpag: "/"
      });
    } else {
      return Follow.create({
        followerId: helpers.getUser(req).id,
        followingId: req.body.id //取得form中 hidden input的值
      }).then(data => {
        return res.redirect("back");
      });
    }
  },
  unfollow: (req, res) => {
    return Follow.destroy({
      where: {
        followerId: helpers.getUser(req).id,
        followingId: req.params.userId
      }
    }).then(followship => {
      return res.redirect("back");
    });
  },
  like: (req, res) => {
    return Like.create({
      UserId: helpers.getUser(req).id,
      TweetId: req.params.id
    }).then(data => {
      return res.redirect("back");
    });
  },
  //unlike
  unlike: (req, res) => {
    return Like.destroy({
      where: {
        UserId: helpers.getUser(req).id,
        TweetId: req.params.id
      }
    }).then(() => {
      return res.redirect("back");
    });
  },

  editProfilePage: (req, res) => {
    //如果目前使用者不是自己，導回
    if (Number(req.params.id) !== Number(helpers.getUser(req).id)) {
      return res.redirect(`users/${helpers.getUser(req).id}/edit`);
    }

    return User.findByPk(req.params.id).then(user => {
      return res.render("editProfile", { user });
    });
  },
  editProfile: (req, res) => {
    //name為空白的例外處理
    if (!req.body.name) {
      flash("error_messages", "請輸入你的名稱");
      return res.redirect("back");
    }
    const { file } = req;
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID);
      imgur.upload(file.path, (err, img) => {
        return User.findByPk(req.params.id).then(user => {
          user
            .update({
              name: req.body.name,
              introduction: req.body.introduction,
              avatar: file ? img.data.link : user.avatar
            })
            .then(user => {
              req.flash("success_messages", "user was successfully to update");
              res.redirect("/tweets");
            });
        });
      });
    } else
      return User.findByPk(req.params.id).then(user => {
        user
          .update({
            name: req.body.name,
            introduction: req.body.introduction,
            avatar: file ? img.data.link : user.avatar
          })
          .then(restaurant => {
            req.flash("success_messages", "user was successfully to update");
            res.redirect("/tweets");
          });
      });
  }
};

//匯出controller
module.exports = userController;
