const getFilters = function(name,defaultSortField) {
	return function (user)  {	
		const storageFilters = localStorage.getItem('default'+name+'Filters_' + user);
		const impersonatedJson = localStorage.getItem('customer_tree_'+user+'_selected');
		let impersonated = null
		if(impersonatedJson) {
			impersonated = JSON.parse(impersonatedJson)
		} 
		if (storageFilters) {
			const result =  JSON.parse(storageFilters);
			if(!result.page || result.page < 1) result.page=1;
			if(!result.sizePerPage || result.sizePerPage < 1) result.sizePerPage=10;
			if(!result.sortField ) result.sortField=defaultSortField;
			if(!result.sortOrder) result.sortOrder="asc";
			if(!result.filter) result.filter="*";
			if(impersonated) result.users = impersonated
			return result
		} else {
			return {
				page: 1,
				sizePerPage: 10,
				filter: '*',
				sortField: defaultSortField,
				sortOrder: 'desc',
				type: name.toLowerCase(),
				users : impersonated
			};
		}
	}
}

export const defaultZoneFilters = getFilters("Zone","CreatedDate")
export const defaultAccountFilters = getFilters("Account","created")
export const defaultWorkerFilters = getFilters("Worker","created")

