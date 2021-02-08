import { recordConstants } from '../_constants';

export function records(state = { records: [] }, action) {
	switch (action.type) {
		// get all records for a zone

		case recordConstants.GETALL_REQUEST:
			return {
				records: [],
				loading: true
			};
		case recordConstants.GETALL_SUCCESS:
			return {
				records: action.records,
				zoneName: action.zoneName
			};
		case recordConstants.GETALL_FAILURE:
			return {
				error: action.error
			};

		// update record

		case recordConstants.UPDATE_REQUEST:
			return {
				records: state.records,
				zoneName: state.zoneName,
				loading: true
            };           
		case recordConstants.UPDATE_SUCCESS:
			return {
				records: state.records.map((record) => {
					if (record.Id !== action.record.Id) {
						return record;
                    }
                    return {
						...record,
						...action.record
					};
				}),
                loading: false,
                success: true,
				recordId: action.record.Id,
				zoneName: state.zoneName
			};
		case recordConstants.UPDATE_FAILURE:
			return {
                records: state.records,
                error: action.error,
				recordId: action.recordId,
				zoneName: state.zoneName,
			};

		// create record

		case recordConstants.CREATE_REQUEST:
			return {
				records: state.records,
				zoneName: state.zoneName,
				loading: true
			};
		case recordConstants.CREATE_SUCCESS:
			return {
                records: [].concat([action.record],state.records), 
                loading: false,
                success: true,
                recordId: action.record.Id,
				newRecord: true,
				zoneName: state.zoneName
			};
		case recordConstants.CREATE_FAILURE:
            return {
                records: state.records,
                error: action.error,
                recordId: false,
				newRecord: true,
				zoneName: state.zoneName
			};;

		// delete record

		case recordConstants.DELETE_REQUEST:
			// add 'deleting:true' property to record being deleted
			return {
				loading:true, 
				records : state.records,
				zoneName: state.zoneName,
			};
		case recordConstants.DELETE_SUCCESS:
			// remove deleted record from state
			return {
				zoneName: state.zoneName,
				records: state.records.filter((record) => record.Id !== action.record.Id)
			};
		case recordConstants.DELETE_FAILURE:
			// remove 'deleting:true' property and add 'deleteError:[error]' property to record
			return {
				...state,
				records: state.records.map((record) => {
					if (record.Id === action.Id) {
						// make copy of record without 'deleting:true' property
						const { deleting, ...recordCopy } = record;
						// return copy of record with 'deleteError:[error]' property
						return { ...recordCopy, deleteError: action.error };
					}

					return record;
				})
			};
		default:
			return state;
	}
}
