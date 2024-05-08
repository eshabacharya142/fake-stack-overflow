import { voteAnswer, voteQuestion } from "../../../../services/voteService";
import "./index.css";
import { deleteQuestion, reportedQuestions } from "../../../../services/questionService";
import { deleteAnswer, reportedAnswers } from "../../../../services/answerService";

const VoteBody = ({ qid, aid, voteCount, reloadData, currentUser, 
    reportedQ, setReportedQ, reportedA, setReportedA, handleQuestions }) => {

    const handleUpvote  = async () => {
        try {
            if (qid) {
                await VoteBody.voteQuestion(qid, 'upvote');
                reloadData();
            }
            else {
                await VoteBody.voteAnswer(aid, 'upvote');
                reloadData();
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleDownvote = async () => {
        try {
            if (qid) {
                await VoteBody.voteQuestion(qid, 'downvote');
                reloadData();
            } 
            else {
                await VoteBody.voteAnswer(aid, 'downvote');
                reloadData();
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleReport = async () => {
        try {
            if (qid) {
                await VoteBody.reportedQuestions(qid);
                setReportedQ(true);
                reloadData();
            }
            else {
                await VoteBody.reportedAnswers(aid);
                setReportedA(true);
                reloadData();
            }
        } catch (error) {
            console.error(error);
        }
    }

    const handleDelete = async () => {
        try {
            if (qid) {
                await VoteBody.deleteQuestion(qid);
                handleQuestions();
            }
            else {
                await VoteBody.deleteAnswer(aid);
                setReportedA(false);
                reloadData();
            }
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div>
            <div id="voteBody" className="voteBody">
                <div className="voteCount">{voteCount} votes</div> 
                {currentUser ? (
                    <span>
                        <button className="voteBtn" onClick={handleUpvote}>↑</button> 
                        <button className="voteBtn" onClick={handleDownvote}>↓</button> 
                        { qid ? (
                            <button disabled={reportedQ} className="reportBtn" onClick={handleReport}>
                                {reportedQ ? "Reported" : "Report"}
                            </button>
                            
                        ) : (
                            <button disabled={reportedA} className="reportBtn" onClick={handleReport}>
                                {reportedA ? "Reported" : "Report"}
                            </button>
                        )}
                    </span>
                ) : "" }
            </div>
            <div>
                {currentUser && currentUser.role === "ADMIN" && reportedQ && (
                    <button className="deleteBtn" onClick={handleDelete}>
                        Delete Question
                    </button>
                )}
                {currentUser && currentUser.role === "ADMIN" && reportedA && (
                    <button className="deleteBtn" onClick={handleDelete}>
                        Delete Answer
                    </button>
                )}
            </div>
        </div>
    );
};

VoteBody.voteQuestion = voteQuestion;
VoteBody.voteAnswer = voteAnswer;
VoteBody.reportedQuestions = reportedQuestions;
VoteBody.reportedAnswers = reportedAnswers;
VoteBody.deleteQuestion = deleteQuestion;
VoteBody.deleteAnswer = deleteAnswer;

export default VoteBody;