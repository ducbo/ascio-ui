import { alertConstants } from '../_constants';

export function alert(state = {}, action) {
  switch (action.type) {
    case alertConstants.SUCCESS:
      return {
        type: 'alert-success',
        variant : 'success ',
        message: action.message
      };
    case alertConstants.ERROR:
      return {
        type: 'alert-danger',
        variant : 'danger',
        message: action.message
      };
    case alertConstants.PROGRESS:
      return {
        type: 'alert-info',
        variant : 'primary',
        message: action.message
      };
    case alertConstants.CLEAR:
      return {};
    default:
      return state
  }
}