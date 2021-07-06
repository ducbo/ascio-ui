import { nameswitchConstants } from '../_constants';

export function nameswitch(state = false, action) {
	switch (action.type) {
		// get all records for a zone

		case nameswitchConstants.SET:
			return action.value				
		default:
			return state;
	}
}
