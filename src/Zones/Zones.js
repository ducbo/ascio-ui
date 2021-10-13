import React from "react";
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
import PropTypes from 'prop-types'
import { history } from '../_helpers';
import { connect } from 'react-redux';
import { zoneActions, alertActions } from '../_actions';
import {defaultZoneFilters} from '../defaults.js'
import {Modal, Button} from 'react-bootstrap'
import { FaEdit, FaTrash } from 'react-icons/fa';
import { AllowedRoles } from "../_components";
import {ZoneUserSelector} from "../Zone";

function dateFormatter (cell, row) {
  const date = new Date(parseInt(cell))  
  let month = date.getMonth() + 1;
  let day = date.getDate();
  let hour = date.getHours();
  let min = date.getMinutes();
    
  month = (month < 10 ? "0" : "") + month;
  day = (day < 10 ? "0" : "") + day;
  hour = (hour < 10 ? "0" : "") + hour;
  min = (min < 10 ? "0" : "") + min;
  return day + "." + month + "." + date.getFullYear() + " - " +hour + ":" + min
  }



const editButton = (cellContent) => {
  const target = cellContent.currentTarget.dataset.row
  history.push("/zone/" + target)
}


const RemoteAll = ({ data, page, sizePerPage, onTableChange, totalSize, columns,user}) => (
  <div>
    <BootstrapTable
      bootstrap4
      remote
      bordered={ false }
      hover
      condense
      keyField="ZoneName"
      data={ data }
      columns={ columns }
      defaultSorted={ [{ dataField: defaultZoneFilters(user).sortField,  order: defaultZoneFilters(user).sortOrder
}] }
      filter={ filterFactory() }
      pagination={ paginationFactory({ page, sizePerPage, totalSize }) }
      onTableChange={ onTableChange }  
    />
  </div>
);

RemoteAll.propTypes = {
  data: PropTypes.array.isRequired,
  page: PropTypes.number.isRequired,
  totalSize: PropTypes.number.isRequired,
  sizePerPage: PropTypes.number.isRequired,
  onTableChange: PropTypes.func.isRequired
};

class Zones extends React.Component {
  constructor(props) {
    super(props);
    this.handleTableChange = this.handleTableChange.bind(this);
    this.user = this.props.user.user
    this.state ={
      data: [],
      totalSize:0,
      sizePerPage : 10, 
      page: 1,
      showDialog : false, 
      users : this.getImpersonated(),
      lastUsers : null,
      options : [],
      refresh : false
     // users : props.users
      }
    this.deleteZone = this.deleteZone.bind(this)    
    this.closeDialog = this.closeDialog.bind(this)

    this.rootDescendants = this.props.rootDescendants

  }
  getColumns = (users,selectableUsers) => {
    const columns1 = [{
      dataField: 'ZoneName',
      text: 'Zone',    
      sort: true,
      filter: textFilter()
    }, {
      dataField: '_clientId',
      text: 'Account',
      sort: true,
      style : {
        padding:"4px"
      },
      headerStyle: {width:"300px"},
      filter: textFilter(),      
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
      formatter: (cellContent, row) => { return <><button title="Edit Zone" className="btn edit-button"  data-row={row.ZoneName} onClick={editButton}><FaEdit  size="20px"></FaEdit></button> <AllowedRoles roles={["admin","zone_editor"]}><button title="Delete Zone" className="btn delete-button" data-row={row.ZoneName} onClick={this.deleteDialog.bind(this)}><FaTrash size="20px"></FaTrash></button></AllowedRoles></>}
    }];

    const user = JSON.parse(localStorage.getItem('user'))
    let columns2 = []
    if(user.user && user.user.roles && user.user.roles.includes('admin')) {
      columns2  = [{
        dataField: 'api',
        text: 'Api',
        sort: true,
        headerStyle: {width:"200px"},
        filter: textFilter()
      }]
    }
    this.columns = columns1.concat(columns2,columns3)
    return this.columns
  }
  deleteDialog(e) {
    this.setState(    {
      showDialog : true,
      deleteZoneName : e.currentTarget.dataset.row,
      data : this.props.zones.data 
    })
  }
  async deleteZone() {
    const searchParameters = defaultZoneFilters(this.user.username)
    searchParameters.users = this.getImpersonated()
    this.props.progress("Deleting zone "+this.state.deleteZoneName)
    this.closeDialog();
    await this.props.deleteZone(this.state.deleteZoneName,searchParameters)
    this.props.message(this.props.zoneMessage)

  }
  closeDialog() {
    this.setState({ showDialog : false })
  }
  componentDidMount() {
    const searchParameters = defaultZoneFilters(this.user.username)
    searchParameters.users = this.getImpersonated()
    //this.props.filter(searchParameters,this.props.zones)
  }
  componentDidUpdate() {
    // this.setState({options: this.props.rootDescendants})
    const searchParameters = defaultZoneFilters(this.user.username)
    searchParameters.users = this.getImpersonated()
    if(searchParameters.users !== this.state.lastUsers) {
      this.props.filter(searchParameters,this.props.zones)
      this.setState({lastUsers:searchParameters.users})
    }
  }
  handleTableChange  (type, { page, sizePerPage, filters, sortField, sortOrder, cellEdit }) {
    const self = this
    const queryArray = Object.keys(filters).map(filterName => {
      const filter = filters[filterName]
      return "@" + filterName + "Search:" + filter.filterVal.replace(/\./g,"").replace(/-/,"_")+"*"
    })
    const filter  = queryArray.length > 0 ? queryArray.join(" ") : "*"
    const users = this.getImpersonated();
    sortField = sortField || defaultZoneFilters(this.user.username).sortField
    sortOrder = sortOrder  || defaultZoneFilters(this.user.username).sortOrder
    const searchParameters = {page,sizePerPage,filter,sortField,sortOrder,users }
    localStorage.setItem('defaultZoneFilters_' + this.user.username , JSON.stringify(searchParameters))
    this.props.filter(searchParameters,this.props.zones).then(() => {
      self.setState({
        data:this.props.zones.data, 
        totalSize: this.props.zones.totalSize,
        page, sizePerPage
      })
    })
  }
  getImpersonated() {
    return this.props.impersonate || defaultZoneFilters(this.user.username).users || this.user.username 
  }
  render() {  
    const page = this.props.filterParams ? this.props.filterParams.page : this.state.page
    const sizePerPage = this.props.filterParams ? this.props.filterParams.sizePerPage : this.state.sizePerPage
    let data = this.props.zones ? this.props.zones.data  : this.state.data
    if(this.rootDescendants.length === 0 && this.props.rootDescendants.length > 0) {
      this.rootDescendants = this.props.rootDescendants
      data.forEach((row) => {
        row.refresh = true;
      })     
    }
    return <>  
        <Modal  style={{opacity:1}} show={this.state.showDialog} onHide={this.closeDialog}>
          <Modal.Header closeButton>
            <Modal.Title>Delete zone: {this.state.deleteZoneName}</Modal.Title>
          </Modal.Header>
          <Modal.Body>Do you want to delete the zone {this.state.deleteZoneName}?</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.closeDialog}>
              Close
            </Button>
            <Button variant="primary" id={this.state.deleteZoneName} onClick={this.deleteZone}>
              Delete zone
            </Button>
          </Modal.Footer>
        </Modal>
      <RemoteAll
        data={ data || [] }
        page={ page || 1}
        columns = {this.getColumns(this.props.rootDescendants, this.props.selectableUsers)}
        user = {this.user.username}
        sizePerPage={ sizePerPage | defaultZoneFilters(this.user.username).sizePerPage}
        totalSize={ this.props.zones &&  this.props.zones.totalSize ? this.props.zones.totalSize : this.state.totalSize }
        onTableChange={ this.handleTableChange }       
      />
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
  const { zones,filterParams, refresh,success, progress } = state.zones;
  const { rootDescendants, selectableUsers, descendants, impersonate } = state.usertree;
  return { user, zones, filterParams, rootDescendants, selectableUsers, descendants,impersonate, refresh, zoneMessage : {success,progress} };
}
const connectedZones = connect(mapState, actionCreators)(Zones)
export {connectedZones as Zones}