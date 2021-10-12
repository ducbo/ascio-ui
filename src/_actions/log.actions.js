import { logConstants } from '../_constants';
import { logService } from '../_services';

export const logActions = {
	filter
};

function filter(filters) {
	return (dispatch) => {
		dispatch(request(filters));
		return logService
			.filter(filters)
			.then((logs) => dispatch(success(logs)), (error) => dispatch(failure(error.toString())));
	};
	function request(filters) {
		return { type: logConstants.FILTER_REQUEST, filters };
	}
	function success(logs) {
		return { type: logConstants.FILTER_SUCCESS, logs };
	}
	function failure(error) {
		return { type: logConstants.FILTER_FAILURE, error };
	}
}