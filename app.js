const express = require("express");
const helpers = require("./_helpers");
const passport = require("./config/passport");
const flash = require("connect-flash");
const session = require("express-session");
const methodOverride = require("method-override");
const app = express();
const port = process.env.PORT || 3000;
const db = require("./models");

const handlebars = require("express-handlebars");
const bdParser = require("body-parser");
app.listen(port, () => {
  db.sequelize.sync();
  console.log(`Example app listening on port ${port}!`);
  console.log("目前環境為", process.env.NODE_ENV);
});
//[lib設定]----------------------------------------------------------------------
//handlebars |view
app.engine(
  "handlebars",
  handlebars({
    defaultLayout: "main",
    helpers: require("./config/handlebars-helper")
  })
);

app.set("view engine", "handlebars");

//bodyparser
app.use(bdParser.urlencoded({ extended: true }));

// //靜態檔案設定
app.use(express.static("public"));
app.use("/upload", express.static(__dirname + "/upload"));

//session
app.use(
  session({ secret: "seceret", resave: false, saveUninitialized: false })
);
app.use(flash());
//passport
app.use(passport.initialize());
app.use(passport.session());
//overwrite
app.use(methodOverride("_method"));
// 判別開發環境
if (process.env.NODE_ENV !== "production") {
  // 如果不是 production 模式
  require("dotenv").config(); // 使用 dotenv 讀取 .env 檔案
}

//[路由區]-------------------------------------------------------------------------------

// use helpers.getUser(req) to replace req.user

// use helpers.ensureAuthenticated(req) to replace req.isAuthenticated()
app.use((req, res, next) => {
  res.locals.success_messages = req.flash("success_messages");
  res.locals.error_messages = req.flash("error_messages");
  //feature/shang3
  //res.locals.user = helpers.getUser(req)

  res.locals.loginUser = helpers.getUser(req);
  res.locals.isAuthenticated = helpers.ensureAuthenticated(req);

  next();
});

require("./route/index")(app, passport);
module.exports = app;
