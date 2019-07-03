const express = require("express");
const helpers = require("./_helpers");
const passport = require("./config/passport");
const flash = require("connect-flash");
const session = require("express-session");
const methodOverride = require("method-override");
const app = express();
const port = 3001;

const handlebars = require("express-handlebars");
const bdParser = require("body-parser");
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
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

//[路由區]-------------------------------------------------------------------------------

// use helpers.getUser(req) to replace req.user

// use helpers.ensureAuthenticated(req) to replace req.isAuthenticated()
app.use((req, res, next) => {
  res.locals.success_messages = req.flash("success_messages");
  res.locals.error_messages = req.flash("error_messages");
  res.locals.user = req.user;
  res.locals.isAuthenticated = req.isAuthenticated();
  next();
});

require("./route/index")(app, passport);
module.exports = app;
