const twitterController = require('../controller/twitterController')

module.exports = app => {
  //首頁
  app.get('/', (req, res) => res.redirect('/tweets'))
  //首頁 
  app.get('/tweets', twitterController.getTwitters)
  //新增tweets
  app.post('/tweets', twitterController.postTwitters)

}