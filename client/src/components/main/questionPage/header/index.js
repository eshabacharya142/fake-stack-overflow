import "./index.css";
import OrderButton from "./orderButton";

const QuestionHeader = ({
    title_text,
    qcnt,
    setQuestionOrder,
    handleNewQuestion,
    currentUser
}) => {
    return (
        <div>
            <div className="space_between right_padding">
                <div className="bold_title">{title_text}</div>
                <button
                    className="bluebtn"
                    onClick={() => {
                        handleNewQuestion();
                    }}
                >
                    Ask a Question
                </button>
            </div>
            <div className="space_between right_padding">
                <div id="question_count">{qcnt} questions</div>
                <div className="btns">
                    {currentUser && currentUser.role === "ADMIN" ? (
                        ["Newest", "Active", "Unanswered", "Reported Questions", "Reported Answers"].map((m, idx) => (
                            <OrderButton
                                key={idx}
                                message={m}
                                setQuestionOrder={setQuestionOrder}
                            />
                        ))
                    ) : (
                        ["Newest", "Active", "Unanswered"].map((m, idx) => (
                            <OrderButton
                                key={idx}
                                message={m}
                                setQuestionOrder={setQuestionOrder}
                            />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default QuestionHeader;
