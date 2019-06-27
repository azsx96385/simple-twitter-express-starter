const express = require('express')
const helpers = require('./_helpers');
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const db = require('./models') // 引入資料庫

const app = express()
const port = 3000

// setting body-parser
app.use(bodyParser.urlencoded({ extended: true }))
//建立handlebars模板
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')


// use helpers.getUser(req) to replace req.user

// use helpers.ensureAuthenticated(req) to replace req.isAuthenticated()


app.listen(port, () => {
  db.sequelize.sync() // 跟資料庫同步
  console.log(`Example app listening on port ${port}!`)
})


require('./routes')(app)
module.exports = app
