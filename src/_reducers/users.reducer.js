import { userConstants } from '../_constants';

export function users(state = {}, action) {
  switch (action.type) {
    case userConstants.FILTER_REQUEST:
			return {
				loading: true, 
				users:action.users || []
			};
		case userConstants.FILTER_SUCCESS:
			return {
				users:action.users,
				filterParams: { ...action.filterParams}
			};
		case userConstants.FILTER_FAILURE:
			return {
        users:action.users || [],
				error: action.error
			};
    case userConstants.GETALL_REQUEST:
      return {
        loading: true
      };
    case userConstants.GETALL_SUCCESS:
      return {
        items: action.users
      };
    case userConstants.GETALL_FAILURE:
      return { 
        error: action.error
      };
    case userConstants.DELETE_REQUEST:
      // add 'deleting:true' property to user being deleted
      return {
        ...state,
        items: state.items.map(user =>
          user.id === action.id
            ? { ...user, deleting: true }
            : user
        )
      };
    case userConstants.DELETE_SUCCESS:
      // remove deleted user from state
      return {
        items: state.items.filter(user => user.id !== action.id)
      };
    case userConstants.DELETE_FAILURE:
      // remove 'deleting:true' property and add 'deleteError:[error]' property to user 
      return {
        ...state,
        items: state.items.map(user => {
          if (user.id === action.id) {
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
          loading: true,
          users : state.users
        };
      case userConstants.UPDATE_SUCCESS:
        return {
          updatedUser: action.user,
          users : 
            { 
              data : state.users.data.map((user) => {
                  if(user.username === action.user.username) {
                    return action.user
                  } else return user
                }
              ),
              totalSize : state.users.totalSize
            }
      }
      case userConstants.UPDATE_FAILURE:
        return { 
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
          message: action.message
        }
      case userConstants.RESET_QR_FAILURE: 
        return { 
          error: action.error,
          username: action.username
        };
      case userConstants.RESET_PASSWORD_REQUEST: 
        return {
          loading: true,
          username: action.username
        }
      case userConstants.RESET_PASSWORD_SUCCESS: 
        return {
          username: action.username
        }
      case userConstants.RESET_PASSWORD_FAILURE: 
        return { 
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
          username: action.username
        }
      case userConstants.UPDATE_PASSWORD_FAILURE: 
        return { 
          error: action.error,
          username: action.username
        };
      case userConstants.VERIFY_USER_TOKEN_REQUEST: 
        return {
          loading: true,
          ...state,
          username: action.username
        }
      case userConstants.VERIFY_USER_TOKEN_SUCCESS: 
        return {
          username: action.username,
          qr: action.qr
        }
      case userConstants.VERIFY_USER_TOKEN_FAILURE: 
        return { 
          error: action.error,
          username: action.username,
          qr: action.qr
        };
    default:
      return state
  }
}