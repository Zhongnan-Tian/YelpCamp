var mongoose = require("mongoose");
 
var commentSchema = new mongoose.Schema({
    text: String,
    createdAt: { type: Date, default: Date.now }, 
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId, 
            ref: "User"
        }, 
        username: String
    }
    // rating: {
    //     // Setting the field type
    //     type: Number,
    //     // Making the star rating required
    //     required: "Please provide a rating (1-5 stars).",
    //     // Defining min and max values
    //     min: 1,
    //     max: 5,
    //     // Adding validation to see if the entry is an integer
    //     validate: {
    //         // validator accepts a function definition which it uses for validation
    //         validator: Number.isInteger,
    //         message: "{VALUE} is not an integer value."
    //     }
    // },
    // // campground associated with the review
    // campground: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "Campground"
    // }
});
 
module.exports = mongoose.model("Comment", commentSchema);
