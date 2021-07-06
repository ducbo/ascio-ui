import { nslookupConstants } from '../_constants';

export const nameswitchActions = {
	check
};
function check(fqdn) {
	return (dispatch) => {
		dispatch(request());

		nslookupService
			.check(fqdn)
			.then(() => dispatch(success(fqdn)), (error) => dispatch(failure(error.toString())));
	};
	function request() {
		return { type: nslookupConstants.NSLOOKUP_CHECK_REQUEST };
	}
	function success(fqdn) {
		return { type: nslookupConstants.NSLOOKUP_CHECK_SUCCESS, fqdn };
	}
	function failure(error) {
		return { type: nslookupConstants.NSLOOKUP_CHECK_FAILURE, error };
	}
}