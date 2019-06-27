//匯入需要model

//會出路由
module.exports = (app, passport) => {
  app.get("/users/logIn", (req, res) => {
    res.send("loginPage!");
  });
  app.post("/users/logIn", (req, res) => {
    res.send("loginPage!");
  });
  app.get("/users/signIn", (req, res) => {
    res.send("loginPage!");
  });
  app.post("/users/signIn", (req, res) => {
    res.send("loginPage!");
  });
  app.get("/users/logOut", (req, res) => {
    res.send("loginPage!");
  });
};
