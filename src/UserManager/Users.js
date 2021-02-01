import React from "react";
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import filterFactory, { textFilter, Comparator } from 'react-bootstrap-table2-filter';
import PropTypes from 'prop-types'
import { history } from '../_helpers';
import { connect } from 'react-redux';
import { userActions } from '../_actions';
import {defaultAccountFilters,defaultWorkerFilters} from '../defaults.js'
import {Modal, Button} from 'react-bootstrap'
import { FaEdit, FaTrash } from 'react-icons/fa';
import { AllowedRoles } from "../_components";
import {UpdateUser} from './UpdateUser'

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
      defaultSorted={ [{ dataField: defaultAccountFilters(user).sortField,  order: defaultAccountFilters(user).sortOrder}] }
      filter={ filterFactory() }
      pagination={ paginationFactory({ page, sizePerPage, totalSize }) }
      onTableChange={ onTableChange }  
      expandRow={{
        showExpandColumn: true,
        renderer: row => (<UpdateUser data={{...row}} action = "update"></UpdateUser>)
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

class Users extends React.Component {
  constructor(props) {
    super(props);
    this.handleTableChange = this.handleTableChange.bind(this);
    this.user = this.props.user.user
    this.filters = this.props.isWorker ? defaultWorkerFilters(this.user.username) : defaultAccountFilters(this.user.username) 
    this.filterName = this.props.isWorker ? "defaultWorkerFilters" : "defaultAccountFilters" 
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
      dataField: 'email',
      text: 'Email',
      sort: true,
      filter: textFilter()
    
    },{
      dataField: 'created',
      text: 'Created',
      type : 'date',
      formatter : dateFormatter,
      sort: true,
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
      formatter: (cellContent, row) => { return <><button title="Edit User" className="btn edit-button"  data-row={row.UserName}><FaEdit  size="20px"></FaEdit></button> <AllowedRoles roles={["admin","user_editor"]}><button title="Delete User" className="btn delete-button" data-row={row.UserName} onClick={this.deleteDialog.bind(this)}><FaTrash size="20px"></FaTrash></button></AllowedRoles></>}
    }];    
    this.deleteUser = this.deleteUser.bind(this)    
    this.closeDialog = this.closeDialog.bind(this)  
  }
  deleteDialog(event) {
    this.state.showDialog = true;
    this.state.deleteUserName = event.currentTarget.dataset.row
    this.state.data = this.props.users.data 
    this.setState(this.state)
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
    this.state.showDialog = false;
    this.setState(this.state)
  }
  componentDidMount() {
    const searchParameters = this.filters
    searchParameters.users = searchParameters.users ||  this.user.username
    this.props.filter(searchParameters,this.props.users)
  }
  componentDidUpdate() {
    const searchParameters = this.filters
    searchParameters.users = this.getImpersonated()
    if(searchParameters.users !== this.state.lastUsers) {
      this.props.filter(searchParameters,this.props.zones)
      this.setState({lastUsers:searchParameters.users})
    }
  }
  getImpersonated() {
    return this.props.impersonate || this.filters.users || this.user.username 
  }
  handleTableChange =  (type, { page, sizePerPage, filters, sortField, sortOrder, cellEdit })  => {
    const self = this
    filters.type = { filterVal : this.filters.type}
    const queryArray = Object.keys(filters).map(filterName => {
      const filter = filters[filterName]
      return "@" + filterName + ":" + filter.filterVal.replace(/\./g,"").replace(/\-/,"_")+"*"
    })
    const filter  = queryArray.length > 0 ? queryArray.join(" ") : "*"
    const users = this.getImpersonated();
    sortField = sortField || this.filters.sortField
    sortOrder = sortOrder  || this.filters.sortOrder
    const searchParameters = {page,sizePerPage,filter,sortField,sortOrder,users, type: this.filters.type }
    localStorage.setItem(this.filterName+'_' + this.user.username, JSON.stringify(searchParameters))
    this.props.filter(searchParameters,this.props.users).then(() => {
      self.setState({
        data:this.props.users.data, 
        totalSize: this.props.users.totalSize,
        page, sizePerPage
      })
    })
  }
  render() {     
    const page = this.props.filterParams ? this.props.filterParams.page : this.state.page
    const sizePerPage = this.props.filterParams ? this.props.filterParams.sizePerPage : this.state.sizePerPage
    let data = this.props.users ? this.props.users.data  : this.state.data
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
      <RemoteAll
        data={ data || [] }
        page={ page || 1}
        columns = {this.columns}
        user = {this.user.username}
        sizePerPage={ sizePerPage | this.filters.sizePerPage}
        totalSize={ this.props.users &&  this.props.users.totalSize ? this.props.users.totalSize : this.state.totalSize }
        onTableChange={ this.handleTableChange }       
      />
      </>    
  }
}
const actionCreators = {
  filter: userActions.filter,
  deleteUser: userActions.delete
}
function mapState(state) {
  const { user } = state.authentication;
  const { users,filterParams } = state.users;
  const { rootDescendants, descendants, impersonate } = state.usertree;
  return { user, users, filterParams, rootDescendants, descendants,impersonate };
}
const connectedUsers = connect(mapState, actionCreators)(Users)
export {connectedUsers as Users}