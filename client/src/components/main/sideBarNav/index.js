import "./index.css";

const SideBarNav = ({ selected = "", currentUser, handleQuestions, handleTags,  handleLogin, handleRegister, handleProfile, handleLogout }) => {
    return (
        <div id="sideBarNav" className="sideBarNav">
            <div
                id="menu_question"
                className={`menu_button ${
                    selected === "q" ? "menu_selected" : ""
                }`}
                onClick={() => {
                    handleQuestions();
                }}
            >
                Questions
            </div>
            <div
                id="menu_tag"
                className={`menu_button ${
                    selected === "t" ? "menu_selected" : ""
                }`}
                onClick={() => {
                    handleTags();
                }}
            >
                Tags
            </div>
            {
                currentUser ? (
                    <>
                        <div
                            id="menu_profile"
                            className={`menu_button ${
                                selected === "p" ? "menu_selected" : ""
                            }`}
                            onClick={() => {
                                handleProfile();
                            }}
                        >
                            Profile
                        </div>
                        <div
                            id="menu_logout"
                            className={`menu_button ${
                                selected === "x" ? "menu_selected" : ""
                            }`}
                            onClick={() => {
                                handleLogout();
                            }}
                        >
                            Logout
                        </div>
                    </>
                ) : (
                    <>
                        <div
                            id="menu_login"
                            className={`menu_button ${
                                selected === "l" ? "menu_selected" : ""
                            }`}
                            onClick={() => {
                                handleLogin();
                            }}
                        >
                            Login
                        </div>
                        <div
                            id="menu_register"
                            className={`menu_button ${
                                selected === "r" ? "menu_selected" : ""
                            }`}
                            onClick={() => {
                                handleRegister();
                            }}
                        >
                            Register
                        </div>
                    </>
                )
            }
        </div>
    );
};

export default SideBarNav;
