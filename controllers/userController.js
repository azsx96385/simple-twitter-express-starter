//引入套件區
const bcrypt = require("bcrypt-nodejs");
//引入model
const db = require("../models");
const User = db.User;
const Tweet = db.Tweet
const Reply = db.Reply

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
    res.render('tweets')
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
            { model: User, as: 'likedUsers' }]//for 使用者的Tweets的like數
        },
        { model: User, as: 'Followings' },
        { model: User, as: 'Followers' },
        { model: Tweet, as: 'likedTweets' }
      ]
    }).then(user => {
      let userTweets = user.Tweets.sort((a, b) => b.createAt - a.createAt)

      return res.render('userWall', { user: user, userTweets: userTweets })

    })

  },
  getUserFollowings: (req, res) => {
    return User.findByPk(req.params.id, {
      include: [
        Tweet,
        { model: User, as: 'Followings' },
        { model: User, as: 'Followers' },
        { model: Tweet, as: 'likedTweets' }
      ]
    }).then(user => {
      let userFollowings = user.Followings.sort((a, b) => b.createAt - a.createAt)

      return res.render('userFollowing', { user: user, userFollowings: userFollowings })
    })


  },
  getUserFollowers: (req, res) => {

  },
  getUserlikes: (req, res) => {


  },

};

//匯出controller
module.exports = userController;
