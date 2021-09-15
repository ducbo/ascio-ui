import { recordConstants } from '../_constants';
import { recordService } from '../_services';

export const recordActions = {
	create,
	update,
	createSocket,
	updateSocket,
	deleteSocket,
	delete: _delete,
	getAll
};

function getAll(zoneName) {
	return (dispatch) => {
		dispatch(request());

		recordService
			.getAll(zoneName)
			.then((records) => dispatch(success(records.records,zoneName)), (error) => dispatch(failure(error.toString())));
	};
	function request() {
		return { type: recordConstants.GETALL_REQUEST };
	}
	function success(records,zoneName) {
		return { type: recordConstants.GETALL_SUCCESS, records,zoneName };
	}
	function failure(error) {
		return { type: recordConstants.GETALL_FAILURE, error };
	}
}
function create(zoneName, record) {
    return (dispatch) => {
		dispatch(request());
		return recordService
			.create(zoneName,record)
			.then((resultRecord) => dispatch(success(resultRecord)), (error) => dispatch(failure(error.message || error.toString(), record.Id)));
	};
	function request() {
		return { type: recordConstants.CREATE_REQUEST };
	}
	function success(record) {
		return { type: recordConstants.CREATE_SUCCESS, record };
	}
	function failure(error) {
		return { type: recordConstants.CREATE_FAILURE, error };
	}
}
function createSocket(record){
	return { type: recordConstants.CREATE_SUCCESS, record };
}
function update(zoneName, record){
	return (dispatch) => {
		dispatch(request(record.Id));
		return recordService
			.update(zoneName,record)
			.then((resultRecord) => dispatch(success(resultRecord)), (error) => dispatch(failure(error.toString(),record.Id)));
	};
	function request(Id) {
		return { type: recordConstants.UPDATE_REQUEST, Id };
	}
	function success(record) {
		return { type: recordConstants.UPDATE_SUCCESS, record };
	}
	function failure(error,recordId) {
		return { type: recordConstants.UPDATE_FAILURE, error,recordId };
	}
}
function updateSocket(record){
	return { type: recordConstants.UPDATE_SUCCESS, record };
}
function _delete(zoneName, recordId) {
	return (dispatch) => {
		dispatch(request());
		return recordService
			.delete(zoneName, recordId)
			.then((result) => dispatch(success(result)), (error) => dispatch(failure(error.toString())));
	}
	function request() {
		return { type: recordConstants.DELETE_REQUEST };
	}
	function success(record) {
		return { type: recordConstants.DELETE_SUCCESS, record };
	}
	function failure(error,recordId) {
		return { type: recordConstants.DELETE_FAILURE, error };
	}
}
function deleteSocket(record){
	return { type: recordConstants.DELETE_SUCCESS, record };
}