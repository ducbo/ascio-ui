import React from 'react'
import  { textFilter, dateFilter} from 'react-bootstrap-table2-filter'
import { connect } from 'react-redux'
import { zoneActions, alertActions } from '../_actions';
import {RemoteTableService} from '../_components'
import { dateFormatter, getDefaultFilter} from '../_helpers'
import { defaultZoneFilters } from '../defaults.js'
import { FaEdit, FaTrash } from 'react-icons/fa';
import { AllowedRoles } from "../_components";
import {ZoneUserSelector} from "../Zone";
import { history } from '../_helpers';
import {DeleteZone} from '.'

const editButton = (cellContent) => {
  const target = cellContent.currentTarget.dataset.row
  history.push("/zone/" + target)
}

class Zones extends React.Component {
  constructor(props) {
    super(props);
    this.user = this.props.user.user
    this.state ={
        showDialog : false,
        deleteZoneName: "not set"
      }
    this.deleteZone = this.deleteZone.bind(this)    
    this.closeDialog = this.closeDialog.bind(this)
    this.rootDescendants = this.props.rootDescendants
  }
  getColumns = (searchParameters) => {
    const columns1 = [{
      dataField: 'ZoneName',
      text: 'Zone',    
      sort: true,
      filter: textFilter(getDefaultFilter(searchParameters,'ZoneName'))
    }, {
      dataField: '_clientId',
      text: 'Account',
      sort: true,
      style : {
        padding:"4px"
      },
      headerStyle: {width:"300px"},
      filter: textFilter(getDefaultFilter(searchParameters,'_clientId')),      
      formatter: (cellContent, row) => { 
        return <ZoneUserSelector
          zoneName={row.ZoneName}
          selected = {{ id : row._clientId, name : row._clientName}}
        ></ZoneUserSelector>
      
      }
    
    }];
    const columns3 = [ {
      dataField: 'CreatedDate',
      text: 'Created',
      type : 'date',
      headerStyle: {width:"150px"},
      formatter : dateFormatter,
      sort: true,
    }, {
      dataField: 'Edit',
      text: 'Edit',
      headerStyle: {width:"100px"},
      style : {
        padding:0
      },
      formatter: (cellContent, row) => { return <><button title="Edit Zone" className="btn edit-button"  data-row={row.ZoneName} onClick={editButton}><FaEdit  size="20px"></FaEdit></button> <AllowedRoles roles={["admin","zone_editor"]}><button title="Delete Zone" className="btn delete-button" data-row={row.ZoneName}  onClick={this.deleteDialog}><FaTrash size="20px"></FaTrash></button></AllowedRoles></>}
    }];

    const user = JSON.parse(localStorage.getItem('user'))
    let columns2 = []
    if(user.user && user.user.roles && user.user.roles.includes('admin')) {
      columns2  = [{
        dataField: 'api',
        text: 'Api',
        sort: true,
        headerStyle: {width:"200px"},
        filter: textFilter(getDefaultFilter(searchParameters,'api'))
      }]
    }
    this.columns = columns1.concat(columns2,columns3)
    return this.columns
  }
  deleteDialog = (e) => {
    this.setState(    {
      showDialog : true,
      deleteZoneName : e.currentTarget.dataset.row
    })
  }
  async deleteZone() {
    const searchParameters = defaultZoneFilters(this.user.username)
    //searchParameters.users = this.getImpersonated()
    this.props.progress("Deleting zone "+this.state.deleteZoneName)
    this.closeDialog();
    await this.props.deleteZone(this.state.deleteZoneName,searchParameters)
    this.props.message(this.props.zoneMessage) 
  }
  closeDialog = () => {
    this.setState({ showDialog : false })
  }

  render () {
    const data = this.props.zones ? this.props.zones.data : []
    const totalSize = this.props.zones ? this.props.zones.totalSize : 0
    return <>
    <RemoteTableService
    columns = {this.getColumns}
    filterAction = {this.props.filter}
    name = "Zone"
    data = {data}
    totalSize = {totalSize}
    defaultFilters = {defaultZoneFilters}
  ></RemoteTableService>,
      <DeleteZone
          zoneName = {this.state.deleteZoneName}
          show = {this.state.showDialog}           
          close = {() => {this.setState({showDialog : false})}}
    ></DeleteZone>
    </>
  }

}
const actionCreators = {
  filter: zoneActions.filter,
  deleteZone: zoneActions.delete,
  message : alertActions.message,
	progress: alertActions.progress,
}
function mapState(state) {
  const { user } = state.authentication;
  const { zones, success, progress } = state.zones;
  const { rootDescendants } = state.usertree;
  return { user, zones, rootDescendants, zoneMessage : {success,progress} };
}
const connectedZones = connect(mapState, actionCreators)(Zones)
export {connectedZones as Zones}
