import { usertreeConstants } from '../_constants';
import { userTreeService } from '../_services';

export const userTreeActions = {
    getRootDescendants,
    getDescendants,
    getChildren
};

function getDescendants(user) {
	return (dispatch) => {
		dispatch(request());
		return userTreeService
			.getDescendants(user)
			.then((users) => dispatch(success(users.children)), (error) => dispatch(failure(error.toString())));
	};
	function request() {
		return { type: usertreeConstants.DESCENDANT_REQUEST };
	}
	function success(children) {
		return { type: usertreeConstants.DESCENDANT_SUCCESS, children};
	}
	function failure(error) {
		return { type: usertreeConstants.DESCENDANT_FAILURE, error };
	}
}
function getRootDescendants(user) {
	return (dispatch) => {
		dispatch(request());
		return userTreeService
			.getDescendants(user)
			.then((users) => dispatch(success(users.children)), (error) => dispatch(failure(error.toString())));
	};
	function request() {
		return { type: usertreeConstants.ROOT_DESCENDANT_REQUEST };
	}
	function success(children) {
		return { type: usertreeConstants.ROOT_DESCENDANT_SUCCESS, children};
	}
	function failure(error) {
		return { type: usertreeConstants.ROOT_DESCENDANT_FAILURE, error };
	}
}
function getChildren(user) {
	return (dispatch) => {
		dispatch(request());
		return userTreeService
			.getChildren(user)
			.then((users) => dispatch(success(users.children)), (error) => dispatch(failure(error.toString())));
	};
	function request() {
		return { type: usertreeConstants.CHILDREN_REQUEST };
	}
	function success(children) {
		return { type: usertreeConstants.CHILDREN_SUCCESS, children};
	}
	function failure(error) {
		return { type: usertreeConstants.CHILDREN_FAILURE, error };
	}
}
