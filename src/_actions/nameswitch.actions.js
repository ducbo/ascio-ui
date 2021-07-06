import { nameswitchConstants } from '../_constants';

export const nameswitchActions = {
	set : switchName,
};
function switchName(state) {
	return (dispatch) => {
		dispatch({ type: nameswitchConstants.SET, value: state });
	};
}