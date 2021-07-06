import { zoneConstants } from '../_constants';

export function zones(state = { filterParams : {users : null}, zones: {data :[] } }, action) {
	switch (action.type) {
		// filter zones

		case zoneConstants.FILTER_REQUEST:
			return {
				loading: true, 
				zones:action.zones
			};
		case zoneConstants.FILTER_SUCCESS:
			return {
				zones:action.zones,
				filterParams: { ...action.filterParams}
			};
		case zoneConstants.FILTER_FAILURE:
			return {
				error: action.error
			};

		// update zone

		case zoneConstants.UPDATEOWNER_REQUEST:
			return {
				zones: state.zones,
				loading: true
            };           
		case zoneConstants.UPDATEOWNER_SUCCESS:
			return {
				zones: state.zones.map((zone) => {
					if (zone.zoneName !== action.zone.zoneName) {
						return zone;
                    }
                    return {
						...zone,
						...action.zone
					};
				}),
                loading: false,
                success: true,
                zoneName: action.zoneName
			};
		case zoneConstants.UPDATEOWNER_FAILURE:
			return {
                zones: state.zones,
                error: action.error,
                zoneName: action.zoneName
			};

		// create zone

		case zoneConstants.CREATE_REQUEST:
			return {
				zones: state.zones,
				progress: "Creating new zone. Please wait.",
				loading: true
			};
		case zoneConstants.CREATE_SUCCESS:
			return {
				zones:action.zones,
				success: "Zone successfully created.",
				filterParams:  { ...action.filterParams}
			};
		case zoneConstants.CREATE_FAILURE:
            return {
                zones: state.zones,
                error: action.error
			};;
		// sync zone

		case zoneConstants.SYNC_REQUEST:
			return {
				progress: "Sync new zone. Please wait.",
				loading: true,
				...state
			};
		case zoneConstants.SYNC_SUCCESS:
			return {
				zones:action.zones,
				success: "Zone successfully synced.",
				...state
			};
		case zoneConstants.SYNC_FAILURE:
            return {                
                error: action.error,
				...state
			};;

		// delete zone

		case zoneConstants.DELETE_REQUEST:
			// add 'deleting:true' property to zone being deleted
			return {
				progress: "Deleting zone. Please wait.",
				zones: state.zones,
				loading: true
			};
		case zoneConstants.DELETE_SUCCESS:
			// remove deleted zone from state
			return {
				zones:action.zones,
				success: "Zone successfully deleted.",
				filterParams:  { ...action.filterParams}
			};
		case zoneConstants.DELETE_FAILURE:
			// remove 'deleting:true' property and add 'deleteError:[error]' property to zone
			return {
                zones: state.zones,
                error: action.error,
			};
		default:
			return state;
	}
}
