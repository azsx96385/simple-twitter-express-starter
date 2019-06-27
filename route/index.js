//匯入需要controller
const userController = require("../controllers/userController");
//匯入需要model

//會出路由
module.exports = (app, passport) => {
  //[使用者 登入 | 登出 | 註冊]==========================
  app.get("/users/logIn", userController.logInPage);
  app.post("/users/logIn", userController.logIn);
  app.get("/users/signIn", userController.signUpPage);
  app.post("/users/signIn", userController.signUp);
  app.get("/users/logOut", userController.logOut);
};
