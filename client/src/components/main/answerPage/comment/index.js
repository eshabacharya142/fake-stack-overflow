import { handleHyperlink } from "../../../../tool";
import "./index.css";

// Component for the Answer Page
const Comment = ({ text, commentBy, meta }) => {
    return (
        <div className="comment right_padding">
            <div id="commentText" className="commentText">
                {handleHyperlink(text)}
            </div>
            <div className="commentAuthor">
                <div className="comment_author">{commentBy}</div>
                <div className="comment_question_meta">{meta}</div>
            </div>
        </div>
    );
};

export default Comment;