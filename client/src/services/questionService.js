import { REACT_APP_API_URL, api } from "./config";

const QUESTION_API_URL = `${REACT_APP_API_URL}/question`;

const getQuestionsByFilter = async (order = "newest", search = "") => {
    const res = await api.get(
        `${QUESTION_API_URL}/getQuestion?order=${order}&search=${search}`
    );
    return res.data;
};

const getQuestionById = async (qid, status) => {
    const res = await api.get(`${QUESTION_API_URL}/getQuestionById/${qid}?status=${status}`);
    return res.data;
};

const addQuestion = async (q) => {
    const res = await api.post(`${QUESTION_API_URL}/addQuestion`, q);
    return res.data;
};

const reportedQuestions = async (qid) => {
    const res = await api.post(`${QUESTION_API_URL}/reportQuestion/${qid}`);
    return res.data;
}

const deleteQuestion = async (qid) => {
    await api.post(`${QUESTION_API_URL}/admin/deleteQuestion/${qid}`);
}

export { getQuestionsByFilter, getQuestionById, addQuestion, reportedQuestions, deleteQuestion };
