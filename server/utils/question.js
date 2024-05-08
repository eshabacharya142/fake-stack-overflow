const Tag = require("../models/tags");
const Question = require("../models/questions");
// const Answer = require("../models/answers");

const addTag = async (tname) => {
    let existingTag = await Tag.findOne({ name: tname });
    if (existingTag) {
        return existingTag._id;
    }
    else {
        let newTag = Tag({
            name: tname
        });
        let savedTag = await newTag.save();
        return savedTag._id;
    }
    
    // return 'complete addTag';
};

const getQuestionsByOrder = async (order, currentUser) => {
    
    const decodedOrder = decodeURIComponent(order).toLowerCase();
    
    let qlist = [];
    if (decodedOrder == "active") {
        qlist = await getActiveQuestion();
    } else if (decodedOrder == "unanswered") {
        qlist = await getUnansweredQuestion();
    } else if (decodedOrder == "newest"){
        qlist = await getNewestQuestion();
    }
    if(currentUser && currentUser.role == "ADMIN") {
        if (decodedOrder == "reported questions") {
            qlist = await getReportedQuestion();
        }
        else if (decodedOrder == "reported answers") {
            qlist = await getReportedAnswer();
        }
    }
    return qlist;
}

const filterQuestionsBySearch = (qlist, search) => {


    let searchTags = parseTags(search.toString().toLowerCase());
    let searchKeyword = parseKeyword(search.toString().toLowerCase());
    const res = qlist.filter((q) => {
        if (searchKeyword.length == 0 && searchTags.length == 0) {
            return true;
        } else if (searchKeyword.length == 0) {
            return checkTagInQuestion(q, searchTags);
        } else if (searchTags.length == 0) {
            return checkKeywordInQuestion(q, searchKeyword);
        } else {
            return (
                checkKeywordInQuestion(q, searchKeyword) ||
                checkTagInQuestion(q, searchTags)
            );
        }
    });

    return res;

}

const getNewestQuestion = async () => {
    let newest = await Question.find().populate('answers').populate('tags');
    return newest.sort((a, b) => b.ask_date_time - a.ask_date_time);
};

const getUnansweredQuestion = async () => {
    let questions = await Question.find().populate('answers').populate('tags');
    return questions.filter((q) => q.answers.length === 0).sort((a, b) => b.ask_date_time - a.ask_date_time);
};

const getActiveQuestion = async () => {
    let questions = await Question.find().populate('answers').populate('tags');
    let active = questions.sort((a, b) => {
        const aLatestAnswerDate = a.answers.length > 0 ? Math.max(...a.answers.map(ans => ans.ans_date_time)) : new Date(0);
        const bLatestAnswerDate = b.answers.length > 0 ? Math.max(...b.answers.map(ans => ans.ans_date_time)) : new Date(0);
        return bLatestAnswerDate - aLatestAnswerDate || b.ask_date_time - a.ask_date_time;
    });
    return active;
};

const getReportedQuestion = async () => {
    let questions = await Question.find().populate('answers').populate('tags');
    let reportedQuestions = questions.filter(q =>
        q.reported === true
    );
    reportedQuestions.sort((a, b) => b.ask_date_time - a.ask_date_time);
    return reportedQuestions;
}

const getReportedAnswer = async () => {
    let questions = await Question.find().populate('answers').populate('tags');
    let reportedQuestions = questions.filter(q =>
        q.answers.some(a => a.reported === true)
    );
    reportedQuestions.sort((a, b) => b.ask_date_time - a.ask_date_time);
    return reportedQuestions;
}

const checkKeywordInQuestion = (q, keywordlist) => {
    for (let w of keywordlist) {
        if (q.title.toLowerCase().includes(w) || q.text.toLowerCase().includes(w)) {
            return true;
        }
    }

    return false;
};

const checkTagInQuestion = (q, taglist) => {
    const questionTagNames = q.tags.map(tag => tag.name);
    const tagFound = taglist.some(tag => questionTagNames.includes(tag));

    return tagFound;
};

const parseTags = (search) => {
    return (search.match(/\[([^\]]+)\]/g) || []).map((word) =>
        word.slice(1, -1)
    );
};

const parseKeyword = (search) => {
    return search.replace(/\[([^\]]+)\]/g, " ").match(/\b\w+\b/g) || [];
};


module.exports = { addTag, getQuestionsByOrder, filterQuestionsBySearch };
  