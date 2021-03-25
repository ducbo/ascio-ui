import { workerConstants } from '../_constants';

export function workers(state = {}, action) {
	switch (action.type) {

		case workerConstants.SET_FILTER:
			return {
				...state,
				filterParams: action.filterParams,
				loading: true
			};
		case workerConstants.FILTER_REQUEST:
			return {
				...state,
				filterParams: action.filterParams,
				loading: true
			};
		case workerConstants.FILTER_SUCCESS:
			return {
				...state,
				loading:false, 
				list: action.list,
				totalSize: action.totalSize,
				
			};
		case workerConstants.FILTER_FAILURE:
			return {
				...state,
				loading:false, 
				error: action.error
			};
		case workerConstants.UPDATE_REQUEST:
			return {
                ...state,
				loading: true,
			};
		case workerConstants.UPDATE_SUCCESS:
			return {
				...state,
				updatedUser: action.user,
				list: state.list.map((user) => {
						if (user.username === action.user.username) {
							return action.user;
						} else return user;
					}),
				totalSize: state.totalSize				
			};
		case workerConstants.UPDATE_FAILURE:
			return {
                ...state,
				error: action.error
			};

		case workerConstants.CREATE_REQUEST:
			return {
				...state,
				loading: true,
			};
		case workerConstants.CREATE_SUCCESS:
			return {
				...state,
				loading:false,
				list: action.list,
				totalSize: action.totalSize,
				error: null
			};
		case workerConstants.CREATE_FAILURE:
			console.log("action", action)
			return {
				...state,
				loading:false,
				error: action.error.message
			};
		case workerConstants.DELETE_REQUEST:
				// add 'deleting:true' property to user being deleted
				return {
				  ...state,
				  loading: true,				  
				  list: state.list.map(user =>
					user.username === action.username
					  ? { ...user, deleting: true }
					  : user
				  )
				};	
		case workerConstants.DELETE_SUCCESS:
		// remove deleted user from state
		return {
			...state,
			loading: false,
			list: state.list.filter(user => user.username !== action.username)
		};
		case workerConstants.DELETE_FAILURE:
		// remove 'deleting:true' property and add 'deleteError:[error]' property to user 
		return {
			...state,
			list: state.list.map(user => {
			if (user.username === action.username) {
				// make copy of user without 'deleting:true' property
				const { deleting, ...userCopy } = user;
				// return copy of user with 'deleteError:[error]' property
				return { ...userCopy, deleteError: action.error };
			}
			return user;
			})
		};			
		default:
			return state;
	}
}
