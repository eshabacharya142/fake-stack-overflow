const mongoose = require("mongoose");

var Schema = mongoose.Schema;
// Schema for comments
var CommentSchema = new Schema(
    {
        // define relevant properties.
        text: {type: String, required: true},
        comment_by: {type: Object, required: true, ref: 'User'},
        comment_date_time: {type: Date}
    },
    { collection: "Comment" }
);

//Export model
module.exports = mongoose.Schema(CommentSchema);