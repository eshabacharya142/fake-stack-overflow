import { REACT_APP_API_URL, api } from "./config";

const ANSWER_API_URL = `${REACT_APP_API_URL}/answer`;

// To add answer
const addAnswer = async (qid, ans) => {
    const data = { qid: qid, ans: ans };
    const res = await api.post(`${ANSWER_API_URL}/addAnswer`, data);

    return res.data;
};

//To Report Answers
const reportedAnswers = async (aid) => {
    const res = await api.post(`${ANSWER_API_URL}/reportAnswer/${aid}`);
    return res.data;
}

//To Delete Answers
const deleteAnswer = async (aid) => {
    await api.post(`${ANSWER_API_URL}/admin/deleteAnswer/${aid}`);
}


export { addAnswer, reportedAnswers, deleteAnswer };
