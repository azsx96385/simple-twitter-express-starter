//引入 lib

//引入 model
const db = require("../models");

//設定controller
const adminController = {
  //推文總攬
  tweetsPage: (req, res) => {
    res.render("admin_tweets");
  },
  //推文總攬-刪除推文
  deleteTweets: (req, res) => {
    res.send("你已經刪除推文");
  },
  //用戶總攬
  usersPage: (req, res) => {
    res.render("admin_users");
  }
};

//匯出
module.exports = adminController;
