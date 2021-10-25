import { FaEye } from 'react-icons/fa';
import { logActions } from '../_actions';
import { connect } from 'react-redux';
import { RemoteTableService } from '../_components';
import { Filters, FilterElement, dateFormatter, cellFormater } from '../_helpers';
import { defaultLogFilters } from '../defaults.js';
import React from 'react';

const columns = () => {
	return [
		{
			dataField: 'CreatedDate',
			text: 'Date',
			formatter: dateFormatter,
			style: cellFormater,
			sort: true,
			headerStyle: { width: '180px' }
		},
		{
			dataField: 'action',
			text: 'Action',
			style: cellFormater,
			sort: true,
			headerStyle: { width: '180px' }
		},
		{
			dataField: 'loginUser.username',
			text: 'Login',
			sort: true,
			style: cellFormater,
			headerStyle: { width: '135px' }
		},
		{
			dataField: 'oldData.Source',
			text: 'Old Source',
			sort: true,
			style: cellFormater
		},
		{
			dataField: 'oldData.Target',
			text: 'Old Target',
			sort: true,
			style: cellFormater
		},
		{
			dataField: 'message',
			text: 'Message',
			sort: true,
			style: cellFormater
		},

		{
			dataField: 'View',
			text: 'View',
			style: cellFormater,
			headerStyle: { width: '70px' },
			formatter: (cellContent, row) => {
				return <FaEye style={{ color: 'grey' }} size="20px" />;
			}
		}
	];
};

class LogTableZone extends React.Component {
	getFilters = () => {
		const filters = new Filters();
		//zone
		const filterZoneName = new FilterElement();
		filterZoneName.setType('TagFilterElement');
		filterZoneName.setValue(this.props.zoneName);
		filters.addFilter('objectName', filterZoneName);
		// level
		const filterLevel = new FilterElement();
		filterLevel.setType('FilterElement');
		filterLevel.setValue('completed');
		filters.addFilter('level', filterLevel);
		return filters;
	};
	render() {
		return (
			<RemoteTableService
				columns={columns}
				filterAction={this.props.filter}
				name="Log"
				defaultFilters={defaultLogFilters}
				additionalFilters={this.getFilters}
			/>
		);
	}
}
const actionCreators = {
  filter: logActions.filter
}
const connectedLogTableZone = connect(null, actionCreators)(LogTableZone)
export { connectedLogTableZone as LogTableZone }

