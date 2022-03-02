import { userConstants } from '../_constants';

export function users(state = {list: [], totalSize: 0}, action) {
  state.error = null
	state.success = null
	state.progress = null
	state.loading = false
  switch (action.type) {
    case userConstants.FILTER_REQUEST:
			return {
        ...state,
				loading: true, 
        filterParams:  { ...action.filterParams}
			};
		case userConstants.FILTER_SUCCESS:
			return {
        ...state,
				list:action.list,
        totalSize: action.totalSize
      }
		case userConstants.FILTER_FAILURE:
			return {
        ...state,
				error: action.error
			};
    case userConstants.GETALL_REQUEST:
      return {
        ...state,
        loading: true
      };
    case userConstants.GETALL_SUCCESS:
      return {
        ...state,
        items: action.users
      };
    case userConstants.GETALL_FAILURE:
      return {   
        ...state,      
        error: action.error
      };
      case userConstants.DELETE_REQUEST:
				// add 'deleting:true' property to user being deleted
        return {
          ...state,
          loading: true,
          progress: "Deleting user "+action.username		  
        };	
		case userConstants.DELETE_SUCCESS:
		// remove deleted user from state
		return {
			...state,
			loading: false,
			success: "Deleted user "+action.username,			
			list: action.users.data
		};
		case userConstants.DELETE_FAILURE:
		// remove 'deleting:true' property and add 'deleteError:[error]' property to user 
		return {
			...state,
      
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
      case userConstants.UPDATE_REQUEST:
        return {
          ...state,
          loading: true,
          
        };
      case userConstants.UPDATE_SUCCESS:
        return {
          ...state,          
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
          list: action.list,
          success: "User created: "+action.user.company,
          totalSize: action.totalSize	
        };
      case userConstants.CREATE_FAILURE:
        return { 
          ...state,          
          error: action.error
        };
      case userConstants.RESET_QR_REQUEST: 
        return {
          ...state,
          loading: true,
          username: action.username
        }
      case userConstants.RESET_QR_SUCCESS: 
        return {
          ...state,
          username: action.username,
          success: "QR Code updated for "+action.username, 
          message: action.message
        }
      case userConstants.RESET_QR_FAILURE: 
        return { 
          ...state,
          error: action.error,          
          username: action.username
        };
      case userConstants.RESET_PASSWORD_REQUEST: 
        return {
          ...state,
          loading: true,
          username: action.username
        }
      case userConstants.RESET_PASSWORD_SUCCESS: 
        return {
          ...state,
          success: "Password Code updated for "+action.username, 
          username: action.username
        }
      case userConstants.RESET_PASSWORD_FAILURE: 
        return { 
          ...state,
          error: action.error,
          username: action.username
        };
      case userConstants.UPDATE_PASSWORD_REQUEST: 
        return {
          ...state,
          loading: true,
          username: action.username
        }
      case userConstants.UPDATE_PASSWORD_SUCCESS: 
        return {
          ...state,
          username: action.username
        }
      case userConstants.UPDATE_PASSWORD_FAILURE: 
        return { 
          ...state,          
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
          ...state,
          username: action.username,
          qr: action.qr
        }
      case userConstants.VERIFY_USER_TOKEN_FAILURE: 
        return { 
          ...state,
          error: action.error,
          username: action.username,
          qr: action.qr
        };
    default:
      return state
  }
}