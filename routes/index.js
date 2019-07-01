const twitterController = require('../controller/twitterController')
const userController = require('../controller/userController')

module.exports = app => {
  //首頁
  app.get('/', (req, res) => res.redirect('/tweets'))
  //首頁 
  app.get('/tweets', twitterController.getTwitters)
  //新增tweets
  app.post('/tweets', twitterController.postTwitters)

  //profile
  //tweet wall
  app.get('/users/:id/tweets', userController.getUserTweets)
  /*//following wall
app.get('/users/: id / followings', userController.getUserFollowings)
//fans wall
app.get('/users/:id/followers', userController.getUserFollowers)
//likes wall(show tweets)
app.get('/users/:id/likes', userController.getUserLikes)*/
}