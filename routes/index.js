var express    = require("express");
var router     = express.Router(); 
var User = require("../models/user.js");
var Campground = require("../models/campground.js");
var passport   = require("passport"); 
var async = require("async");
var nodemailer = require("nodemailer");
var crypto = require("crypto");

router.get("/", function(req, res){
    res.render("landing");
});

router.get("/login", function(req, res){
    res.render("login");
});

router.post("/login", passport.authenticate("local", {
    //successRedirect: "/campgrounds", 
    successReturnToOrRedirect: "/campgrounds", 
    failureRedirect: "/login", 
    failureFlash: 'Invalid username or password. Please try again.', 
    successFlash: 'Welcome back!'
}), function(req, res){
    
});

router.get("/register", function(req, res){
    res.render("register");
});

router.post("/register", function(req, res){
    var newUser = new User({
        username: req.body.username, 
        firstname: req.body.firstname, 
        lastname: req.body.lastname, 
        email: req.body.email
    });
    //eval(require('locus'));
    User.register(newUser, req.body.password, function(error, user){
        if(error) {
            console.log(error);//UserExistsError: A user with the given username is already registered
            req.flash("error", error.message);
            res.redirect("/register");// cannot use   return res.render("register");  because the error will not show on "register" page!
        } else {
            passport.authenticate("local")(req, res, function(){
                req.flash("success", "Welcome to YelpCamp " + req.user.username);
                res.redirect("/campgrounds");
            });
        }
    });
});


router.get("/logout", function(req, res){
    req.logout();
    req.flash("error", "Logged you out!");
    res.redirect("/campgrounds");
});

router.get("/users/:id", function(req, res) {
    User.findById(req.params.id, function(error, user) {
        if(error) {
            req.flash("error", error.message);    
            res.redirect("back");
        } else {
            Campground.find().where('author.id').equals(user._id).exec(function(error, campgrounds) {
                if(error) {
                    req.flash("error", error.message);    
                    res.redirect("back");
                } else {
                    res.render("users/show", {user: user, campgrounds: campgrounds});
                }
            }); 
        }
    });
});

// forgot password
router.get('/forgot', function(req, res) {
  res.render('forgot');
});

router.get('/reset-password', function(req, res) {
  res.render('verifyEmail');
});

router.post('/forgot', function(req, res, next) {
  async.waterfall([
    function(done) {
      crypto.randomBytes(20, function(err, buf) {
        var token = buf.toString('hex');
        done(err, token);
      });
    },
    function(token, done) {
      User.findOne({ email: req.body.email }, function(err, user) {
        if (!user) {
          req.flash('error', 'No account with that email address exists.');
          return res.redirect('/reset-password');
        }
        
        if(req.user && (req.user.email !== req.body.email)) {
          req.flash('error', 'This is not your email address.');
          return res.redirect('/reset-password');
        }

        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

        user.save(function(err) {
          done(err, token, user);
        });
      });
    },
    function(token, user, done) {
      var smtpTransport = nodemailer.createTransport({
        service: 'Gmail', 
        auth: {
          user: 'theyelpcamp.dev@gmail.com',
          pass: process.env.GMAILPW
        }
      });
      var mailOptions = {
        to: user.email,
        from: 'YelpCamp',
        subject: 'YelpCamp Password Reset',
        text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
          'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
          'http://' + req.headers.host + '/reset/' + token + '\n\n' +
          'If you did not request this, please ignore this email and your password will remain unchanged.\n'
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        console.log('mail sent');
        req.flash('success', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
        done(err, 'done');
      });
    }
  ], function(err) {
    if (err) return next(err);
    res.redirect('/reset-password');
  });
});

router.get('/reset/:token', function(req, res) {
  User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
    if (!user) {
      req.flash('error', 'Password reset token is invalid or has expired.');
      return res.redirect('/forgot');
    }
    res.render('reset', {token: req.params.token});
  });
});

router.post('/reset/:token', function(req, res) {
  async.waterfall([
    function(done) {
      User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
        if (!user) {
          req.flash('error', 'Password reset token is invalid or has expired.');
          return res.redirect('back');
        }
        if(req.body.password === req.body.confirm) {
          user.setPassword(req.body.password, function(err) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;

            user.save(function(err) {
              req.logIn(user, function(err) {
                done(err, user);
              });
            });
          })
        } else {
            req.flash("error", "Passwords do not match.");
            return res.redirect('back');
        }
      });
    },
    function(user, done) {
      var smtpTransport = nodemailer.createTransport({
        service: 'Gmail', 
        auth: {
          user: 'theyelpcamp.dev@gmail.com',
          pass: process.env.GMAILPW
        }
      });
      var mailOptions = {
        to: user.email,
        from: 'YelpCamp',
        subject: 'Your password has been changed',
        text: 'Hello,\n\n' +
          'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        req.flash('success', 'Success! Your password has been changed.');
        done(err);
      });
    }
  ], function(err) {
    res.redirect('/campgrounds');
  });
});


module.exports = router; 