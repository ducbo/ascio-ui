import { authHeader } from '../_helpers';
import config from '../config';
import { history } from '../_helpers';

export const userTreeService = {
    getDescendants,
    getChildren
};

function getDescendants(user) {
    const requestOptions = { headers: authHeader() };
    return  fetch(`${config.apiUrl}/users/${user}/allsubusers`,requestOptions).then(handleResponse);
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