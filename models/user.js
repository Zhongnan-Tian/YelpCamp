var mongoose = require("mongoose");

var passportLocalMongoose = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
    username: {
        type: String, 
        unique: true, 
        required: true
    }, 
    password: String, 
    firstname: String, 
    lastname: String, 
    email: {
        type: String, 
        unique: true, 
        required: true
    }, 
    isAdmin: {
        type: Boolean, 
        default: false
    }, 
    resetPasswordToken: String, 
    resetPasswordExpires: Date 
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);