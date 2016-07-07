"use strict";

function setupAuth(User, app) {
  let passport = require('passport');
  let LocalStrategy = require('passport-local').Strategy;

  // Configure the local strategy for use by Passport.
  passport.use(new LocalStrategy({
      usernameField: 'username',
      passwordField: 'password'
    },
    function(username, password, done) {
      User.findOne({ username: username }, function(err, user) {
        if (err) { return done(err); }
        if (!user) { return done(null, false); }
        if (!user.verify(password)) { return done(null, false); }
        return done(null, user);
      });
    }
  ));

  passport.serializeUser(function(user, done) { 
    done(null, user._id);
  });

  passport.deserializeUser(function(id, done) {
    User
      .findOne({ _id: id })
      .exec(done);
  });


  // Express middlewares
  app.use(require('express-session')({
    secret: 'this is a secret',
    resave: false,
    saveUninitialized: false
  }));
  app.use(passport.initialize());
  app.use(passport.session());

  // Express routes for auth
  app.post('/login',
    require('body-parser').json(),
    passport.authenticate('local', { failureRedirect: '/login' }),
    function(req, res, next) {
      res.send(req.user);
  });

}

module.exports = setupAuth;
