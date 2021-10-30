import { authHeader } from '../_helpers';
import config from '../config';
import { handleResponse } from '../_helpers';

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
function create (zoneName, owner, api, searchParameters) {
    return fetch(`${config.apiUrl}/zones`,{
        method: "POST", 
        headers: authHeader({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({zoneName,owner, api, searchParameters})            
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