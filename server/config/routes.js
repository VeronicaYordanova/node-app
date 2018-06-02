const userController = require('../controllers/users-controller');
const homeController = require('../controllers/home-controller');
let passport = require('passport')

module.exports = (app) => {
  // home
  app.get('/', homeController.index);

  app.get('/user/register', userController.registerGet)
  app.post('/user/register', userController.registerPost)
  app.post('/user/update', userController.update)

  app.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email'] }), (req, res) => { })
  app.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/' }), (req, res) => { res.redirect('/') })

  app.get('/user/login', userController.loginGet)
  app.post('/user/login', userController.loginPost)
  app.get('/user/profile', userController.profile)

  app.get('/user/logout', userController.logout)

  // fallback
  app.all('*', (req, res) => {
    res.status(404)
    res.send('The page is not found')
    res.end()
  })
}