var Campground = require("../models/campground.js");
var Comment    = require("../models/comment.js");

var middleWareObj = {};

middleWareObj.checkCampgroundOwner = function(req, res, next) {
    if(req.isAuthenticated()) {
        Campground.findById(req.params.id, function(error, foundCamp){
            if(error) {
                res.redirect("back");
            } else {
                if(foundCamp.author.id.equals(req.user._id) || req.user.isAdmin) {
                    next();
                } else {
                    req.flash("error", "You don't have permission to do that!");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "Please signin first!");
        res.redirect("back");
    }
}

middleWareObj.checkCommentOwner = function(req, res, next){
    if(req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, function(error, foundComment){
            if(error) {
                res.redirect("back");
            } else {
                if(foundComment.author.id.equals(req.user._id) || req.user.isAdmin) {
                    next();
                } else {
                    req.flash("error", "You don't have permission to do that!");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "Please login first!");
        res.redirect("back");
    }
}

middleWareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()) {
        return next()
    }
    req.flash("error", "Please Login First!");
    res.redirect("/login");
}

module.exports = middleWareObj; 