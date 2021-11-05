import { usertreeConstants } from '../_constants';

export function usertree(state = {data: {}, descendants : [], rootDescendants : [], selectableUsers: {}, children : [], impersonate : {name: null, username: null}}, action) {
  state.error = null
  state.success = null
  state.progress = null
  state.loading = false;
  switch (action.type) {
    // refresh     
    case usertreeConstants.REFRESH: return {
      ...state, 
      refresh : ! state.refresh
    }

    // get descendants

    case usertreeConstants.DESCENDANT_REQUEST:
      return {
        ...state,
        loading: true, 
      };
    case usertreeConstants.DESCENDANT_SUCCESS:
      return {
        ...state,
        descendants: action.children
      };
    case usertreeConstants.DESCENDANT_FAILURE:
      return { 
        ...state,
        error: action.error,
      };

    // get root descendants

    case usertreeConstants.ROOT_DESCENDANT_REQUEST:
      return {   
        ...state,     
        loading: true
      };
    case usertreeConstants.ROOT_DESCENDANT_SUCCESS:
      const users = {}
      action.children.forEach((user) => {
        users[user.id] = user.name
      }) 
      return {
        ...state,
        rootDescendants: action.children,
        selectableUsers: users
      };
    case usertreeConstants.ROOT_DESCENDANT_FAILURE:
      return { 
        ...state,
        error: action.error
      };
    
    // get children
    
    case usertreeConstants.CHILDREN_REQUEST:
      return {
        ...state,
        loading: true,        
      };
    case usertreeConstants.CHILDREN_SUCCESS:
      return {
        ...state,
        children: action.children,
      };
    case usertreeConstants.CHILDREN_FAILURE:
      return { 
        ...state,
        error: action.error,
      };    
    // set current tree, IMPERSONATE_USER
    case usertreeConstants.IMPERSONATE:
      return {
        ...state,
        impersonate: action.users,
        impersonateDescendants: action.descendants,
        refresh: !state.refresh
      };
    case usertreeConstants.EXPANDED_REQUEST: {
      return {
        ...state,
        worker: action.worker, 
        expanded: action.expanded
      }
    }
    case usertreeConstants.EXPANDED_SUCCESS: {
      return {
        ...state, 
        expanded: state.worker ?action.expanded.concat([state.worker]) : action.expanded
      }
    }
    case usertreeConstants.EXPANDED_FAILURE: {
      return {
        ...state, 
        error: action.error
      }
    }
    case usertreeConstants.SET_DATA: {
      return {
        ...state, 
        data: action.data
      }
    }
    case usertreeConstants.REFRESH_REQUEST:
      return {
        ...state,
        loading: true
        
      };
    case usertreeConstants.REFRESH_SUCCESS:
      return {
        ...state,
        loading:false,
        success:null,
        error:null,
        data : action.usertree
      };
    case usertreeConstants.REFRESH_FAILURE:
      return { 
        ...state,
        loading:false,
        error: action.error,

      };  
    default:
      return state
  }
}