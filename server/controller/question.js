const express = require("express");
const Question = require("../models/questions");
const Answer = require("../models/answers");
const { addTag, getQuestionsByOrder, filterQuestionsBySearch } = require('../utils/question');

const router = express.Router();


const getQuestionsByFilter = async (req, res) => {
    const currentUser = req.session["currentUser"]; 
    let search = req.query.search;
    let order = req.query.order;
    let qlist = await getQuestionsByOrder(order, currentUser);
    let questionsList = await filterQuestionsBySearch(qlist, search);
    if (questionsList) {
        res.send(questionsList);
    }
    else {
        res.status(400).json({ error:{ message: `Questions not found`, status: 400} });
    }  
};


const getQuestionById = async (req, res) => {
    try {
        const qid = req.params.qid;
        const status = req.query.status === 'true';
        let updatedQues;

        if (status) {
            updatedQues = await Question.findById(qid).populate({
                path: 'answers',
                populate: { path: 'comments' }
            }).populate('comments');
        } else {
            updatedQues = await Question.findOneAndUpdate(
                { _id: qid },
                { $inc: { views: 1 } },
                { new: true }
            ).populate({
                path: 'answers',
                populate: { path: 'comments' }
            }).populate('comments');
        }

        if (!updatedQues) {
            return res.status(404).json({ error: { message: "Question not found", status: 404 } });
        }
        res.json(updatedQues);
    } catch (error) {
        res.status(500).json({ error: { message: "Internal server error", status: 500 } });
    }
};


const addQuestion = async (req, res) => {

    try {
        const { title, text, tags, answers, ask_date_time } = req.body;
        const currentUser = req.session["currentUser"]; 
        
        if (!currentUser) {
            return res.status(403).json({ error: "Forbidden" });
        }
        
        const addedTagIds = [];
        for (const tag of tags) {
            const addedTagId = await addTag(tag);
            addedTagIds.push(addedTagId);
        }
        let newQues = await Question.create({
            title: title,
            text: text,
            tags: addedTagIds,
            answers: answers,
            asked_by: {
                user_id: currentUser._id,
                user_name: currentUser.username,
            },
            ask_date_time: ask_date_time
        });
        res.send(newQues);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const reportQuestion = async (req, res) => {
    try {
        const qid = req.params.qid;
        const currentUser = req.session["currentUser"];
        
        if (!currentUser) {
            return res.status(403).json({ error: "Forbidden" });
        }
        const updatedQues = await Question.findOneAndUpdate(
            { _id: qid },
            { reported: true },
            { new: true }
        )
        
        if (!updatedQues) {
            return res.status(404).json({ error: { message: "Question not found", status: 404 } });
        }
        res.json(updatedQues);
    } catch (error) {
        res.status(500).json({ error: { message: "Internal server error", status: 500 } });
    }
}

const deleteReportedQuestion = async (req, res) => {
    try {
      const qid = req.params.qid;
      const currentUser = req.session["currentUser"];
      
        if (currentUser) {
            if(currentUser.role == 'ADMIN') {
            
                const question = await Question.findById(qid);
                
                if (!question) {
                    return res.status(404).json({ error: "Question not found" });
                }
    
                const answerIds = question.answers.map(answer => answer._id);
                
                if (answerIds.length > 0) {
                    await Answer.deleteMany({ _id: { $in: answerIds } });
                    await Question.deleteOne({ _id: qid });
                }
                else {
                    await Question.deleteOne({ _id: qid });
                }
    
                res.json("Question and associated answers deleted");
            }
            
            else  {
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


router.get('/getQuestion', getQuestionsByFilter);
router.get('/getQuestionById/:qid', getQuestionById);
router.post('/addQuestion', addQuestion);
router.post('/reportQuestion/:qid', reportQuestion);
router.post('/admin/deleteQuestion/:qid',deleteReportedQuestion);

module.exports = router;
