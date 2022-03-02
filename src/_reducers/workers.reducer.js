import { workerConstants } from '../_constants';

export function workers(state = {list: [], totalSize: 0, error : null, success : null, progress : null, loading : false}, action) {
	state.error = null
	state.success = null
	state.progress = null
	state.loading = false
	switch (action.type) {
// TODO:  remove SET_FILTER
		case workerConstants.SET_FILTER:
			return {
				...state,
				filterParams: action.filterParams,
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
				loading:false,
				updatedUser: action.user,
				success: "Updated "+action.user.username,
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
				loading:false,
				error: action.error
			};

		case workerConstants.CREATE_REQUEST:
			return {
				...state,
				loading: true,
				progress: "Creating user " + action.user.username
			};
		case workerConstants.CREATE_SUCCESS:
			return {
				...state,
				list: action.list,
				totalSize: action.totalSize,
				success: "Created user " + action.user.username
			};
		case workerConstants.CREATE_FAILURE:
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
				  progress: "Deleting user "+action.username,				  
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
			success: "Deleted user "+action.username,			
			list: action.users.data
		};
		case workerConstants.DELETE_FAILURE:
		// remove 'deleting:true' property and add 'deleteError:[error]' property to user 
		return {
			...state,
			loading:false,
			error: action.error,
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
