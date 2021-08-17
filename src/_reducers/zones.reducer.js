import { zoneConstants } from '../_constants';

export function zones(state = { filterParams : {users : null}, zones: {data :[] } }, action) {
	switch (action.type) {
		// filter zones

		case zoneConstants.FILTER_REQUEST:
			return {
				...state,
				progress: "Loading search results",
				loading: true, 
				zones:action.zones
			};
		case zoneConstants.FILTER_SUCCESS:
			return {
				...state,
				zones:action.zones,
				progress: null,
				filterParams: { ...action.filterParams}
			};
		case zoneConstants.FILTER_FAILURE:
			return {
				...state,
				progress: null,
				error: action.error
			};

		// update zone

		case zoneConstants.UPDATEOWNER_REQUEST:
			return {
				...state,
				progress: "Updating owner",
				zones: state.zones,
				loading: true
            };           
		case zoneConstants.UPDATEOWNER_SUCCESS:
			return {
				...state,
				zones: state.zones.map((zone) => {
					if (zone.zoneName !== action.zone.zoneName) {
						return zone;
                    }
                    return {
						...zone,
						...action.zone
					};
				}),
				progress: null,
                loading: false,
                success: true,
                zoneName: action.zoneName
			};
		case zoneConstants.UPDATEOWNER_FAILURE:
			return {
				...state,
                zones: state.zones,
                error: action.error,
				progress: null,
                zoneName: action.zoneName
			};

		// create zone

		case zoneConstants.CREATE_REQUEST:
			return {
				...state,
				zones: state.zones,
				progress: "Creating new zone. Please wait.",
				loading: true
			};
		case zoneConstants.CREATE_SUCCESS:
			return {
				...state,
				zones:action.zones,
				progress: null,
				success: "Zone successfully created.",
				filterParams:  { ...action.filterParams}
				
			};
		case zoneConstants.CREATE_FAILURE:
            return {
				...state,
                zones: state.zones,
                progress: null,
				error: action.error
				
			};;
		// sync zone

		case zoneConstants.SYNC_REQUEST:
			return {
				...state,
				progress: "Sync new zone. Please wait.",
				loading: true
			};
		case zoneConstants.SYNC_SUCCESS:
			return {
				...state,
				progress: null,
				zones:action.zones,
				success: "Zone successfully synced."
			};
		case zoneConstants.SYNC_FAILURE:
            return {                
				...state,
				progress: null,
                error: action.error
			};

		// delete zone

		case zoneConstants.DELETE_REQUEST:
			// add 'deleting:true' property to zone being deleted
			return {
				...state,
				progress: "Deleting zone. Please wait.",
				zones: state.zones,
				loading: true
			};
		case zoneConstants.DELETE_SUCCESS:
			// remove deleted zone from state
			return {
				...state,
				zones:action.zones,
				progress: null,
				success: "Zone successfully deleted.",
				filterParams:  { ...action.filterParams}
			};
		case zoneConstants.DELETE_FAILURE:
			// remove 'deleting:true' property and add 'deleteError:[error]' property to zone
			return {
				...state,
				progress: null,
                zones: state.zones,
                error: action.error,
			};
		default:
			return state;
	}
}
