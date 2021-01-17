export function authHeader(additionalHeaders) {
    // return authorization header with jwt token
    additionalHeaders = additionalHeaders || {}
    let user = JSON.parse(localStorage.getItem('user'));
    if (user && user.token) {
        const auth =  { 
            'Authorization' : user.token,
            'AuthUser' : user.user.username, 
            'Content-Type': 'application/json' 
        };
        Object.keys(additionalHeaders).forEach(key => {
            auth[key] = additionalHeaders[key];
        })
        return auth;
    } else {
        return {};
    }
}