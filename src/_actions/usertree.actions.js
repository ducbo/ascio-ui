import { usertreeConstants } from '../_constants';
import { userTreeService } from '../_services';

export const userTreeActions = {
    getRootDescendants,
    getDescendants,
	getChildren,
	impersonate,
	refresh,
	setExpanded,
	setData
};

function impersonate(users, descendants) {
	return { type: usertreeConstants.IMPERSONATE, users, descendants }
}
function setExpanded(expanded) {
	return { type: usertreeConstants.SET_EXPANDED, expanded }
}

function setData(data) {
	return { type: usertreeConstants.SET_DATA, data }
}
function refresh(username,selected) {
	return (dispatch) => {
		dispatch(request());
		return userTreeService
			.refresh(username,selected)
			.then((result) => dispatch(success(result)), (error) => dispatch(failure(error.toString())));
	};
	function request() {
		return { type: usertreeConstants.REFRESH_REQUEST };
	}
	function success(usertree) {
		return { type: usertreeConstants.REFRESH_SUCCESS, usertree};
	}
	function failure(error) {
		return { type: usertreeConstants.REFRESH_FAILURE, error };
	}
}
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
