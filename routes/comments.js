var express    = require("express");
var router     = express.Router({mergeParams: true}); 
var Campground = require("../models/campground.js");
var Comment    = require("../models/comment.js");
var middleWare = require("../middleware");

router.get("/new", middleWare.isLoggedIn, function(req, res){
    Campground.findById(req.params.id, function(error, foundCamp){
        if(error) {
            console.log(error);
        } else {
            res.render("comments/new", {foundCamp: foundCamp});
        }
    });
});

router.post("/", middleWare.isLoggedIn, function(req, res){
    Campground.findById(req.params.id, function(error, foundCamp){
        if(error) {
            console.log(error);
            res.redirect("/campgrounds");
        } else {
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    console.log(err);
                } else {
                    comment.author.id = req.user._id; 
                    comment.author.username = req.user.username; 
                    comment.save(); 
                    foundCamp.comments.push(comment);
                    foundCamp.save();
                    req.flash("success", "Comment Added!");
                    res.redirect("/campgrounds/" + foundCamp._id);
                    //console.log("Created new comment!");
                }
            });
        }
    });
});

router.get("/:comment_id/edit", middleWare.checkCommentOwner, function(req, res){
    Comment.findById(req.params.comment_id, function(error, foundComment){
        if(error){
            res.redirect("back");
        } else {
            res.render("comments/edit", {camp_id: req.params.id, comment: foundComment});
        }
    });
});

router.put("/:comment_id", middleWare.checkCommentOwner, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(error, updatedComment){
        if(error){
           res.redirect("back"); 
        } else {
            req.flash("success", "Comment Updated!");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

router.delete("/:comment_id", middleWare.checkCommentOwner, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(error){
        if(error) {
            res.redirect("back");
        } else {
            req.flash("success", "Comment Deleted!");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

async function calculateAverage(comments) {
    if (comments.length === 0) {
        return 0;
    }
    var sum = 0;
    comments.forEach(function(element) {
        Comment.findById(element, function(error, comment) {
            sum += comment.rating;
        })
    });
    return Math.round(sum / comments.length);
}


module.exports = router; 