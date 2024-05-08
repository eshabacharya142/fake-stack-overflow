import "./index.css";
import { useState } from "react";
import Form from "../baseComponents/form";
import Input from "../baseComponents/input";
import { login } from "../../../services/userService";
import Password from "../baseComponents/password";

const LoginPage = ({ handleQuestions, fetchUserProfile }) => {
    const [usrn, setUsrn] = useState("");
    const [pwd, setPwd] = useState("");
    const [usrnErr, setUsrnErr] = useState("");
    const [pwdErr, setPwdErr] = useState("");
    const [loginErr, setLoginErr] = useState("");

    const loginUser = async () => {
        let isValid = true;

        if (!usrn) {
            setUsrnErr("Username cannot be empty");
            isValid = false;
        }

        if (!pwd) {
            setPwdErr("Password cannot be empty");
            isValid = false;
        }

        if (!isValid) {
            return;
        }

        try {
            const res = await LoginPage.login(usrn, pwd);
            if (res) {
                handleQuestions();
                fetchUserProfile();
            }
            else {
                setLoginErr("Please enter valid credentials.");
            }
        }
        catch(error) {
            console.error("Error logging in:", error);
        }
        
    };
    return (
        <Form>
            <Input
                title={"Username"}
                id={"formUsernameInput"}
                val={usrn}
                setState={setUsrn}
                err={usrnErr}
            />
            <Password
                title={"Password"}
                id={"formPasswordInput"}
                val={pwd}
                setState={setPwd}
                err={pwdErr}
            />
            <div className="btn_indicator_container">
                <button
                    className="form_postBtn"
                    onClick={() => {
                        loginUser();
                    }}
                >
                    Login
                </button>
            </div>
            {
                loginErr ? (
                <div className="loginError">{loginErr}</div>
                ) : ""
            }
        </Form>
    );
};

LoginPage.login = login;
export default LoginPage;