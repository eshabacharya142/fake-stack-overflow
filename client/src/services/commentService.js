import { REACT_APP_API_URL, api } from "./config";

const COMMENT_API_URL = `${REACT_APP_API_URL}/comment`;

// To add comment on question
const addCommentQuestion = async (qid, comment) => {
    const data = { qid: qid, comment: comment };
    const res = await api.post(`${COMMENT_API_URL}/addCommentOnQuestion`, data);

    return res.data;
};

// To add comment on answer
const addCommentAnswer = async (aid, comment) => {
    const data = { aid: aid, comment: comment };
    const res = await api.post(`${COMMENT_API_URL}/addCommentOnAnswer`, data);

    return res.data;
};

export { addCommentQuestion, addCommentAnswer };
