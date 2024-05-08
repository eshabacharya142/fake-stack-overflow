const express = require("express");
const Answer = require("../models/answers");
const Question = require("../models/questions");

const router = express.Router();

// Adding answer
const addAnswer = async (req, res) => {
    try {
        const { text, ans_date_time } = req.body.ans;
        const currentUser = req.session["currentUser"]; 
        if (!currentUser) {
            return res.status(403).json({ error: "Forbidden" });
        }
        let newAnswer = await Answer.create({
            text: text,
            ans_by: {
                user_id: currentUser._id,
                user_name: currentUser.username,
            },
            ans_date_time: ans_date_time
        });
        let qid = req.body.qid;
        await Question.findOneAndUpdate(
            { _id: qid },
            { $push: { answers: { $each: [newAnswer._id], $position: 0 }}},
            { new: true }
        );
        res.send(newAnswer);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
const reportAnswer = async (req, res) => {
    try {
        const aid = req.params.aid;
        const currentUser = req.session["currentUser"];
        if (!currentUser) {
            return res.status(403).json({ error: "Forbidden" });
        }
        
        const updatedAns = await Answer.findOneAndUpdate(
            { _id: aid },
            { reported: true },
            { new: true }
        )
        
        if (!updatedAns) {
            return res.status(404).json({ error: { message: "Answer not found", status: 404 } });
        }
        res.json(updatedAns);
    } catch (error) {
        res.status(500).json({ error: { message: "Internal server error", status: 500 } });
    }
}

const deleteReportedAnswer = async (req, res) => {
    try {
      const aid = req.params.aid;
      const currentUser = req.session["currentUser"];
        if (currentUser) {
            if(currentUser.role == 'ADMIN') {
                await Answer.deleteOne({ _id: aid });
                res.json("Answer Deleted");
            } 
            else {
                return res.status(403).json({ error: "Forbidden to delete for registered users" });
            }     
        }
        else {
             return res.status(403).json({ error: "Forbidden" });
        }
        
  } catch (error) {
      res.status(500).json({ error: { message: "Internal server error", status: 500 } });
  }

}

// add appropriate HTTP verbs and their endpoints to the router.
router.post('/addAnswer', addAnswer);
router.post('/reportAnswer/:aid', reportAnswer);
router.post('/admin/deleteAnswer/:aid',deleteReportedAnswer);

module.exports = router;
