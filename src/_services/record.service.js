import { authHeader } from '../_helpers';
import config from '../config';
import { history } from '../_helpers';
const allFields = ["Id","Source","Target","TTL","Expire","HostmasterEmail","PrimaryNameServer","Refresh","Retry","SerialUsage","Priority","Weight","Port"]


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
            return Promise.reject(error);
        }

        return data;
    });
}
function logout() {  
    localStorage.removeItem('user');
    history.push("/login")
}