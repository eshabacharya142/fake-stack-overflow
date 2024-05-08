const express = require("express");
const Comment = require("../models/comments");
const Question = require("../models/questions");
const Answer = require("../models/answers");

const router = express.Router();

// Adding comment on question
const addCommentQuestion = async (req, res) => {
    try {
        const { text, comment_date_time } = req.body.comment;
        const currentUser = req.session["currentUser"]; 
        if (!currentUser) {
            return res.status(403).json({ error: "Forbidden" });
        }
        let newComment = await Comment.create({
            text: text,
            comment_by: {
                user_id: currentUser._id,
                user_name: currentUser.username,
            },
            comment_date_time: comment_date_time
        });
        let qid = req.body.qid;
        await Question.findOneAndUpdate(
            { _id: qid },
            { $push: { comments: { $each: [newComment._id], $position: 0 }}},
            { new: true }
        );
        res.send(newComment);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// Adding comment on answer
const addCommentAnswer = async (req, res) => {
    try {
        const { text, comment_date_time } = req.body.comment;
        const currentUser = req.session["currentUser"]; 
        if (!currentUser) {
            return res.status(403).json({ error: "Forbidden" });
        }
        let newComment = await Comment.create({
            text: text,
            comment_by: {
                user_id: currentUser._id,
                user_name: currentUser.username,
            },
            comment_date_time: comment_date_time
        });
        let aid = req.body.aid;
        await Answer.findOneAndUpdate(
            { _id: aid },
            { $push: { comments: { $each: [newComment._id], $position: 0 }}},
            { new: true }
        );
        res.send(newComment);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// add appropriate HTTP verbs and their endpoints to the router.
router.post('/addCommentOnQuestion', addCommentQuestion);
router.post('/addCommentOnAnswer', addCommentAnswer);

module.exports = router;
