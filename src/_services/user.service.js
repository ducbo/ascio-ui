import { authHeader } from '../_helpers';
import config from '../config';
import { history } from '../_helpers';

export const userService = {
    login,
    reAuth,
    logout,
    register,
    getAll,
    getById,
    update,
    activate2fa,
    force2fa,
    getQR,
    updatePassword,
    verifyUserToken,
    resetPassword,
    resetQR,
    verifyTotpCode,
    delete: _delete,
    filter,
    update,
    create
};
function filter(searchParameters) {
    const requestOptions = {
        method: 'POST',
        headers: authHeader(),
        body: JSON.stringify(searchParameters)
    };
    return fetch(`${config.apiUrl}/users/search`, requestOptions).then(handleResponse);
}
function create(user,filters) {
    const requestOptions = {
        method: 'POST',
        headers: authHeader(),
        body: JSON.stringify({user,filters})
    };
    return fetch(`${config.apiUrl}/users`, requestOptions).then(handleResponse);
}
function update(data) {
    const requestOptions = {
        method: 'PUT',
        headers: authHeader(),
        body: JSON.stringify(data)
    };
    return fetch(`${config.apiUrl}/users`, requestOptions).then(handleResponse);
}
function login(username, password,code, options) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, code, ...options })
    };

    return fetch(`${config.apiUrl}/users/authenticate`, requestOptions)
        .then(handleResponse)
        .then(user => {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            localStorage.setItem('user', JSON.stringify(user));
            return user;
        });
}
function reAuth() {
    const requestOptions = {
        method: 'POST',
        headers: authHeader({'Content-Type': 'application/json' }),
    };
    return fetch(`${config.apiUrl}/users/reauth`, requestOptions)
        .then(handleResponse)
        .then(user => {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            localStorage.setItem('user', JSON.stringify(user));
            return user;
        });
}
function getQR (username) { 
    const requestOptions = {
        headers: authHeader(),
    };
    return fetch(`${config.apiUrl}/users/${username}/qr`, requestOptions)
        .then(handleResponse)        
}
function resetQR (username) { 
    const requestOptions = {
        headers: authHeader(),
    };
    return fetch(`${config.apiUrl}/users/${username}/reset-qr`, requestOptions)
        .then(handleResponse)        
}
function resetPassword (username) { 
    const requestOptions = {
        headers: authHeader(),
    };
    return fetch(`${config.apiUrl}/users/${username}/reset-password`, requestOptions)
        .then(handleResponse)        
}
function verifyUserToken(username,token,code) {
    const requestOptions = {
        method:'POST',
        headers: authHeader({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({username, token,code})
    };
    return fetch(`${config.apiUrl}/users/${username}/password/verify-user-token`, requestOptions)
        .then(handleResponse)  
}
function updatePassword (username,token,password,code) { 
    const requestOptions = {
        method:'POST',
        headers: authHeader({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({token, password,code})
    };
    return fetch(`${config.apiUrl}/users/${username}/password`, requestOptions)
        .then(handleResponse)        
}
function activate2fa (status) { 
    const requestOptions = {
        method: 'POST',
        headers: authHeader({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({status})
    };
    return fetch(`${config.apiUrl}/users/activate2fa`, requestOptions)
        .then(handleResponse)        
}
function force2fa (level) { 
    const requestOptions = {
        method: 'POST',
        headers: authHeader({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({level})
    };
    return fetch(`${config.apiUrl}/users/force2fa`, requestOptions)
        .then(handleResponse)        
}
function verifyTotpCode (code) { 
    const requestOptions = {
        method: 'POST',
        headers: authHeader({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({code})
    };
    return fetch(`${config.apiUrl}/users/verifyTotpCode`, requestOptions)
        .then(handleResponse)        
}
function logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('user');
    history.push("/login")
}

function getAll() {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };

    return fetch(`${config.apiUrl}/users`, requestOptions).then(handleResponse);
}

function getById(id) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };

    return fetch(`${config.apiUrl}/users/${id}`, requestOptions).then(handleResponse);
}

function register(user) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
    };

    return fetch(`${config.apiUrl}/users/register`, requestOptions).then(handleResponse);
}


// prefixed function name with underscore because delete is a reserved word in javascript
function _delete(username,filters) {
    return fetch(`${config.apiUrl}/users/${username}`,{
        method: "DELETE",
        headers: authHeader({ 'Content-Type': 'application/json' }),
        body:  JSON.stringify(filters)    
      }).then(handleResponse) 
}

function handleResponse(response) {
    return response.text().then(text => {
        const data = text && JSON.parse(text);
        if (!response.ok) {
            if (response.status === 401) {
                // auto logout if 401 response returned from api
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