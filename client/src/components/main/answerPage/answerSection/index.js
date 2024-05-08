import { useState } from "react";
import { addCommentAnswer } from "../../../../services/commentService";
import { getMetaData } from "../../../../tool";
import CommentArea from "../../baseComponents/commentArea";
import Answer from "../answer";
import CommentSection from "../commentSection";
import VoteBody from "../vote";
import "./index.css";


const AnswerSection = ({ aid, answer, reloadData, currentUser }) => {
    const [commentAText, setCommentAText] = useState("");
    const [textErr, setTextErr] = useState("");
    const [alertA, setAlertA]= useState("");
    const [reportedA, setReportedA] = useState(answer.reported);

    const handleCommentAnswer = async () => {

        if (!commentAText) {
            setTextErr("Comment text cannot be empty");
            return;
        }
        const comment = {
            text: commentAText,
            comment_date_time: new Date(),
        };

        try {
            await AnswerSection.addCommentAnswer(aid, comment);
            reloadData();
            setCommentAText(""); 
        }
        catch(error) {
            console.error("Error adding comment:", error);
        }
    }

    const handleAlertA = () => {
        setAlertA("Please login to comment on this answer.");
    }

    return (
        <div className="answer_section">
            <Answer
                text={answer.text}
                ansBy={answer.ans_by.user_name}
                meta={getMetaData(new Date(answer.ans_date_time))}
            />
            <VoteBody 
                aid={aid} 
                voteCount={answer.voteCount} 
                reloadData={reloadData} 
                currentUser={currentUser}  
                reportedA={reportedA}
                setReportedA={setReportedA}
            />
            <div className="comment_section">
                <CommentArea
                        text={commentAText}
                        setText={setCommentAText}
                        err={textErr}
                        handleAddComment={handleCommentAnswer}
                        handleAlert={handleAlertA}
                        currentUser={currentUser}
                    />
                    {alertA ? (
                        <div className="alertBox">
                            {alertA}
                        </div>
                    ) : ""}
                    {answer &&
                        answer.comments && (
                            <CommentSection comments={answer.comments}/>
                    )}
            </div>
        </div>
)};

AnswerSection.addCommentAnswer = addCommentAnswer;
export default AnswerSection;