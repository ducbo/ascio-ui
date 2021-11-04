import { authHeader } from '../_helpers';
import config from '../config';
import { handleResponse } from '../_helpers';

export const recordService = {
    create,
    update,
    delete : _delete,
    getAll
};

function getAll(zoneName) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };
    return fetch(`${config.apiUrl}/zones/${zoneName}`, requestOptions).then(handleResponse);
}
function update (zoneName, formdata) {
    return fetch(`${config.apiUrl}/zones/${zoneName}/records`,{
        method: "PUT", 
        headers: authHeader({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(formdata)            
      }).then(handleResponse)             
}
function create (zoneName, formdata) {
    return fetch(`${config.apiUrl}/zones/${zoneName}/records`,{
        method: "POST", 
        headers: authHeader({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(formdata)            
      }).then(handleResponse)             
}
function _delete (zoneName, recordId) {
    return fetch(`${config.apiUrl}/zones/${zoneName}/records/${recordId}`,{
        method: "DELETE",
        headers: authHeader()       
      }).then(handleResponse)  
}
