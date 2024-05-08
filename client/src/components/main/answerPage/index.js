import { useEffect, useState } from "react";
import AnswerHeader from "./header";
import "./index.css";
import { getQuestionById } from "../../../services/questionService";
import AnswerSection from "./answerSection";
import QuestionSection from "./questionSection";

const AnswerPage = ({ qid, handleNewQuestion, handleNewAnswer, currentUser, handleQuestions }) => {
    const [question, setQuestion] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            try {
                let res = await AnswerPage.getQuestionById(qid, false);
                setQuestion(res || {});
            } catch (error) {
                console.error("Error fetching question data:", error);
            }
        };
        fetchData().catch((e) => console.log(e));
    }, [qid]);

    const reloadData = async () => {
        const updatedQuestion = await getQuestionById(qid, true);
        setQuestion(updatedQuestion || {});
    }

    return (
        <>
            <AnswerHeader
                ansCount={
                    question && question.answers && question.answers.length
                }
                title={question && question.title}
                handleNewQuestion={handleNewQuestion}
            />
            <QuestionSection 
                qid={qid} 
                question={question} 
                reloadData={reloadData} 
                currentUser={currentUser} 
                handleQuestions={handleQuestions}
            />
            <h2 className="answer_heading">Answers</h2>
            
            {question &&
                question.answers &&
                question.answers.map((a, idx) => (
                    <AnswerSection 
                        key={idx} 
                        aid={a._id} 
                        answer={a} 
                        reloadData={reloadData} 
                        currentUser={currentUser}
                    />
            ))}
            <button
                className="bluebtn ansButton"
                onClick={() => {
                    handleNewAnswer();
                }}
            >
                Answer Question
            </button>
        </>
    );
};

AnswerPage.getQuestionById = getQuestionById;
export default AnswerPage;
