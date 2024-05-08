import { getMetaData } from "../../../../tool";
import Comment from "../comment";
import "./index.css";


const CommentSection = ({ comments }) => (
    <div className="comments_end">
        {comments.map((comment, idx) => (
            <Comment
                key={idx}
                text={comment.text}
                commentBy={comment.comment_by.user_name}
                meta={getMetaData(new Date(comment.comment_date_time))}
            />
        ))}
    </div>
);

export default CommentSection;