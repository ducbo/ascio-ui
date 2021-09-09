import { alertConstants } from '../_constants';

export const alertActions = {
    success,
    message,
    error,
    clear,
    progress
};


function message(result) {
    if(result.success) {
        return success(result.success)
    } else if (result.error) {
        return error(result.error)
    } else {
        return progress(result.progress)
    }  
}

function success(message) {
    return { type: alertConstants.SUCCESS, message };
}
function error(message) {
    return { type: alertConstants.ERROR, message };
}
function progress(message) {
    return { type: alertConstants.PROGRESS, message };
}
function clear() {
    return { type: alertConstants.CLEAR };
}