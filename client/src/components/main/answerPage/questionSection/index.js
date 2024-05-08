import { useEffect, useState } from "react";
import { addCommentQuestion } from "../../../../services/commentService";
import { getMetaData } from "../../../../tool";
import CommentArea from "../../baseComponents/commentArea";
import CommentSection from "../commentSection";
import QuestionBody from "../questionBody";
import VoteBody from "../vote";
import "./index.css";


const QuestionSection = ({ qid, question, reloadData, currentUser, handleQuestions }) => {

    const [commentQText, setCommentQText] = useState("");
    const [textErr, setTextErr] = useState("");
    const [alertQ, setAlertQ]= useState("");
    const [reportedQ, setReportedQ] = useState(false);

    useEffect(() => {
        setReportedQ(question.reported || false);
    })

    const handleCommentQuestion = async () => {
        if (!commentQText) {
            setTextErr("Comment text cannot be empty");
            return;
        }
        const comment = {
            text: commentQText,
            comment_date_time: new Date(),
        };

        try {
            await QuestionSection.addCommentQuestion(qid, comment);
            reloadData();
            setCommentQText(""); 
        }
        catch(error) {
            console.error("Error adding comment:", error);
        }   
    }

    const handleAlertQ = () => {
        setAlertQ("Please login to comment on this question.");
    }

    return (
        <div className="question_end">
            <QuestionBody
                views={question && question.views}
                text={question && question.text}
                askby={question && question.asked_by && question.asked_by.user_name}
                meta={question && getMetaData(new Date(question.ask_date_time))}
            />
            <VoteBody 
                qid={qid} 
                voteCount={question.voteCount} 
                reloadData={reloadData} 
                currentUser={currentUser}
                reportedQ={reportedQ}
                setReportedQ={setReportedQ}
                handleQuestions={handleQuestions}
            />
            <div className="comment_section">
                <CommentArea
                    text={commentQText}
                    setText={setCommentQText}
                    err={textErr}
                    handleAddComment={handleCommentQuestion}
                    handleAlert={handleAlertQ}
                    currentUser={currentUser}
                />
                {alertQ ? (
                    <div className="alertBox">
                        {alertQ}
                    </div>
                ) : ""}
                {question &&
                    question.comments && (
                        <CommentSection comments={question.comments}/>
                )}
            </div>
        </div>
    );
}

QuestionSection.addCommentQuestion = addCommentQuestion;
export default QuestionSection;