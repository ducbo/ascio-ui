import React from "react";
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import filterFactory, { textFilter, Comparator } from 'react-bootstrap-table2-filter';
import PropTypes from 'prop-types'
import { history } from '../_helpers';
import { connect } from 'react-redux';
import { userActions } from '../_actions';
import {defaultAccountFilters} from '../defaults.js'
import {Modal, Button} from 'react-bootstrap'
import { FaEdit, FaTrash } from 'react-icons/fa';
import { AllowedRoles } from "../_components";

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
  history.push("/user/" + target)
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
      defaultSorted={ [{ dataField: defaultAccountFilters(user).sortField,  order: defaultAccountFilters(user).sortOrder
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

class Users extends React.Component {
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
      users : props.users
      }
    const columns1 = [{
      dataField: 'username',
      text: 'Username',    
      sort: true,
      filter: textFilter()
    }, {
      dataField: '_clientId',
      text: 'Owner',
      sort: true,
      filter: textFilter()
    
    }];
    const columns3 = [ {
      dataField: 'CreatedDate',
      text: 'Created',
      type : 'date',
      formatter : dateFormatter,
      sort: true,
    }, {
      dataField: 'Edit',
      text: 'Edit',
      style : {
        padding:0
      },
      formatter: (cellContent, row) => { return <><button title="Edit User" className="btn edit-button"  data-row={row.UserName} onClick={editButton}><FaEdit  size="20px"></FaEdit></button> <AllowedRoles roles={["admin","user_editor"]}><button title="Delete User" className="btn delete-button" data-row={row.UserName} onClick={this.deleteDialog.bind(this)}><FaTrash size="20px"></FaTrash></button></AllowedRoles></>}
    }];

    const user = JSON.parse(localStorage.getItem('user'))
    let columns2 = []
    if(user.user && user.user.roles && user.user.roles.includes('admin')) {
      columns2  = [{
        dataField: 'api',
        text: 'Api',
        sort: true,
        filter: textFilter()
      }]
    }
    this.columns = columns1.concat(columns2,columns3)
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
    const filters = this.props.filterParams || defaultAccountFilters(this.user.username);
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
    const searchParameters = defaultAccountFilters(this.user.username)
    searchParameters.users = searchParameters.users ||  this.user.username
    this.props.filter(searchParameters,this.props.users)
  }
  handleTableChange  (type, { page, sizePerPage, filters, sortField, sortOrder, cellEdit }) {
    const self = this
    const queryArray = Object.keys(filters).map(filterName => {
      const filter = filters[filterName]
      return "@" + filterName + "Search:" + filter.filterVal.replace(/\./g,"").replace(/\-/,"_")+"*"
    })
    const filter  = queryArray.length > 0 ? queryArray.join(" ") : "*"
    const users = defaultAccountFilters(this.user.username).users || this.user.username;
    sortField = sortField || defaultAccountFilters(this.user.username).sortField
    sortOrder = sortOrder  || defaultAccountFilters(this.user.username).sortOrder
    const searchParameters = {page,sizePerPage,filter,sortField,sortOrder,users }
    localStorage.setItem('defaultAccountFilters_' + this.user.username, JSON.stringify(searchParameters))
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
        sizePerPage={ sizePerPage | defaultAccountFilters(this.user.username).sizePerPage}
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
  const { rootDescendants, descendants } = state.usertree;
  return { user, users, filterParams, rootDescendants, descendants };
}
const connectedUsers = connect(mapState, actionCreators)(Users)
export {connectedUsers as Users}