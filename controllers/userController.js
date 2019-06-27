//引入套件區
const bcrypt = require("bcrypt-nodejs");
//引入model
const db = require("../models");
const User = db.User;

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
    //驗證密碼相同
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
  },
  logInPage: (req, res) => {
    return res.render("user_logIn");
  },
  logIn: (req, res) => {},
  logOut: (req, res) => {}
};

//匯出controller
module.exports = userController;
