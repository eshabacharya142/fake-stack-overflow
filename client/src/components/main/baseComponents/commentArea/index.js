import "./index.css";

const CommentArea = ({ text, setText, err, handleAddComment, handleAlert, currentUser }) => {

    return (
        <div className="comment_input">
            <textarea
                rows={3}
                cols={100}
                type="text"
                value={text}
                onInput={(e) => {
                    setText(e.target.value);
                }}
                placeholder="Write a comment"
            />
            {err && <div className="input_error">{err}</div>}
            <button className="add_comment_button" onClick={currentUser? handleAddComment : handleAlert}>Add Comment</button>
        </div>
    );
};

export default CommentArea;
