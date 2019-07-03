//引入套件區
const bcrypt = require("bcrypt-nodejs");
//引入model
const db = require("../models");
const helpers = require('../_helpers')
const User = db.User;
const Tweet = db.Tweet
const Reply = db.Reply
const Follow = db.Followship
const Like = db.Like

//controller 設定區
const userController = {
  //[使用者 登入 | 登出 | 註冊]
  signUpPage: (req, res) => {
    return res.render("user_signIn");
  },
  signUp: (req, res) => {
    let { name, email, password, password_confirm } = req.body;
    console.log(req.body);
    //驗證資料缺漏
    if (!email || !name || !password || !password_confirm) {
      console.log("錯誤訊息|資料漏填");
      req.flash("error_messages", "錯誤訊息|資料漏填");
      return res.redirect("back");
    }
    User.findOne({ where: { name: name } }).then(user => {
      if (user) {
        req.flash("error_messages", "錯誤訊息|名稱已被使用");
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
            return res.redirect("/users/login");
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
    return res.render("user_logIn");
  },
  logIn: (req, res) => {
    //使用 passport 做驗證
    req.flash("success_messages", "成功訊息|你已經成功登入");
    res.redirect('/tweets')
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
          model: Tweet, include: [Reply, //for 使用者的Tweets的relPy數
            { model: User, as: 'LikedUsers' }]//for 使用者的Tweets的like數
        },
        { model: User, as: 'Followings' },
        { model: User, as: 'Followers' },
        { model: Tweet, as: 'LikedTweets' }
      ]
    }).then(user => {
      //判斷該user是否follow
      user.isFollowed = user.Followers.map(d => d.id).includes(helpers.getUser(req).id)
      //依時間前後排序
      let userTweets = user.Tweets.sort((a, b) => b.createAt - a.createAt)

      return res.render('userWall', { user: user, userTweets: userTweets })

    })

  },
  getUserFollowings: (req, res) => {
    return User.findByPk(req.params.id, {
      include: [
        Tweet, {
          model: User, as: 'Followings',
          include: [{ model: User, as: 'Followers' }]//找尋追蹤的user ,在找尋期的追蹤者
        },
        { model: User, as: 'Followers' },
        { model: Tweet, as: 'LikedTweets' }
      ]
    }).then(user => {
      //判斷其是否已follow
      user.isFollowed = user.Followers.map(d => d.id).includes(req.user.id)

      let userFollowings = user.Followings//取得追蹤中的users
      //
      userFollowings = userFollowings.map(followingUser => ({
        ...followingUser.dataValues,
        //紀錄是否追蹤過
        isFollowed: followingUser.Followers.map(d => d.id).includes(req.user.id)
      }))
      //依時間前後排序
      userFollowings = userFollowings.sort((a, b) => b.createAt - a.createAt)

      return res.render('userFollowing', { user: user, userFollowings: userFollowings })
    })


  },
  getUserFollowers: (req, res) => {
    return User.findByPk(req.params.id, {
      include: [
        Tweet, { model: User, as: 'Followings' },
        {
          model: User, as: 'Followers',
          include: [{ model: User, as: 'Followers' }]
        },
        { model: Tweet, as: 'LikedTweets' }
      ]
    }).then(user => {
      //判斷其是否已follow
      user.isFollowed = user.Followers.map(d => d.id).includes(req.user.id)
      let userFollowers = user.Followers
      userFollowers = userFollowers.map(followedUser => ({
        ...followedUser.dataValues,
        //紀錄是否追蹤過
        isFollowed: followedUser.Followers.map(d => d.id).includes(req.user.id)
      }))
      //依時間前後排序
      userFollowers = userFollowers.sort((a, b) => b.createAt - a.createAt)

      return res.render('userFollower', { user: user, userFollowers: userFollowers })
    })


  },
  getUserLikes: (req, res) => {

    return User.findByPk(req.params.id, {
      include: [
        Tweet,
        { model: User, as: 'Followings' },
        { model: User, as: 'Followers' },
        {
          model: Tweet, as: 'LikedTweets', include: [User, Reply,
            { model: User, as: 'LikedUsers' }]
        }
      ]
    }).then(user => {
      //判斷其是否已follow
      user.isFollowed = user.Followers.map(d => d.id).includes(req.user.id)
      //依時間前後排序
      let userLikedTweets = user.LikedTweets.sort((a, b) => b.createAt - a.createAt)


      return res.render('userLike', { user: user, userLikedTweets: userLikedTweets })

    })

  },
  follow: (req, res) => {
    return Follow.create({
      FollowerId: helpers.getUser(req).id,
      FollowingId: req.body.FollowingId //取得form中 hidden input的值
    }).then(
      () => {
        let id = req.body.FollowingId
        return res.redirect('back')
      }
    )
  },
  unfollow: (req, res) => {
    return Follow.findOne({
      where: {
        followerId: req.user.id,
        followingId: req.params.userId
      }
    })
      .then((followship) => {
        followship.destroy()
          .then((followship) => {
            return res.redirect('back')
          })
      })
  },
  like: (req, res) => {
    return Like.create({
      UserId: req.user.id,
      TweetId: req.params.id,
    })
      .then(() => {
        return res.redirect('back')
      })
  },
  //unlike
  unlike: (req, res) => {
    return Like.destroy({
      where: {
        UserId: req.user.id,
        TweetId: req.params.id,
      }
    })
      .then(() => {
        return res.redirect('back')
      })
  },
  editProfile: (req, res) => {

  }

}

//匯出controller
module.exports = userController;
