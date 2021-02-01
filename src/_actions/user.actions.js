import { userConstants } from '../_constants';
import { userService } from '../_services';
import { alertActions } from './';
import { history } from '../_helpers';

export const userActions = {
    login,
    reAuth,
    logout,
    register,
    getAll,
    activate2fa,
    force2fa,
    getQR,
    resetQR,
    resetPassword,
    verifyUserToken,
    updatePassword,
    setCode,
    verifyTotpCode,
    delete: _delete,
    setSocket,
    filter,
    update
};
function filter(searchParameters, oldZones) {	
	
	return (dispatch) => {
		dispatch(request(oldZones));
		return userService
			.filter(searchParameters)
			.then((users) => dispatch(success(users,searchParameters)), (error) => dispatch(failure(error.toString())));
	};
	function request(users) {
		return { type: userConstants.FILTER_REQUEST, users  };
	}
	function success(users,filterParams) {
		return { type: userConstants.FILTER_SUCCESS, users, filterParams};
	}
	function failure(error) {
		return { type: userConstants.FILTER_FAILURE, error };
	}
}
function login(username, password, code, options) {
    return dispatch => {
        dispatch(request({ username }));
        return userService.login(username, password, code, options)
            .then(
                user => { 
                    dispatch(success(user));                    
                },
                error => {
                    dispatch(failure(error));
                 }
            );
    }    
    function request(user) { return { type: userConstants.LOGIN_REQUEST, user } }
    function success(user) { return { type: userConstants.LOGIN_SUCCESS, user } }
    function failure(error) { return { type: userConstants.LOGIN_FAILURE, error } }
}
function setSocket(token) {
    return { type: userConstants.SET_SOCKET, token } 
}
function reAuth () {
    return dispatch => {
        dispatch(request());
        return userService.reAuth()
            .then(
                user => { 
                    dispatch(success(user));                    
                },
                error => {
                    localStorage.removeItem('user')
                    dispatch(failure(error));
                 }
            );
    }    
    function request() { return { type: userConstants.REAUTH_REQUEST } }
    function success(user) { return { type: userConstants.REAUTH_SUCCESS, user } }
    function failure(error) { return { type: userConstants.REAUTH_FAILURE, error } }
}
function logout() {
    userService.logout();
    return { type: userConstants.LOGOUT };
}
function resetQR(username) {
    return dispatch => {
        dispatch(request());
        return userService.resetQR(username)
            .then(
                () => { 
                    dispatch(success(username));                    
                },
                error => {
                    dispatch(failure(error));
                 }
            );
    }    
    function request() { return { type: userConstants.RESET_QR_REQUEST } }
    function success(username) { return { type: userConstants.RESET_QR_SUCCESS,username } }
    function failure(error) { return { type: userConstants.RESET_QR_FAILURE, error } }

}
function resetPassword(username) {
    return dispatch => {
        dispatch(request());
        return userService.resetPassword(username)
            .then(
                () => { 
                    dispatch(success(username));                    
                },
                error => {
                    dispatch(failure(error));
                 }
            );
    }    
    function request() { return { type: userConstants.RESET_PASSWORD_REQUEST } }
    function success(username) { return { type: userConstants.RESET_PASSWORD_SUCCESS,username } }
    function failure(error) { return { type: userConstants.RESET_PASSWORD_FAILURE, error } }

}
function updatePassword(username,token,password,code) {
    return dispatch => {
        dispatch(request());
        return userService.updatePassword(username,token,password,code)
            .then(
                () => { 
                    dispatch(success());                    
                },
                error => {
                    dispatch(failure(error));
                 }
            );
    }    
    function request() { return { type: userConstants.RESET_PASSWORD_REQUEST } }
    function success() { return { type: userConstants.RESET_PASSWORD_SUCCESS } }
    function failure(error) { return { type: userConstants.RESET_PASSWORD_FAILURE, error } }

}
function verifyUserToken(username,token,code) {
    return dispatch => {
        dispatch(request());
        return userService.verifyUserToken(username,token,code)
            .then(
                (result) => { 
                    dispatch(success(result.qr));                    
                },
                error => {
                    dispatch(failure(error));
                 }
            );
    }    
    function request() { return { type: userConstants.VERIFY_USER_TOKEN_REQUEST } }
    function success(qr) { return { type: userConstants.VERIFY_USER_TOKEN_SUCCESS,qr } }
    function failure(error) { return { type: userConstants.VERIFY_USER_TOKEN_FAILURE, error } }

}
function activate2fa(code,active) {
    active = active || true
    return dispatch => {
        dispatch(request());
        return userService.activate2fa({active : true, code})
            .then(
                () => { 
                    dispatch(success());
                },
                error => {
                    dispatch(failure(error.toString()));                   
                }
            );
    }
    function request() { return { type: userConstants.ACTIVATE_2FA_REQUEST } }
    function success() { return { type: userConstants.ACTIVATE_2FA_SUCCESS } }
    function failure(error) { return { type: userConstants.ACTIVATE_2FA_FAILURE,error } }
}
function setCode(code) { 
    return dispatch => {        
         return dispatch({ type: userConstants.SET_CODE, code })
    }
}
function getQR() {
    return dispatch => {
        dispatch(request());

        return userService.getQR()
            .then(
                (qr) => { 
                    dispatch(success(qr));
                },
                error => {
                    dispatch(failure(error.toString()));                   
                }
            );
    }
    function request() { return { type: userConstants.GET_QR_REQUEST } }
    function success(qr) { return { type: userConstants.GET_QR_SUCCESS,qr} }
    function failure(error) { return { type: userConstants.GET_QR_FAILURE,error } }
}
function verifyTotpCode(code) { 
    return dispatch => {
        dispatch(request());

        return userService.verifyTotpCode(code)
            .then(
                () => { 
                    dispatch(success());
                },
                error => {
                    dispatch(failure(error.toString()));                   
                }
            );
    }
    function request() { return { type: userConstants.VERIFY_TOPTP_CODE_REQUEST } }
    function success() { return { type: userConstants.VERIFY_TOPTP_CODE_SUCCESS} }
    function failure(error) { return { type: userConstants.VERIFY_TOPTP_CODE_FAILURE,error } }
}
function update(data) { 
    return dispatch => {
        dispatch(request());

        return userService.update(data)
            .then(
                (user) => { 
                    dispatch(success(user));
                },
                error => {
                    dispatch(failure(error.toString()));                   
                }
            );
    }
    function request() { return { type: userConstants.UPDATE_REQUEST} }
    function success(user) { return { type: userConstants.UPDATE_SUCCESS , user} }
    function failure(error) { return { type: userConstants.UPDATE_FAILURE,error } }
}
function force2fa(level) { 
    return dispatch => {
        dispatch(request());

        return userService.force2fa(level)
            .then(
                () => { 
                    dispatch(success());
                },
                error => {
                    dispatch(failure(error.toString()));                   
                }
            );
    }
    function request() { return { type: userConstants.GET_QR_REQUEST } }
    function success() { return { type: userConstants.GET_QR_SUCCESS} }
    function failure(error) { return { type: userConstants.GET_QR_FAILURE,error } }
}
function register(user) {
    return dispatch => {
        dispatch(request(user));

        return userService.register(user)
            .then(
                user => { 
                    dispatch(success());
                    history.push('/login');
                    dispatch(alertActions.success('Registration successful'));
                },
                error => {
                    dispatch(failure(error.toString()));
                    dispatch(alertActions.error(error.toString()));
                }
            );
    };

    function request(user) { return { type: userConstants.REGISTER_REQUEST, user } }
    function success(user) { return { type: userConstants.REGISTER_SUCCESS, user } }
    function failure(error) { return { type: userConstants.REGISTER_FAILURE, error } }
}
function getAll() {
    return dispatch => {
        dispatch(request());

        return userService.getAll()
            .then(
                users => dispatch(success(users)),
                error => dispatch(failure(error.toString()))
            );
    };

    function request() { return { type: userConstants.GETALL_REQUEST } }
    function success(users) { return { type: userConstants.GETALL_SUCCESS, users } }
    function failure(error) { return { type: userConstants.GETALL_FAILURE, error } }
}

// prefixed function name with underscore because delete is a reserved word in javascript
function _delete(id) {
    return dispatch => {
        dispatch(request(id));

        return userService.delete(id)
            .then(
                user => dispatch(success(id)),
                error => dispatch(failure(id, error.toString()))
            );
    };

    function request(id) { return { type: userConstants.DELETE_REQUEST, id } }
    function success(id) { return { type: userConstants.DELETE_SUCCESS, id } }
    function failure(id, error) { return { type: userConstants.DELETE_FAILURE, id, error } }
}