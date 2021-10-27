import { zoneConstants } from '../_constants';
import { zoneService } from '../_services';

export const zoneActions = {
	create,
    updateOwner,
	delete: _delete,
	filter,
	sync, 
	refresh
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
		return zoneService
			.create(zoneName,owner, api || "Ascio", filters)
			.then((zones) => dispatch(success(zoneName, zones,filters)), (error) => dispatch(failure(error.toString(),zoneName)));
	};
	function request() {
		return { type: zoneConstants.CREATE_REQUEST };
	}
	function success(zoneName, zones,filterParams) {
		return { type: zoneConstants.CREATE_SUCCESS, zoneName, zones,filterParams };
	}
	function failure(error,zoneName) {
		return { type: zoneConstants.CREATE_FAILURE, error, zoneName };
	}
}
function sync(zoneName, owner, api, filters) {
	return (dispatch) => {
		dispatch(request());
		zoneService
			.sync(zoneName,owner, api || "Ascio", filters)
			.then((zones) => dispatch(success(zones)), (error) => dispatch(failure(error.toString(),zoneName)));
	};
	function request() {
		return { type: zoneConstants.SYNC_REQUEST };
	}
	function success(zones, filters) {
		return { type: zoneConstants.SYNC_SUCCESS, zones, filters };
	}
	function failure(error,zoneName) {
		return { type: zoneConstants.SYNC_FAILURE, error, zoneName };
	}
}
function updateOwner(zoneName, owner){
	return (dispatch) => {
		dispatch(request(zoneName, owner));

		zoneService
			.updateOwner(zoneName,owner)
			.then((resultZone) => dispatch(success(resultZone)), (error) => dispatch(failure(error.toString(),zoneName)));
	};
	function request(Id) {
		return { type: zoneConstants.UPDATEOWNER_REQUEST, Id };
	}
	function success(zone) {
		return { type: zoneConstants.UPDATEOWNER_SUCCESS, ...zone };
	}
	function failure(error,zoneName) {
		return { type: zoneConstants.UPDATEOWNER_FAILURE, error, zoneName };
	}
}
function _delete(zoneName, filterParams) {
	return (dispatch) => {
		dispatch(request(zoneName,filterParams));
		return zoneService
			.delete(zoneName, filterParams)
			.then((zones) => dispatch(success(zones,filterParams,zoneName)), (error) => dispatch(failure(error.toString(),zoneName)));
	}
	function request(zoneName, filterParams) {
		return { type: zoneConstants.DELETE_REQUEST, zoneName, filterParams };
	}
	function success(zones) {
		return { type: zoneConstants.DELETE_SUCCESS, zones };
	}
	function failure(error,zoneName) {
		return { type: zoneConstants.DELETE_FAILURE, error };
	}	
}
function refresh() {
	return { type: zoneConstants.REFRESH };
}
