import React from "react";
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
import PropTypes from 'prop-types'
import { connect } from 'react-redux';
import { workerActions } from '../_actions';
import {defaultWorkerFilters} from '../defaults.js'
import {Modal, Button} from 'react-bootstrap'
import { FaEdit, FaTrash } from 'react-icons/fa';
import { AllowedRoles } from "../_components";
import {UpdateWorker} from './UpdateWorker'

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


const RemoteAll = ({ data, page, sizePerPage, onTableChange, totalSize, columns,user}) => (
  <div>
    <BootstrapTable
      bootstrap4
      remote
      striped
      hover
      condense
      keyField="username"
      data={ data }
      columns={ columns }
      defaultSorted={ [{ dataField: defaultWorkerFilters(user).sortField,  order: defaultWorkerFilters(user).sortOrder}] }
      filter={ filterFactory() }
      pagination={ paginationFactory({ page, sizePerPage, totalSize }) }
      onTableChange={ onTableChange }  
      expandRow={{
        showExpandColumn: true,
        renderer: row => (<UpdateWorker data={{...row}} action = "update"></UpdateWorker>)
      }}
      classes="expand-table" 
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

class Workers extends React.Component {
  constructor(props) {
    super(props);
    this.handleTableChange = this.handleTableChange.bind(this);
    this.user = this.props.user
    this.filters = defaultWorkerFilters(this.user.username)
    this.filterName = "defaultWorkerFilters" 
    this.state ={
      data: [],
      totalSize:0,
      sizePerPage : 10, 
      page: 1,
      showDialog : false, 
      users : this.getImpersonated(),
      lastUsers : null
      }
    this.columns = [{
      dataField: 'username',
      text: 'Username',    
      sort: true,
      filter: textFilter()
    }, {
      dataField: 'company',
      text: 'Company',
      sort: true,
      filter: textFilter()
    
    },
    {
      dataField: 'works_for',
      text: 'Works for',
      sort: true,
      filter: textFilter(),
      formatter: (cellContent) => { return cellContent.replace(" ", ", ")}
    
    },
    {
      dataField: 'email',
      text: 'Email',
      sort: true,
      filter: textFilter()
    
    },{
      dataField: 'updated',
      text: 'Updated',
      type : 'date',
      formatter : dateFormatter,
      sort: true,
    }, {
      dataField: 'Edit',
      text: 'Edit',
      style : {
        padding:0
      },
      formatter: (cellContent, row) => { return <><button title="Edit User" className="btn edit-button"  data-row={row.username}><FaEdit  size="20px"></FaEdit></button> <AllowedRoles roles={["admin","user_editor"]}><button title="Delete User" className="btn delete-button" data-row={row.username} onClick={this.deleteDialog.bind(this)}><FaTrash size="20px"></FaTrash></button></AllowedRoles></>}
    }];    
    this.deleteUser = this.deleteUser.bind(this)    
    this.closeDialog = this.closeDialog.bind(this)  
  }
  deleteDialog(event) {
    this.setState({
      showDialog : true,
      deleteUserName : event.currentTarget.dataset.row,
      data : this.props.list
    })
  }
  deleteUser() {
    const self = this
    const filters = this.props.filterParams || this.filters;
    this.props.deleteUser(this.state.deleteUserName,filters)
    .then(() =>{
      self.closeDialog();
    })
  }
  closeDialog() {
    this.setState({showDialog : false})
  }
  getImpersonated() {
    return this.props.impersonate || this.filters.users || this.user.username 
  }
  componentDidMount() {
    const searchParameters = this.filters
    searchParameters.users = this.getImpersonated()
    this.props.filter(searchParameters)
    this.setFilter(searchParameters)
    this.lastUsers = searchParameters.users
  }
  componentDidUpdate() {
    const searchParameters = this.filters
    searchParameters.users = this.getImpersonated()
    if(this.lastUsers && (searchParameters.users !== this.lastUsers)) {
      this.props.filter(searchParameters)
      this.setFilter(searchParameters)
      this.lastUsers = searchParameters.users
    } else {
      this.lastUsers = searchParameters.users
    }
  }
  handleTableChange =  (type, { page, sizePerPage, filters, sortField, sortOrder, cellEdit })  => {
    filters.type = { filterVal : this.filters.type}
    const queryArray = Object.keys(filters).map(filterName => {
      const filter = filters[filterName]
      return "@" + filterName + ":" + filter.filterVal.replace(/\./g,"").replace(/-/,"_")+"*"
    })
    const filter  = queryArray.length > 0 ? queryArray.join(" ") : "*"
    const users = this.getImpersonated();
    sortField = sortField || this.filters.sortField
    sortOrder = sortOrder  || this.filters.sortOrder
    const searchParameters = {page,sizePerPage,filter,sortField,sortOrder,users, type: this.filters.type }
    this.props.filter(searchParameters,this.props.workers)
    this.setFilter(searchParameters)
  }
  setFilter(searchParameters) {
    localStorage.setItem(this.filterName+'_' + this.user.username, JSON.stringify(searchParameters))
  }
  render() {     
    const page =  this.props.filterParams.page 
    const sizePerPage =  this.props.filterParams.sizePerPage 
    let data = this.props.list
    return <>  
        <Modal  style={{opacity:1}} show={this.state.showDialog} onHide={this.closeDialog}>
          <Modal.Header closeButton>
            <Modal.Title>Delete user: {this.state.deleteUserName}</Modal.Title>
          </Modal.Header>
          <Modal.Body>Do you want to delete the user {this.state.deleteUserName}?</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.closeDialog}>
              Close
            </Button>
            <Button variant="primary" id={this.state.deleteUserName} onClick={this.deleteUser}>
              Delete user
            </Button>
          </Modal.Footer>
        </Modal>
        <div className="card record-inputs">
          <div className="card-header">
            <h5>Edit Workers</h5>
          </div>
          <div className="card-body">
          <RemoteAll
              data={ data || [] }
              page={ page || 1}
              columns = {this.columns}
              user = {this.user.username}
              sizePerPage={ sizePerPage | this.filters.sizePerPage}
              totalSize={  this.totalSize || this.state.totalSize }
              onTableChange={ this.handleTableChange }  />  
          </div>
      </div>
      </>    
  }
}
const actionCreators = {
  filter: workerActions.filter,
  deleteUser: workerActions.delete
}
function mapState(state) {
  const { workers, authentication} = state
  const { user } = authentication
  const { list, filterParams, totalSize } = workers;
  const { impersonate } = state.usertree;
  return { user : user.user , list, totalSize, filterParams, impersonate };
}
const connectedWorkers = connect(mapState, actionCreators)(Workers)
export {connectedWorkers as Workers}