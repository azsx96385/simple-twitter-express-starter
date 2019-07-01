//匯入需要controller
const userController = require("../controllers/userController");
const adminController = require("../controllers/adminController");
const twitterController = require("../controllers/twitterController");

//匯入需要model

//會出路由
module.exports = (app, passport) => {
  //[中介曾]
  // const authenticate = (req, res, next) => {
  //   //驗證是否有 passport isAuthenticated
  //   if (req.isAuthenticated()) {
  //     return next();
  //   }
  //   res.redirect("/users/logIn");
  //};
  //[使用者 登入 | 登出 | 註冊]==========================
  app.get("/", (req, res) => {
    res.redirect("/users/logIn");
  });
  app.get("/users/logIn", userController.logInPage);
  app.post(
    "/users/logIn",
    passport.authenticate("local", {
      failureRedirect: "/users/logIn",
      failureFlash: true
    }),
    userController.logIn
  );
  app.get("/users/signIn", userController.signUpPage);
  app.post("/users/signIn", userController.signUp);
  app.get("/users/logOut", userController.logOut);
  //[管理者  推文總攬 | 使用者總攬]==========================
  app.get("/admin/tweets", adminController.tweetsPage);
  app.delete("/admin/tweets/:id", adminController.deleteTweets);
  app.get("/admin/users", adminController.usersPage);
  ///---------------------------------
  //首頁
  app.get("/", (req, res) => res.redirect("/tweets"));
  //首頁
  app.get("/tweets", twitterController.getTwitters);
  //新增tweets
  app.post("/tweets", twitterController.postTwitters);

  //profile
  //tweet wall
  //app.get("/users/:id/tweets", userController.getUserTweets);

  /*//following wall
  app.get('/users/: id / followings', userController.getUserFollowings)
  //fans wall
  app.get('/users/:id/followers', userController.getUserFollowers)s
  //likes wall(show tweets)
  app.get('/users/:id/likes', userController.getUserLikes)*/
};
