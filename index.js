require('dotenv').config(); 

var express    = require("express"), 
    app        = express(), 
    bodyParser = require("body-parser"),
    methodOverride = require("method-override"), 
    mongoose   = require("mongoose"),
    passport   = require("passport"), 
    LocalStrategy = require("passport-local"), 
    Campground = require("./models/campground.js"), 
    Comment    = require("./models/comment.js"), 
    User = require("./models/user"),
    seedDB     = require("./seed.js");
    
var campgroundRoutes = require("./routes/campgrounds.js"), 
    commentRoutes    = require("./routes/comments.js"), 
    indexRoutes      = require("./routes/index.js");
    
var flash = require("connect-flash");

// mongoose.connect("mongodb://localhost:27017/yelp_camp_v12", {useNewUrlParser: true});
mongoose.connect(process.env.DBURL);

app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

app.locals.moment = require('moment');

app.use(require("express-session")({
    secret: "this is a secret",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(flash());

app.use(function(req, res, next){
    res.locals.currentUser = req.user; 
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next(); 
});

app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

//seedDB(); 

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server is started...");
});