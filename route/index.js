//匯入需要controller
const userController = require("../controllers/userController");
const adminController = require("../controllers/adminController");
const twitterController = require("../controllers/twitterController");

//匯入需要model

//會出路由
module.exports = (app, passport) => {
  //[中介曾]
  const authenticate = (req, res, next) => {
    //驗證是否有 passport isAuthenticated
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect("/users/logIn");
  };
  //[使用者 登入 | 登出 | 註冊]==========================
  app.get("/", (req, res) => {
    res.redirect("/users/logIn");
  });
  app.get("/users/signUp", userController.signUpPage);
  app.post("/users/signUp", userController.signUp);

  app.get("/users/logIn", userController.logInPage);
  app.post(
    "/users/logIn",
    passport.authenticate("local", {
      failureRedirect: "/users/logIn",
      failureFlash: true
    }),
    userController.logIn
  );

  app.get("/users/logOut", userController.logOut);
  //[管理者  推文總攬 | 使用者總攬]==========================
  app.get("/admin/tweets", authenticate, adminController.tweetsPage);
  app.delete("/admin/tweets/:id", authenticate, adminController.deleteTweets);
  app.get("/admin/users", authenticate, adminController.usersPage);
  ///---------------------------------
  //首頁
  app.get("/", authenticate, (req, res) => res.redirect("/tweets"));
  //首頁
  app.get("/tweets", authenticate, twitterController.getTwitters);
  //新增tweets
  app.post("/tweets", authenticate, twitterController.postTwitters);

  //profile
  //tweet wall
  app.get("/users/:id/tweets", authenticate, userController.getUserTweets);

  //following wall
  app.get('/users/:id/followings', authenticate, userController.getUserFollowings)
  //followers wall
  app.get('/users/:id/followers', userController.getUserFollowers)
  //likes wall(show tweets)
  app.get('/users/:id/likes', userController.getUserLikes)
  //follow
  app.post('/followships', authenticate, userController.follow)
  //unfollow
  app.delete('/followships/:userId', authenticate, userController.unfollow)
  //like
  app.post('/tweets/:id/like', authenticate, userController.like)
  //unlike 
  app.post('/tweets/:id/unlike', authenticate, userController.unlike)
  //編輯個人葉面
  app.get('/users/:id/edit', authenticate, userController.editProfile)


  //reply頁面
  app.get('/tweets/:tweet_id/replies', authenticate, twitterController.replyPage)
  //reply動作
  app.post('/tweets/:tweet_id/replies', authenticate, twitterController.reply)

}