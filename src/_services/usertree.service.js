import { authHeader } from '../_helpers';
import config from '../config';
import { history } from '../_helpers';

export const userTreeService = {
    getDescendants,
    getChildren,
    refresh,
    getParents
};
function refresh(username,selected) {
    const requestOptions = { headers: authHeader(), method: "POST", body: JSON.stringify(selected || [])};
    return  fetch(`${config.apiUrl}/users/${username}/usertree`,requestOptions).then(handleResponse);
}
function getDescendants(user) {
    const requestOptions = { headers: authHeader() };
    return  fetch(`${config.apiUrl}/users/${user}/allsubusers`,requestOptions).then(handleResponse);
}
function getParents(user) {
    const requestOptions = { headers: authHeader() };
    return  fetch(`${config.apiUrl}/users/${user}/parents`,requestOptions).then(handleResponse);
}
function getChildren(user) {
    const requestOptions = { headers: authHeader() };
    return  fetch(`${config.apiUrl}/users/${user}/subusers`,requestOptions).then(handleResponse);
}
function handleResponse(response) {
    return response.text().then(text => {
        const data = text && JSON.parse(text);
        if (!response.ok) {
            if (response.status === 401) {
                logout();
            }

            const error = (data && data.message) || response.statusText;
            return Promise.reject(error);
        }
        return data;
    });
}
function logout() {
    localStorage.removeItem('user');
    history.push("/login")
}