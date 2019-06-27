const express = require("express");
const helpers = require("./_helpers");
const passport = require("./config/passport");
const app = express();
const port = 3000;

const handlebars = require("express-handlebars");
const bdParser = require("body-parser");

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

//靜態檔案設定
app.use(express.static("public"));
app.use("/upload", express.static(__dirname + "/upload"));

//[路由區]-------------------------------------------------------------------------------
// use helpers.getUser(req) to replace req.user
// use helpers.ensureAuthenticated(req) to replace req.isAuthenticated()
module.exports = app;
app.get("/", (req, res) => res.send("Hello World!"));
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
require("./route/index")(app, passport);
