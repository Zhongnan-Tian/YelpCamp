var mongoose = require("mongoose");

var campgroundSchema = new mongoose.Schema({
    name: String, 
    price: String, 
    image: String,
    imageId: String, 
    location: String, 
    description: String, 
    createdAt: { type: Date, default: Date.now }, 
    author: {
        id: {
                type: mongoose.Schema.Types.ObjectId, 
                ref: "User"
            }, //id is a mongoose object!
        username: String
    }, 
    // rating: {
    //     type: String,
    //     default: 0
    // }, 
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId, 
            ref: "Comment"
        }
    ]
});

module.exports = mongoose.model("Campground", campgroundSchema);