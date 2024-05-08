import { useState } from "react";
import Form from "../baseComponents/form";
import Input from "../baseComponents/input";
import { register } from "../../../services/userService";
import RadioButton from "../baseComponents/radioButton";
import Password from "../baseComponents/password";

const RegisterPage = ({ handleLogin }) => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [role, setRole] = useState("REGISTERED");

    const [firstNameErr, setFirstNameErr] = useState("");
    const [lastNameErr, setLastNameErr] = useState("");
    const [usernameErr, setUsernameErr] = useState("");
    const [passwordErr, setPasswordErr] = useState("");
    const [emailErr, setEmailErr] = useState("");
    const [registerErr, setRegisterErr] = useState("");

    const registerUser = async () => {
        let isValid = true;
        if (!firstName) {
            setFirstNameErr("First Name cannot be empty");
            isValid = false;
        }

        if (!lastName) {
            setLastNameErr("Last Name cannot be empty");
            isValid = false;
        }

        if (!username) {
            setUsernameErr("Username cannot be empty");
            isValid = false;
        }

        if (!password) {
            setPasswordErr("Password cannot be empty");
            isValid = false;
        }

        if (!email) {
            setEmailErr("Email cannot be empty");
            isValid = false;
        }

        if (!isValid) {
            return;
        }

        const user = {
            firstName: firstName,
            lastName: lastName,
            username: username,
            password: password,
            email: email,
            role: role
        };

        try {
            const res = await RegisterPage.register(user);
            if (res && res._id) {
                handleLogin();
            }
            else {
                setRegisterErr("Please choose a different username.")
            }
        }
        catch(error) {
            console.error("Error adding user:", error);
        }
        
    };

    return (
        <Form>
            <Input
                title={"First Name"}
                hint={"Add first name"}
                id={"formFirstNameInput"}
                val={firstName}
                setState={setFirstName}
                err={firstNameErr}
            />
            <Input
                title={"Last Name"}
                hint={"Add last name"}
                id={"formLastNameInput"}
                val={lastName}
                setState={setLastName}
                err={lastNameErr}
            />
            <Input
                title={"Username"}
                hint={"Add unique username"}
                id={"formUsernameInput"}
                val={username}
                setState={setUsername}
                err={usernameErr}
            />
             <Password
                title={"Password"}
                hint={"Add password"}
                id={"formPasswordInput"}
                val={password}
                setState={setPassword}
                err={passwordErr}
            />
            <Input
                title={"Email"}
                hint={"Add email"}
                id={"formEmailInput"}
                val={email}
                setState={setEmail}
                err={emailErr}
            />
            <RadioButton
                title={"Role"}
                hint={"Select a role"}
                id={"radiobutton"}
                role={role}
                options={['REGISTERED', 'ADMIN']}
                setRole={setRole}
            />
            
            <div className="btn_indicator_container">
                <button
                    className="form_postBtn"
                    onClick={() => {
                        registerUser();
                    }}
                >
                    Register
                </button>
                <div className="mandatory_indicator">
                    * indicates mandatory fields
                </div>
            </div>
            {
                registerErr ? (
                    <div className="loginError">{registerErr}</div>
                    ) : ""
            }
        </Form>
    );
};

RegisterPage.register = register;
export default RegisterPage;
