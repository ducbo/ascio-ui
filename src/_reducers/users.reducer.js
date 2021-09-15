import { userConstants } from '../_constants';

export function users(state = {}, action) {
  switch (action.type) {
    case userConstants.FILTER_REQUEST:
			return {
				loading: true, 
        filterParams:  { ...action.filterParams}
			};
		case userConstants.FILTER_SUCCESS:
			return {
        ...state,
        loading: false,
				list:action.list,
        totalSize: action.totalSize
      }
		case userConstants.FILTER_FAILURE:
			return {
        ...state,
        loading: false,
				error: action.error
			};
    case userConstants.GETALL_REQUEST:
      return {
        loading: true
      };
    case userConstants.GETALL_SUCCESS:
      return {
        loading:false,
        items: action.users
      };
    case userConstants.GETALL_FAILURE:
      return { 
        loading:false,
        error: action.error
      };
      case userConstants.DELETE_REQUEST:
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
		case userConstants.DELETE_SUCCESS:
		// remove deleted user from state
		return {
			...state,
			loading: false,
			list: state.list.filter(user => user.username !== action.username)
		};
		case userConstants.DELETE_FAILURE:
		// remove 'deleting:true' property and add 'deleteError:[error]' property to user 
		return {
			...state,
      loading:false,
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
      case userConstants.UPDATE_REQUEST:
        return {
          ...state,
          loading: true,
          
        };
      case userConstants.UPDATE_SUCCESS:
        return {
          ...state,
          loading:false,
          updatedUser: action.user,
          success: "User updated: "+action.user.company,
          list: state.list.map((user) => {
              if (user.username === action.user.username) {
                return action.user;
              } else return user;
            }),
          totalSize: state.totalSize				
        }
      case userConstants.UPDATE_FAILURE:
        return { 
          ...state,
          loading:false,
          error: action.error
        };
        
      case userConstants.CREATE_REQUEST:
        return {
          ...state,
          loading: true
        };
      case userConstants.CREATE_SUCCESS:
        return {
          ...state,
          loading:false,
          list: action.list,
          success: "User created: "+action.user.company,
          totalSize: action.totalSize	
        };
      case userConstants.CREATE_FAILURE:
        return { 
          ...state,
          loading:false,
          error: action.error
        };
      case userConstants.RESET_QR_REQUEST: 
        return {
          loading: true,
          username: action.username
        }
      case userConstants.RESET_QR_SUCCESS: 
        return {
          username: action.username,
          loading:false,
          message: action.message
        }
      case userConstants.RESET_QR_FAILURE: 
        return { 
          error: action.error,
          loading:false,
          username: action.username
        };
      case userConstants.RESET_PASSWORD_REQUEST: 
        return {
          loading: true,
          username: action.username
        }
      case userConstants.RESET_PASSWORD_SUCCESS: 
        return {
          loading:false,
          username: action.username
        }
      case userConstants.RESET_PASSWORD_FAILURE: 
        return { 
          loading:false,
          error: action.error,
          username: action.username
        };
      case userConstants.UPDATE_PASSWORD_REQUEST: 
        return {
          loading: true,
          username: action.username
        }
      case userConstants.UPDATE_PASSWORD_SUCCESS: 
        return {
          loading:false,
          username: action.username
        }
      case userConstants.UPDATE_PASSWORD_FAILURE: 
        return { 
          loading:false,
          error: action.error,
          username: action.username
        };
      case userConstants.VERIFY_USER_TOKEN_REQUEST: 
        return {
          ...state,
          loading: true,
          username: action.username
        }
      case userConstants.VERIFY_USER_TOKEN_SUCCESS: 
        return {
          loading:false,
          username: action.username,
          qr: action.qr
        }
      case userConstants.VERIFY_USER_TOKEN_FAILURE: 
        return { 
          loading:false,
          error: action.error,
          username: action.username,
          qr: action.qr
        };
    default:
      return state
  }
}