const mongoose = require("mongoose");
var Schema = mongoose.Schema;

var UserSchema = new Schema(
    {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        username: { type: String, unique: true, required: true },
        password: { type: String, required: true },
        email: { type: String },
        role: {
                type: String,
                enum: ['REGISTERED', 'ADMIN'],
                required: true,
              },
        votedQuestions: [{
                qid: { type: Schema.Types.ObjectId, ref: 'Question' },
                voteStatus: { type: String, enum: ['UPVOTE', 'DOWNVOTE', 'NONE'], default: 'NONE' } 
            }],
        votedAnswers: [{
                aid: { type: Schema.Types.ObjectId, ref: 'Answer' },
                voteStatus: { type: String, enum: ['UPVOTE', 'DOWNVOTE', 'NONE'], default: 'NONE' } 
          }]
  },
  { collection: 'User', versionKey:false, discriminatorKey: 'userModel' }
);


var AdminSchema = new Schema(
  {
    type: {
      type: String,
      enum: ['SUPER', 'REGULAR', 'REGISTERED'],
      required: true,
      default: 'REGULAR',
    }
  }

);

module.exports = {
  UserSchema: UserSchema,
  AdminSchema: AdminSchema
};