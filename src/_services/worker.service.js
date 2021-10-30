import { authHeader } from '../_helpers';
import config from '../config';
import { history } from '../_helpers';

export const workerService = {
    filter,
    create,
    update,
    delete: _delete
};
function filter(searchParameters) {
    const requestOptions = {
        method: 'POST',
        headers: authHeader(),
        body: JSON.stringify(searchParameters)
    };
    return fetch(`${config.apiUrl}/workers/search`, requestOptions).then(handleResponse);
}
function create(user,filters) {
    const requestOptions = {
        method: 'POST',
        headers: authHeader(),
        body: JSON.stringify({user,filters})
    };
    return fetch(`${config.apiUrl}/workers`, requestOptions).then(handleResponse);
}
function update(data) {
    const requestOptions = {
        method: 'PUT',
        headers: authHeader(),
        body: JSON.stringify(data)
    };
    return fetch(`${config.apiUrl}/users`, requestOptions).then(handleResponse);
}
function _delete(username,filters) {
    return fetch(`${config.apiUrl}/workers/${username}`,{
        method: "DELETE",
        headers: authHeader({ 'Content-Type': 'application/json' }),
        body:  JSON.stringify(filters)    
        }).then(handleResponse) 
}
function logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('user');
    history.push("/login")
}

function handleResponse(response) {
    return response.text().then(text => {
        const data = text && JSON.parse(text);
        if (!response.ok) {
            if (response.status === 401) {
                // auto logout if 401 response returned from api
                localStorage.clear();
                logout();
                //location.reload(true);
            }
            const error = (data && data.message) || response.statusText;
            const code = (data && data.code) || response.status;
            const result = {
                code,
                message: error
                
            }
            const qr = data && data.qr ? data.qr : null
            if(qr){
                result.qr = qr; 
            }
            return Promise.reject(result);
        }

        return data;
    });
}