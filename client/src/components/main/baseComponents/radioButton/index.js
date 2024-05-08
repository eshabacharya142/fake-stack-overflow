import { useState } from "react";
import "./index.css";

const RadioButton = ({ id, title, hint, role, options, setRole, mandatory = true }) => {

    const [selectedOption, setSelectedOption] = useState(role);
    const handleOptionChange = (event) => {
        setSelectedOption(event.target.value);
        setRole(event.target.value);
    };

    return (
        <>
            <div className="radio_title">
                {title}
                {mandatory ? "*" : ""}
            </div>
            {hint && <div className="radio_hint">{hint}</div>}
            <div id={id} className="radio-container">
                <div>
                    <input
                    type="radio"
                    id="option1"
                    value={options[0]}
                    checked={selectedOption === options[0]}
                    onChange={handleOptionChange}
                    />
                    <label htmlFor="option1">{options[0]}</label>
                </div>
                <div>
                    <input
                    type="radio"
                    id="option2"
                    value={options[1]}
                    checked={selectedOption === options[1]} 
                    onChange={handleOptionChange}
                    />
                    <label htmlFor="option2">{options[1]}</label>
                </div>
            </div>
        </>
    );
};

export default RadioButton;
