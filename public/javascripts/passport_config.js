var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var JwtStrategy = require('passport-jwt').Strategy,
  ExtractJwt = require('passport-jwt').ExtractJwt; //从header中获取token
var opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken(); //token
opts.secretOrKey = 'sjj'; //用于token解密的秘钥
var db = require('./mysql');
//通过数据库验证username password 
passport.use('local', new LocalStrategy(
  function (username, password, cb) {
    db.users.findByUsername(username, function (err, user) {
      if (err) {
        return cb(err);
      }
      if (!user) {
        return cb(null, false);
      }
      if (user.password != password) {
        return cb(null, false);
      }
      return cb(null, user);
    });
  }));
//通过数据库验证token中携带的username
passport.use('jwt', new JwtStrategy(opts, function (jwt_payload, cb) {
  let username = jwt_payload.username;
  db.users.findByUsername(username, function (err, user) {
    if (err) {
      return cb(err);
    }
    if (!user) {
      return cb(null, false);
    }
    return cb(null, user);
  })
}));

//session相关函数
passport.serializeUser(function (user, cb) {
  cb(null, user.id);
});

passport.deserializeUser(function (id, cb) {
  db.users.findById(id, function (err, user) {
    if (err) {
      return cb(err);
    }
    cb(null, user);
  });
});

module.exports = passport;