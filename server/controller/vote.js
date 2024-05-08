const express = require("express");
const Question = require("../models/questions");
const Answer = require("../models/answers");
const { User } = require("../models/users");

const router = express.Router();

// Upvote or downvote a question
const voteQuestion = async (req, res) => {
    try {
        const { qid } = req.params;
        const { status } = req.body;
        
        let update;
        let votedUpdate;
        
        const currentUser = req.session["currentUser"]; 
        if (!currentUser) {
            return res.status(403).json({ error: "Forbidden" });
        }
        
        const existingUser = await User.findOne({ username: currentUser.username });
        
        let hasVoted = false;
        let index = -1;
        
        for (let i = 0; i < existingUser.votedQuestions.length; i++) {
            const votedQuestion = existingUser.votedQuestions[i];
            if (votedQuestion.qid.toString() === qid) {
                hasVoted = true;
                index = i; 
                break;
            }
        }
        
        if (!hasVoted) {
            if (index === -1 && (status === 'upvote' || status === 'downvote')) {
                update = status === 'upvote' ? { $inc: { voteCount: 1 } } : { $inc: { voteCount: -1 } };
                votedUpdate = { $addToSet: { votedQuestions: { qid, voteStatus: status.toUpperCase() } } };
            } 
        }
        else {
            
            const existingVote = existingUser.votedQuestions[index];
            if (existingVote.voteStatus === 'UPVOTE' && status === 'upvote'){
                
                update = { $inc: { voteCount: -1 } };
                
                votedUpdate = { 
                    $pull: { votedQuestions: { qid: qid } }
                };
                existingUser.votedQuestions[index].voteStatus = 'NONE';
                
                await existingUser.save();
                
            }
            else if(existingVote.voteStatus === 'DOWNVOTE' && status === 'downvote') {
                update = { $inc: { voteCount: 1 } };
                
                existingUser.votedQuestions[index].voteStatus = 'NONE';
                await existingUser.save();

                votedUpdate = { 
                    $pull: { votedQuestions: { qid: qid } }
                };
            }
            else if (existingVote.voteStatus === 'UPVOTE' && status === 'downvote') {
                update = { $inc: { voteCount: -1 } };
                
                existingUser.votedQuestions[index].voteStatus = 'NONE';
                await existingUser.save();
                
                votedUpdate = { 
                    $pull: { votedQuestions: { qid: qid } }
                };
            }
            else if(existingVote.voteStatus === 'DOWNVOTE' && status === 'upvote'){
                update = { $inc: { voteCount: 1 } };
                
                existingUser.votedQuestions[index].voteStatus = 'NONE';
                await existingUser.save();

                votedUpdate = { 
                    $pull: { votedQuestions: { qid: qid } }
                };
            }
            else {
                return res.status(400).json({ error: "Bad Request" });
            }

        }
        const updatedQuestion = await Question.findByIdAndUpdate(
            qid,
            update,
            { new: true }
        );
        await User.findByIdAndUpdate(
            currentUser._id,
            votedUpdate,
            { new: true }
        );

        res.send(updatedQuestion);
    } catch (error) {
        res.status(500).json({ error: { message: "Internal server error", status: 500 } });
    }
    
};

// Upvote or downvote an answer
const voteAnswer = async (req, res) => {
    try {
        const { aid } = req.params;
        const { status } = req.body;

        let update;
        let votedUpdate;
        
        const currentUser = req.session["currentUser"]; 
        if (!currentUser) {
            return res.status(403).json({ error: "Forbidden" });
        }
        
        const existingUser = await User.findOne({ username: currentUser.username });

        let hasVoted = false;
        let index = -1;
        for (let i = 0; i < existingUser.votedAnswers.length; i++) {
            const votedAnswer = existingUser.votedAnswers[i];
            if (votedAnswer.aid.toString() === aid) {
                hasVoted = true;
                index = i; 
                break;
            }
        }
        
        
        if (!hasVoted) {
            if (index === -1 && (status === 'upvote' || status === 'downvote')) {
                update = status === 'upvote' ? { $inc: { voteCount: 1 } } : { $inc: { voteCount: -1 } };
                votedUpdate = { $addToSet: { votedAnswers: { aid, voteStatus: status.toUpperCase() } } };
            } 
        }
        else {
            const existingVote = existingUser.votedAnswers[index];
            if (existingVote.voteStatus === 'UPVOTE' && status === 'upvote'){
                update = { $inc: { voteCount: -1 } };
                
                existingUser.votedAnswers[index].voteStatus = 'NONE';
                await existingUser.save();

                votedUpdate = { 
                    $pull: { votedAnswers: { aid: aid } }
                };
            }
            else if(existingVote.voteStatus === 'DOWNVOTE' && status === 'downvote') {
                update = { $inc: { voteCount: 1 } };
                
                existingUser.votedAnswers[index].voteStatus = 'NONE';
                await existingUser.save();

                votedUpdate = { 
                    $pull: { votedAnswers: { aid: aid } }
                };
            }
            else if (existingVote.voteStatus === 'UPVOTE' && status === 'downvote') {
                update = { $inc: { voteCount: -1 } };
                
                existingUser.votedAnswers[index].voteStatus = 'NONE';
                await existingUser.save();

                votedUpdate = { 
                    $pull: { votedAnswers: { aid: aid } }
                };
            }
            else if(existingVote.voteStatus === 'DOWNVOTE' && status === 'upvote'){
                update = { $inc: { voteCount: 1 } };
                
                existingUser.votedAnswers[index].voteStatus = 'NONE';
                await existingUser.save();

                votedUpdate = { 
                    $pull: { votedAnswers: { aid: aid } }
                };
            }
            else {
                return res.status(400).json({ error: "Bad Request" });
            }
        }

        const updatedAnswer = await Answer.findByIdAndUpdate(
            aid,
            update,
            { new: true }
        );
        
        await User.findByIdAndUpdate(
            currentUser._id,
            votedUpdate,
            { new: true }
        );

        res.send(updatedAnswer);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

router.post('/voteQuestion/:qid', voteQuestion);
router.post('/voteAnswer/:aid', voteAnswer);
module.exports = router;