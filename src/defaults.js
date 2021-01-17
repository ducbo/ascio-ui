const defaultZoneFilters = function (user)  {
	
	const storageFilters = localStorage.getItem('defaultZoneFilters_' + user);
	if (storageFilters) {
		const result =  JSON.parse(storageFilters);
		if(!result.page || result.page < 1) result.page=1;
		if(!result.sizePerPage || result.sizePerPage < 1) result.sizePerPage=10;
		if(!result.sortField ) result.sortField="ZoneName";
		if(!result.sortOrder) result.sortOrder="asc";
		if(!result.filter) result.filter="*";
		return result
	} else {
		return {
			page: 1,
			sizePerPage: 10,
			filter: '*',
			sortField: 'CreatedDate',
			sortOrder: 'desc',
			filter: '*'
		};
	}
}
export default defaultZoneFilters;