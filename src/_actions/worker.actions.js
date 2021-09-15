import { workerConstants } from '../_constants';
import { workerService } from '../_services';

export const workerActions = {
    create,
    filter,
    update,
    setFilter,
    delete: _delete
};
function setFilter(searchParameters) {
    return (dispatch) => {
        dispatch(request(searchParameters));
    }	
    function request(filterParams) {
		return { type: workerConstants.SET_FILTER, filterParams  };
	}

}
function filter(searchParameters) {	
	
	return (dispatch) => {
		dispatch(request(searchParameters));
		return workerService
			.filter(searchParameters)
			.then((result) => dispatch(success(result.data, result.totalSize)), (error) => dispatch(failure(error.toString())));
	};
	function request(filterParams) {
		return { type: workerConstants.FILTER_REQUEST, filterParams  };
	}
	function success(list,totalSize) {
		return { type: workerConstants.FILTER_SUCCESS, list,totalSize};
	}
	function failure(error) {
		return { type: workerConstants.FILTER_FAILURE, error };
	}
}
function create(user,filters) {
    return dispatch => {
        dispatch(request(user));
        return workerService.create(user,filters)
            .then(
                result => { 
                    dispatch(success(user, result.data, result.totalSize));
                },
                error => {
                    dispatch(failure(user,error));
                    throw(error)
                }
            );
    };

    function request(user) { return { type: workerConstants.CREATE_REQUEST ,user } }
    function success(user, list,totalSize) { return { type: workerConstants.CREATE_SUCCESS, list, totalSize, user} }
    function failure(user, error) { return { type: workerConstants.CREATE_FAILURE, error, user } }
}
function update(data) { 
    return dispatch => {
        dispatch(request());

        return workerService.update(data)
            .then(
                (user) => { 
                    dispatch(success(user));
                },
                error => {
                    dispatch(failure(error.toString()));                   
                }
            );
    }
    function request() { return { type: workerConstants.UPDATE_REQUEST} }
    function success(user) { return { type: workerConstants.UPDATE_SUCCESS , user} }
    function failure(error) { return { type: workerConstants.UPDATE_FAILURE,error } }
}

// prefixed function name with underscore because delete is a reserved word in javascript
function _delete(username,filters) {
    return dispatch => {
        dispatch(request(username));

        return workerService.delete(username,filters)
            .then(
                users => dispatch(success(username,users)),
                error => dispatch(failure(username, error.toString()))
            );
    };

    function request(username) { return { type: workerConstants.DELETE_REQUEST, username } }
    function success(username,users) { return { type: workerConstants.DELETE_SUCCESS, username, users } }
    function failure(username, error) { return { type: workerConstants.DELETE_FAILURE, username, error } }
}