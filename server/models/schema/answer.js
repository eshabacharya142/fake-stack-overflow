const mongoose = require("mongoose");

var Schema = mongoose.Schema;
// Schema for answers
var AnswerSchema = new Schema(
    {
        // define relevant properties.
        text: {type: String, required: true},
        ans_by: {type: Object, required: true, ref: 'User'},
        ans_date_time: {type: Date},
        comments: [{type: Schema.Types.ObjectId, ref: 'Comment'}],
        voteCount: {type: Number, default: 0},
        reported: {type: Boolean, default: false}
    },
    { collection: "Answer" }
);
//Export model
module.exports = mongoose.Schema(AnswerSchema);
