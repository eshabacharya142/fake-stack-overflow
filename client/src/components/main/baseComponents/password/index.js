import "./index.css";

const Password = ({ title, hint, id, mandatory = true, val, setState, err }) => {
    return (
        <>
            <div className="pwd_title">
                {title}
                {mandatory ? "*" : ""}
            </div>
            {hint && <div className="pwd_hint">{hint}</div>}
            <input
                id={id}
                className="pwd_input"
                type="password"
                value={val}
                onInput={(e) => {
                    setState(e.target.value);
                }}
            />
            {err && <div className="pwd_error">{err}</div>}
        </>
    );
};

export default Password;
