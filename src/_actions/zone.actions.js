import { zoneConstants } from '../_constants';
import { zoneService } from '../_services';

export const zoneActions = {
	create,
    updateOwner,
	delete: _delete,
	filter
};

function filter(searchParameters, oldZones) {	
	
	return (dispatch) => {
		dispatch(request(oldZones));
		return zoneService
			.filter(searchParameters)
			.then((zones) => dispatch(success(zones,searchParameters)), (error) => dispatch(failure(error.toString())));
	};
	function request(zones) {
		return { type: zoneConstants.FILTER_REQUEST, zones  };
	}
	function success(zones,filterParams) {
		return { type: zoneConstants.FILTER_SUCCESS, zones, filterParams};
	}
	function failure(error) {
		return { type: zoneConstants.FILTER_FAILURE, error };
	}
}
function create(zoneName, owner, api,filters) {
	return (dispatch) => {
		dispatch(request());
		zoneService
			.create(zoneName,owner, api || "Ascio", filters)
			.then((zones) => dispatch(success(zones,filters)), (error) => dispatch(failure(error.toString(),zoneName)));
	};
	function request() {
		return { type: zoneConstants.CREATE_REQUEST };
	}
	function success(zones,filterParams) {
		return { type: zoneConstants.CREATE_SUCCESS, zones,filterParams };
	}
	function failure(error,zoneName) {
		return { type: zoneConstants.CREATE_FAILURE, error, zoneName };
	}
}
function updateOwner(zoneName, owner){
	return (dispatch) => {
		dispatch(request(zoneName, owner));

		zoneService
			.update(zoneName,owner)
			.then((resultZone) => dispatch(success(resultZone)), (error) => dispatch(failure(error.toString(),zoneName)));
	};
	function request(Id) {
		return { type: zoneConstants.UPDATEOWNER_REQUEST, Id };
	}
	function success(zone) {
		return { type: zoneConstants.UPDATEOWNER_SUCCESS, zone };
	}
	function failure(error,zoneName) {
		return { type: zoneConstants.UPDATEOWNER_FAILURE, error, zoneName };
	}
}
function _delete(zoneName, filters) {
	return (dispatch) => {
		dispatch(request());

		return zoneService
			.delete(zoneName, filters)
			.then((zones) => dispatch(success(zones,filters)), (error) => dispatch(failure(error.toString(),zoneName)));
	}
	function request() {
		return { type: zoneConstants.DELETE_REQUEST };
	}
	function success(zones,filterParams) {
		return { type: zoneConstants.DELETE_SUCCESS, zones,filterParams };
	}
	function failure(error,zoneName) {
		return { type: zoneConstants.DELETE_FAILURE, error, zoneName };
	}
}