import "./index.css";
import { useState } from "react";
import SideBarNav from "./sideBarNav";
import QuestionPage from "./questionPage";
import TagPage from "./tagPage";
import AnswerPage from "./answerPage";
import NewQuestion from "./newQuestion";
import NewAnswer from "./newAnswer";
import LoginPage from "./userLoginPage";
import RegisterPage from "./userRegisterPage";
import ProfilePage from "./userProfilePage";
import { logout, profile } from "../../services/userService";

const Main = ({ search = "", title, setQuesitonPage }) => {
    const [page, setPage] = useState("home");
    const [questionOrder, setQuestionOrder] = useState("newest");
    const [currentUser, setCurrentUser] = useState(null);
    const [qid, setQid] = useState("");
    let selected = "";
    let content = null;

    const fetchUserProfile = async () => {
        try {
            const res = await profile();
            setCurrentUser(res);
        } catch (error) {
            console.error("Error fetching profile:", error);
        }
    };

    const handleQuestions = () => {
        setQuesitonPage();
        setPage("home");
    };

    const handleTags = () => {
        setPage("tag");
    };

    const handleLogin = () => {
        setPage("login");
    }

    const handleRegister = () => {
        setPage("register");
    };

    const handleProfile = () => {
        setPage("profile");
    };

    const handleLogout = () => {
        logout();
        setCurrentUser(null);
        setQuestionOrder("newest");
        setPage("home");  
    };

    const handleAnswer = (qid) => {
        setQid(qid);
        setPage("answer");
    };

    const clickTag = (tname) => {
        setQuesitonPage("[" + tname + "]", tname);
        setPage("home");
    };

    const handleNewQuestion = () => {
        currentUser ? setPage("newQuestion") : setPage("login");
    };

    const handleNewAnswer = () => {
        currentUser? setPage("newAnswer") : setPage("login");
    };

    const getQuestionPage = (order = "newest", search = "") => {
        return (
            <QuestionPage
                title_text={title}
                order={order}
                search={search}
                setQuestionOrder={setQuestionOrder}
                clickTag={clickTag}
                handleAnswer={handleAnswer}
                handleNewQuestion={handleNewQuestion}
                currentUser={currentUser}
            />
        );
    };

    switch (page) {
        case "home": {
            selected = "q";
            content = getQuestionPage(encodeURIComponent(questionOrder.toLowerCase()), search);
            break;
        }
        case "tag": {
            selected = "t";
            content = (
                <TagPage
                    clickTag={clickTag}
                    handleNewQuestion={handleNewQuestion}
                />
            );
            break;
        }
        case "register": {
            selected = "r";
            content = (
                <RegisterPage
                    handleLogin={handleLogin}
                />
            );
            break;
        }
        case "profile": {
            selected = "p";
            content = (
                <ProfilePage
                    currentUser={currentUser}
                />
            );
            break;
        }
        case "answer": {
            selected = "";
            content = (
                <AnswerPage
                    qid={qid}
                    handleNewQuestion={handleNewQuestion}
                    handleNewAnswer={handleNewAnswer}
                    currentUser={currentUser}
                    handleQuestions={handleQuestions}
                />
            );
            break;
        }
        case "newQuestion": {
            selected = "";
            content = <NewQuestion handleQuestions={handleQuestions} />;
            break;
        }
        case "newAnswer": {
            selected = "";
            content = <NewAnswer qid={qid} handleAnswer={handleAnswer} />;
            break;
        }
        case "login": {
            selected = "l";
            content = <LoginPage handleQuestions={handleQuestions} fetchUserProfile={fetchUserProfile}/>;
            break;
        }
        default:
            selected = "q";
            content = getQuestionPage();
            break;
    }

    return (
        <div id="main" className="main">
            <SideBarNav
                selected={selected}
                currentUser={currentUser}
                handleQuestions={handleQuestions}
                handleTags={handleTags}
                handleLogin={handleLogin}
                handleRegister={handleRegister}
                handleProfile={handleProfile}
                handleLogout={handleLogout}
            />
            <div id="right_main" className="right_main">
                {content}
            </div>
        </div>
    );
};

export default Main;
