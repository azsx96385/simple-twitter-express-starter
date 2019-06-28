//匯入需要controller
const userController = require("../controllers/userController");
//匯入需要model

//會出路由
module.exports = (app, passport) => {
  //[使用者 登入 | 登出 | 註冊]==========================
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
  app.delete("admin/tweets/:id", adminController.deleteTweets);
  app.get("/admin/users", adminController.usersPage);
};
