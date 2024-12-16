import axios from "axios"

export const getAllUsers = async (serverUrl, token) => {
    let final = [];
    await axios.get(`${serverUrl}/php/index.php/api/users`, { headers: { Authorization: `Bearer ${token}` } }).then((res) => {
        final = res.data.data;
    });
    return final;
}

export const getAppRoles = async (serverUrl, token) => {
    let final = [];
    await axios.get(`${serverUrl}/php/index.php/api/roles`, { headers: { Authorization: `Bearer ${token}` } }).then((res) => {
        final = res.data.data;
    });
    return final;
}

export const getUserDetails = async (serverUrl, token, user_id) => {
    let final = [];
    await axios.get(`${serverUrl}/php/index.php/api/users/${user_id}`, { headers: { Authorization: `Bearer ${token}` } }).then((res) => {
        final = res.data.data;
    });
    return final;
}
