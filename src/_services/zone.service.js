import { authHeader } from '../_helpers';
import config from '../config';
import { history } from '../_helpers';

export const zoneService = {
    create,
    updateOwner,
    delete : _delete,
    filter, 
    sync
};

function filter(searchParameters) {
    const requestOptions = {
        method: 'POST',
        headers: authHeader(),
        body: JSON.stringify(searchParameters)
    };
    return fetch(`${config.apiUrl}/zones/search`, requestOptions).then(handleResponse);
}
function updateOwner (zoneName, owner) {
    return fetch(`${config.apiUrl}/zones/${zoneName}/owner`,{
        method: "PUT", 
        headers: authHeader({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({owner})            
      }).then(handleResponse)             
}
function create (zoneName, owner, api, filters) {
    return fetch(`${config.apiUrl}/zones`,{
        method: "POST", 
        headers: authHeader({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({zoneName,owner, api, filters})            
    }).then(handleResponse)             
}
function sync (zoneName, owner, api, filters) {
    return fetch(`${config.apiUrl}/zones/sync`,{
        method: "POST", 
        headers: authHeader({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({zoneName,owner, api, filters})            
    }).then(handleResponse)             
}
function _delete (zoneName, filters) {
    return fetch(`${config.apiUrl}/zones/${zoneName}`,{
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