import { authHeader } from '../_helpers';
import config from '../config';
import { history } from '../_helpers';

export const logService = {
    filter
};
async function filter (filters) {
    const response = await  fetch(`${config.apiUrl}/logs`,{
        method: "POST", 
        headers: authHeader({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(filters)            
      })
      return handleResponse(response)
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