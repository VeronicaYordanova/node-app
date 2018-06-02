let encryption = require('../utilities/encryption')
const User = require('../data/User')

module.exports = {
    registerGet: (req, res) => {
          res.render('user/register')
      },
    registerPost:(req, res) => {
          let registerArgs = req.body
  
          User.findOne({email: registerArgs.email}).then(user => {
              let errorMsg = ''
              if (user) {
                  errorMsg = 'User with the same username exists!'
              } else if (registerArgs.password !== registerArgs.repeatedPassword) {
                  errorMsg = 'Passwords do not match!'
              }
  
              if (errorMsg) {
                  registerArgs.error = errorMsg;
                  res.render('user/register', registerArgs)
              } else {
                  let salt = encryption.generateSalt()
                  let passwordHash = encryption.hashPassword(registerArgs.password, salt)
  
                  let userObject = {
                      email: registerArgs.email,
                      passwordHash: passwordHash,
                      fullName: registerArgs.fullName,
                      salt: salt
                  };
  
                  User.create(userObject).then(user => {
                      req.logIn(user, (err) => {
                          if (err) {
                              registerArgs.error = err.message;
                              res.render('user/register', registerArgs)
                              return;
                          }
  
                          res.redirect('/user/profile')
                      })
                  })
              }
          })
      },
    loginGet: (req, res) => {
          res.render('user/login')
      },
  
      loginPost: (req, res) => {
          let loginArgs = req.body
          User.findOne({email: loginArgs.email}).then(user => {
              if (!user ||!user.authenticate(loginArgs.password)) {
                  let errorMsg = 'Either username or password is invalid!'
                  loginArgs.error = errorMsg
                  res.render('user/login', loginArgs)
                  return;
              }
  
              req.logIn(user, (err) => {
                  if (err) {
                      console.log(err)
                      res.redirect('/user/login', {error: err.message})
                      return;
                  }
  
                  res.redirect('/user/profile')
              })
          })
      },
    logout: (req, res) => {
      req.logout()
      res.redirect('/')
    },
    profile: (req, res) => {
      res.render('user/profile')
    },
    update: (req, res) => {
        let updateArgs = req.body
        let user = req.user
      User.findOne({ email: user.email })
        .then((user) => {
          let salt = user.salt
          let oldUserPassword = user.passwordHash
          let oldPassword = encryption.hashPassword(updateArgs.oldpassword, salt)
          let newPassword = encryption.hashPassword(updateArgs.newpassword, salt)
          if (oldUserPassword !== oldPassword) {
            updateArgs.error = 'Wrong Password!'
            res.render('user/profile', updateArgs)
            // check if the new password is the same as the old one
          } else if (oldPassword === newPassword) {
            updateArgs.error = 'The new password is identical to the old one. Please enter a new one.'
            res.render('user/profile', updateArgs)
          } else if (req.body.newpassword !== updateArgs.confirmNewPassword) {
            updateArgs.error = 'New password is not matching'
            res.render('user/profile', updateArgs)
          } else {
            User.update({ email: user.email }, {
              $set: {
                passwordHash: newPassword
              }
            }).then((user) => {

                updateArgs.error = 'Changed password successfully'
                res.render('user/profile', updateArgs)

            })
          }
        })
    }
  }
