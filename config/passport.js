//引入lin & strategy &model
const passport = require("passport");
const localStrategy = require("passport-local");
const bcrypt = require("bcrypt-nodejs");
//model
const db = require("../models");
const User = db.User;

//passport 設定

//passport-local 策略設定
passport.use(
  new localStrategy(
    {
      //設定驗證帳密
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true
    },
    (req, username, password, cb) => {
      //啟動登入驗證流程
      User.findOne({ where: { email: username } }).then(user => {
        ///使用者不存在-驗證失敗
        if (!user) {
          return cb(
            null,
            false,
            req.flash("error_messages", "錯誤訊息|帳號尚未註冊")
          );
        }
        //查有使用者-比對密碼是否正確|密碼不一致-驗證失敗
        if (!bcrypt.compareSync(password, user.password)) {
          return cb(
            null,
            false,
            req.flash("error_messages", "錯誤訊息|密碼輸入錯誤")
          );
        } else {
          //密碼正確-驗證通過-回傳user物件
          return cb(null, user);
        }
      });
    }
  )
);

//passport 正反序列
passport.serializeUser((user, cb) => {
  cb(null, user.id); //驗證通過-接住user物件，取出user-id 存到session
});
passport.deserializeUser((id, cb) => {
  User.findByPk(id).then(user => {
    return cb(null, user);
  });
});

//匯出passport
module.exports = passport;
