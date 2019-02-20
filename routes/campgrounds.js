var express    = require("express");
var router     = express.Router(); 
var Campground = require("../models/campground.js");
var middleWare = require("../middleware");

// set up multer
var multer = require('multer');
var storage = multer.diskStorage({
  filename: function(req, file, callback) {
    callback(null, Date.now() + file.originalname);
  }
});
var imageFilter = function (req, file, cb) {
    // accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};
var upload = multer({ storage: storage, fileFilter: imageFilter})

// set up cloudinary
var cloudinary = require('cloudinary');
cloudinary.config({ 
  cloud_name: 'du0v3r1ja', 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});

router.get("/", function(req, res){
    var noMatch = null; 
    if (req.query.search) {
       const regex = new RegExp(escapeRegex(req.query.search), 'gi');
       Campground.find({ $or: [{name: regex}, {description: regex}] }, function(error, campgrounds){
           if(error) {
               req.flash("error", error.message);
               return res.redirect("back");
           }
           
           if(campgrounds.length < 1) {
            //   req.flash("error", "No campground found.");
            //   return res.redirect("/campgrounds");
                noMatch = "No matching campgrounds found. Please search again. ";
           } 
           
           res.render("campgrounds/index", {campgrounds:campgrounds, noMatch:noMatch});
       }); 
    } else {
        Campground.find({}, function(error, campgrounds){
            if(error) {
                console.log(error);
            } else {
                res.render("campgrounds/index", {campgrounds:campgrounds, noMatch:noMatch});
            }
        });
    }
});

router.get("/new", middleWare.isLoggedIn, function(req, res){
    res.render("campgrounds/new");
});

router.post("/", middleWare.isLoggedIn, upload.single('image'), function(req, res){
    if(!req.file) {  //user doesn't upload image
      req.body.campground.image = "https://res.cloudinary.com/du0v3r1ja/image/upload/v1550673225/no_uploaded.png";
        // add author to campground
      req.body.campground.author = {
        id: req.user._id,
        username: req.user.username
      }
      
      Campground.create(req.body.campground, function(err, campground) {
        if (err) {
          req.flash('error', err.message);
          return res.redirect('back');
        } else  {
            req.flash("success", "Compground Created!");
            res.redirect('/campgrounds/' + campground.id);
        }
      });
    } else {
        if(req.file.size > 1048576) {  //image is larger than 1MB
            req.flash("error", "Image is too large. Maximum 1 MB. Please retry with a smaller image.");
            return res.redirect("/campgrounds/new");
        }
        cloudinary.v2.uploader.upload(req.file.path, function(error, result) {
              if(error) {
                 req.flash("error", error.message);
                 return res.redirect("back");
              }
            // add cloudinary url for the image to the campground object under image property
              req.body.campground.image = result.secure_url;
              req.body.campground.imageId = result.public_id;
              //eval(require('locus')); 
              
              req.body.campground.author = {
                  id: req.user._id,
                  username: req.user.username
              }
              
              Campground.create(req.body.campground, function(err, campground) {
                if (err) {
                  req.flash('error', err.message);
                  return res.redirect('back');
                } else  {
                    req.flash("success", "Compground Created!");
                    res.redirect('/campgrounds/' + campground.id);
                }
              });
        }); 
    }
});

router.get("/:id", function(req, res){
    // Campground.findById(req.params.id, function(err, foundCamp){
    //     if(err) {
    //         console.log();
    //     } else {
    //         res.render("show", {foundCamp, foundCamp});
    //     }
    // });
    Campground.findById(req.params.id).populate("comments").exec(function(error, foundCamp){
        if(error) {
            console.log();
        } else {
            //console.log(foundCamp);
            res.render("campgrounds/show", {foundCamp, foundCamp});
        }
    });
});

router.get("/:id/edit", middleWare.checkCampgroundOwner, function(req, res){
    Campground.findById(req.params.id, function(error, foundCamp){
        if(error) {
            console.log(error);
        } else {
            res.render("campgrounds/edit", {foundCamp: foundCamp});
        }
    });
});

router.put("/:id", middleWare.checkCampgroundOwner, upload.single('image'), function(req, res){
    Campground.findById(req.params.id, async function(error, campground){
        if(error) {
            req.flash("error", error.message);
            res.redirect("/campgrounds");
        } else {
            if(req.file) {
               try {
                   if(campground.imageId) {
                       await cloudinary.v2.uploader.destroy(campground.imageId);
                   }
                   var result = await cloudinary.v2.uploader.upload(req.file.path);
                   campground.imageId = result.public_id;
                   campground.image = result.secure_url; 
               } catch(error) {
                   console.log("Error from cloudinary.v2.uploader...");
                   req.flash("error", error.message);
                   return res.redirect("/campgrounds");
               }
            }
            campground.name = req.body.name;
            campground.location = req.body.location;
            campground.description = req.body.description;
            campground.price = req.body.price; 
            campground.save(); 
            req.flash("success", "Campground Updated!");
            res.redirect("/campgrounds/" + campground._id);
        }
    });
});

router.delete("/:id", middleWare.checkCampgroundOwner, function(req, res){
    Campground.findById(req.params.id, async function(error, campground) {
        if(error) {
            req.flash("error", error.message);
            return res.redirect("back");
        } 
        
        if(!campground.imageId) { //campground doesn't have a valid image. 
            campground.remove(); 
            req.flash("success", "Campground Deleted!");
            res.redirect("/campgrounds");
        } else {
        
            try {
                await cloudinary.v2.uploader.destroy(campground.imageId);
                campground.remove(); 
                req.flash("success", "Campground Deleted!");
                res.redirect("/campgrounds");
            } catch(error) {
                console.log("Error from cloudinary.v2.uploader...");
                req.flash("error", error.message);
                return res.redirect("back");
            }
        }
    });
});

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

module.exports = router; 