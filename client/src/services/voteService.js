import { REACT_APP_API_URL, api } from "./config";

const VOTE_API_URL = `${REACT_APP_API_URL}/vote`;

// To vote on question
const voteQuestion = async (qid, status) => {
    const res = await api.post(`${VOTE_API_URL}/voteQuestion/${qid}`, {status: status});

    return res.data;
};

// To vote on answer
const voteAnswer = async (aid, status) => {
    const res = await api.post(`${VOTE_API_URL}/voteAnswer/${aid}`, {status: status});

    return res.data;
};

export { voteQuestion, voteAnswer };