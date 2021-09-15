import { zoneConstants } from '../_constants';


export function zones(state = { refresh: false, filterParams : {users : null}, zones: {data :[] } }, action) {
	state.error = null
	state.success = null
	state.progress = null
	state.loading = false
	switch (action.type) {
		// filter zones

		case zoneConstants.FILTER_REQUEST:
			return {
				...state,
				loading: true, 
				zones:action.zones
			};
		case zoneConstants.FILTER_SUCCESS:
			return {
				...state,
				zones:action.zones,				
				filterParams: { ...action.filterParams}
			};
		case zoneConstants.FILTER_FAILURE:
			return {
				...state,
				loading:false,
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
				zones : {
					data : state.zones.data.map((zone) => {
						if (zone.ZoneName === action.zone.ZoneName) {
							return { ...action.zone, key: zone.ZoneName};
						} else {
							return zone
						}
					})
				},
                success: "Owner of zone " + action.zone.ZoneName + " changed to "+ action.zone._clientName + ".",
                zoneName: action.zoneName
			};
		case zoneConstants.UPDATEOWNER_FAILURE:
			return {
				...state,
                zones: state.zones,
                error: action.error,
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
				success: "Zone "+action.zoneName+" successfully created.",
				filterParams:  { ...action.filterParams}
				
			};
		case zoneConstants.CREATE_FAILURE:
            return {
				...state,
                zones: state.zones,
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
				zones:action.zones,
				success: "Zone successfully synced."
			};
		case zoneConstants.SYNC_FAILURE:
            return {                
				...state,
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
				success: "Zone "+action.zoneName+" successfully deleted.",
				filterParams:  { ...action.filterParams}
			};
		case zoneConstants.DELETE_FAILURE:
			// remove 'deleting:true' property and add 'deleteError:[error]' property to zone
			return {
				...state,
                zones: state.zones,
                error: action.error,
			};
		case zoneConstants.REFRESH: 
			return {
				...state,
				refresh: ! state.refresh
			}
		default:
			return state;
	}
}
