import React from 'react'
import  { textFilter, dateFilter, multiSelectFilter} from 'react-bootstrap-table2-filter'
import { connect } from 'react-redux'
import { logActions } from '../_actions'
import { FaEye } from 'react-icons/fa'
import { LogLevel } from '.'
import {RemoteTableService} from '../_components'
import {getDefaultFilter, dateFormatter, cellFormater} from '../_helpers'
import { defaultLogFilters } from '../defaults.js'
import {  Entry } from '../Log'


const actions = {
  "search" : "search",
  "create" : "create",
  "update" : "update",
  "delete" : "delete",
  "login" : "login",
  "reset password" :"reset password",
  "reset 2fa" :"reset 2fa" ,
}

const columns = (searchParameters) => {
  const logLevel = new LogLevel()
  return [
    {
      dataField: 'CreatedDate',
      text: 'Date',
      formatter: dateFormatter,
      style: cellFormater,
      filter: dateFilter(getDefaultFilter(searchParameters,'CreatedDate')),
      sort: true,
      headerStyle: { width: '180px' }
    },
  
    {
      dataField: 'loginUser.username',
      text: 'Login',
      sort: true,
      style: cellFormater,
      filter: textFilter(
        getDefaultFilter(searchParameters,'loginUser.username')
      ),
      headerStyle: { width: '135px' }
    },
    {
      dataField: 'objectName',
      text: 'Object',
      sort: true,
      style: cellFormater,
      filter: textFilter(getDefaultFilter(searchParameters,'objectName')),
      headerStyle: { width: '135px' }
    },  
    {
      dataField: 'action',
      text: 'Action',
      sort: true,
      style: cellFormater,
      filter: multiSelectFilter({
        ...getDefaultFilter(searchParameters,'action'),
        options: actions
      }),
      headerStyle: { width: '135px' }
    },  
    {
      dataField: 'level',
      text: 'Level',
      sort: true,
      formatter: cellContent => {
        return <LogLevel name={cellContent}></LogLevel>
      },
      style: cellFormater,
      filter: multiSelectFilter({
        ...getDefaultFilter(searchParameters,'level'),
        options: logLevel.formatForTable()
      }),
      headerStyle: { width: '135px' }
    },
    {
      dataField: 'message',
      text: 'Message',
      sort: true,
      formatter: (cell) => cell.message || cell,
      style: cellFormater,
      filter: textFilter(getDefaultFilter(searchParameters,'message'))
    },


    {
      dataField: 'View',
      text: 'View',
      style: cellFormater,
      headerStyle: { width: '70px' },
      formatter: () => {
        return <FaEye style={{ color: 'grey' }} size='20px'></FaEye>
      }
    }
  ]
}

class LogTable extends React.Component {  
  render () {
    console.log("render")
    const data = this.props.data || []
    const totalSize = this.props.totalSize || 0
    return <RemoteTableService
    columns = {columns}
    filterAction = {this.props.filter}
    name = "Log"
    data = {data}
    totalSize = {totalSize}
    defaultFilters = {defaultLogFilters}
    expandRow = {{
      showExpandColumn: true,
      renderer: row => <Entry data={{ ...row }} key={row.Id}></Entry>
    }}
  ></RemoteTableService>
  }

}
const actionCreators = {
  filter: logActions.filter
}
function mapState (state) {
  const { data, totalSize } = state.log  
  const { impersonate } = state.usertree
  return { data,  totalSize, impersonate}
}
const connectedLogTable = connect(mapState, actionCreators)(LogTable)
export { connectedLogTable as LogTable }
