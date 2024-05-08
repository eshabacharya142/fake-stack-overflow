const express = require("express");
const Tag = require("../models/tags");
const Question = require("../models/questions");

const router = express.Router();

const getTagsWithQuestionNumber = async (req, res) => {
    // res.json(['Complete the function']);
    try {
        const tagCount = {};
        let tags = await Tag.find();
        const questions = await Question.find().populate('tags');

        for (const tag of tags) {
            let filterQues = questions.filter(q => q.tags.some(qTag => qTag.name === tag.name));
            tagCount[tag.name] = filterQues.length;
        }

        const response = Object.keys(tagCount).map(name => ({ name, qcnt: tagCount[name] }));
        res.send(response);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// add appropriate HTTP verbs and their endpoints to the router.
router.get('/getTagsWithQuestionNumber', getTagsWithQuestionNumber);

module.exports = router;
