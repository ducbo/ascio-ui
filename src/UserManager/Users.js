import React from 'react'
import  { textFilter } from 'react-bootstrap-table2-filter'
import { connect } from 'react-redux'
import { userActions, alertActions } from '../_actions';
import {RemoteTableService} from '../_components'
import { dateFormatter } from '../_helpers'
import { defaultAccountFilters } from '../defaults.js'
import { FaEdit, FaTrash } from 'react-icons/fa';
import { AllowedRoles } from "../_components";
import {DeleteUser} from "."
import {UpdateUser} from './UpdateUser'

class Users extends React.Component {
  constructor(props) {
    super(props);
    this.user = this.props.user.user
    this.state ={
        showDialog : false,
        deleteUsername: "not set"
      }
    this.rootDescendants = this.props.rootDescendants
  }
  getColumns = (searchParameters) => {
    return [{
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
    
    },
    {
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
  }
  deleteDialog = (e) => {
    this.setState(    {
      showDialog : true,
      deleteUsername : e.currentTarget.dataset.row
    })
  }
  render () {
    const data = this.props.list 
    const totalSize =  this.props.totalSize
    return <>
    <RemoteTableService
    columns = {this.getColumns}
    filterAction = {this.props.filter}
    name = "Account"
    data = {data}
    totalSize = {totalSize}
    defaultFilters = {defaultAccountFilters}
    expandRow={{
        showExpandColumn: true,
        renderer: row => (<UpdateUser data={{...row}} action = "update"></UpdateUser>)
    }}
  ></RemoteTableService>,
      <DeleteUser
          username = {this.state.deleteUsername}
          show = {this.state.showDialog}           
          close = {() => {this.setState({showDialog : false})}}
    ></DeleteUser>
    </>
  }

}
const actionCreators = {
  filter: userActions.filter,
  message : alertActions.message,
	progress: alertActions.progress,
}
function mapState(state) {
  const { user } = state.authentication;
  const { list, totalSize } = state.users;
  const { rootDescendants } = state.usertree;
  return { user, list, totalSize, rootDescendants};
}
const connectedUsers = connect(mapState, actionCreators)(Users)
export {connectedUsers as Users}
