import { nslookupConstants } from '../_constants';

export function nslookup(state = { nslookup: [] }, action) {
	switch (action.type) {
		// get all nslookup for a zone
		case nslookupConstants.CHECK_REQUEST:
			return {
				nslookup: [],
				loading: true
			};
		case nslookupConstants.CHECK_SUCCESS:
			return {
				result: action,
			};
		case nslookupConstants.CHECK_FAILURE:
			return {
				error: action.error
			};

	
		default:
			return state;
	}
}
