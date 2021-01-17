import { usertreeConstants } from '../_constants';

export function usertree(state = {descendants : [], rootDescendants : [],children : []}, action) {
  switch (action.type) {
    
    // get descendants

    case usertreeConstants.DESCENDANT_REQUEST:
      return {
        loading: true, 
        rootDescendants: state.rootDescendants
      };
    case usertreeConstants.DESCENDANT_SUCCESS:
      return {
        descendants: action.children,
        rootDescendants: state.rootDescendants
      };
    case usertreeConstants.DESCENDANT_FAILURE:
      return { 
        error: action.error,
        rootDescendants: state.rootDescendants
      };

    // get root descendants

    case usertreeConstants.ROOT_DESCENDANT_REQUEST:
      return {
        loading: true
      };
    case usertreeConstants.ROOT_DESCENDANT_SUCCESS:
      return {
        rootDescendants: action.children
      };
    case usertreeConstants.ROOT_DESCENDANT_FAILURE:
      return { 
        error: action.error
      };
    
    // get children
    
    case usertreeConstants.CHILDREN_REQUEST:
      return {
        loading: true,
        rootDescendants: state.rootDescendants
      };
    case usertreeConstants.CHILDREN_SUCCESS:
      return {
        children: action.children,
        rootDescendants: state.rootDescendants
      };
    case usertreeConstants.CHILDREN_FAILURE:
      return { 
        error: action.error,
        rootDescendants: state.rootDescendants
      };
    default:
      return state
  }
}