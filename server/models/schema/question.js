const mongoose = require("mongoose");

var Schema = mongoose.Schema;

// Schema for questions
var QuestionSchema = new Schema(
    {
        // define the relevant properties.
        title: {type: String, required: true, maxLength: 100, minLength: 5},
        text: {type: String, required: true},
        asked_by: {type: Object, required: true, ref: 'User'},
        ask_date_time: {type: Date},
        views: {type: Number, default: 0},
        answers: [{type: Schema.Types.ObjectId, ref: 'Answer'}],
        tags: [{type: Schema.Types.ObjectId, ref: 'Tag'}],
        comments: [{type: Schema.Types.ObjectId, ref: 'Comment'}],
        voteCount: {type: Number, default: 0},
        reported: {type: Boolean, default: false}
    },
    { collection: "Question" }
);

//Export model
module.exports = mongoose.Schema(QuestionSchema);