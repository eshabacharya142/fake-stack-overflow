import { REACT_APP_API_URL, api } from "./config";

const USER_API_URL = `${REACT_APP_API_URL}/user`;

const register = async (user) => {
    const res = await api.post(`${USER_API_URL}/register`, user);
    return res.data;
};

const login = async (username, password) => {
    const res = await api.post(`${USER_API_URL}/login`, {username: username, password:password});

    return res.data;
};

const logout = async () => {
    const res = await api.post(`${USER_API_URL}/logout`);
    return res.data;
};

const profile = async () => {
    const res = await api.post(`${USER_API_URL}/profile`);
    return res.data;
};

export { register, login, logout, profile };