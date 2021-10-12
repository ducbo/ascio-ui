import { logConstants } from '../_constants';

export function log(state = { filters:null, error: null, success: null, progress:null, loading:false, zoneName: null, logs: [] }, action) {
	state.error = null
	state.success = null
	state.progress = null
	state.loading = false
	switch (action.type) {
		// get all logs for a zone

		case logConstants.FILTER_REQUEST:
			return {
				...state,
				loading: true,
				filters: action.filters || state.filters
			};
		case logConstants.FILTER_SUCCESS:
			action.logs.data = action.logs.data.map((entry) => {
				entry.CreatedDate = new Date(parseInt(entry.CreatedDate))
				return entry
			})
			return {
				...state,
				...action.logs				
			};
		case logConstants.FILTER_FAILURE:
			return {
				...state,
				error: action.error
			};		
		default:
			return state;
	}
}
