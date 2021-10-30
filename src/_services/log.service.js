import { authHeader } from '../_helpers';
import config from '../config';
import { handleResponse } from '../_helpers';

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
