import React from "react";
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import filterFactory, { textFilter, dateFilter, multiSelectFilter } from 'react-bootstrap-table2-filter';
import { history,Filters } from '../_helpers';
import { connect } from 'react-redux';
import { logActions } from '../_actions';
import {defaultLogFilters} from '../defaults.js'
import {Modal, Button} from 'react-bootstrap'
import { FaEye } from 'react-icons/fa';
import {LogLevel} from './LogLevel'

function dateFormatter (date, row) {    
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
const selectOptions = {
        "completed" : "completed",
        "failed" : "failed",
        "waiting" : "waiting",
        "security" : "security", 
        "error" : "error",        
        "warn" : "warn",
        "info" : "info",
        "verbose" : "verbose",
        "debug" : "debug"
};
const cellFormater  = (cell, row, rowIndex, colIndex,width) => {
  let css = {
    padding: 0,
    paddingLeft:"15px",
    verticalAlign: "middle"
  } 

    return css
}
const editButton = (cellContent) => {
  const target = cellContent.currentTarget.dataset.row
  history.push("/zone/" + target)
}

class LogTable extends React.Component {
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

    this.rootDescendants = this.props.rootDescendants

  }
  getColumns = () => {
    const columns1 = [{
      dataField: 'CreatedDate',
      text: 'Date',
      formatter: dateFormatter, 
      style : cellFormater,
      filter: dateFilter(),   
      sort: true,
      headerStyle: {width:"180px"}
    }, {
      dataField: 'loginUser__username',
      text: 'Login',
      sort: true,
      style : cellFormater,
      filter: textFilter(),
      headerStyle: {width:"135px"}
    
    }
,
      {
        dataField: 'objectName',
        text: 'Object',
        sort: true,
        style : cellFormater,
        filter: textFilter(), 
        headerStyle: {width:"135px"}     
      },
      {
        dataField: 'level',
        text: 'Level',
        sort: true,
        formatter: (cellContent) => {
          return <LogLevel name={cellContent}></LogLevel>
        },
        style: cellFormater,
        filter: multiSelectFilter({
            options: selectOptions
          }),
        headerStyle: {width:"135px"}    
      },
      {
        dataField: 'message',
        text: 'Message',
        sort: true,
        style :cellFormater,
        filter: textFilter(),      
      },
      {
        dataField: 'View',
        text: 'View',
        style : cellFormater,
        headerStyle: {width:"70px"},
        formatter: (cellContent, row) => { return <><button title="Edit Zone" className="btn edit-button"  data-row={row.ZoneName} onClick={editButton}><FaEye  size="20px"></FaEye></button> </>}
      }
];
    const columns3 = [];

    const user = JSON.parse(localStorage.getItem('user'))
    this.columns = columns1.concat(columns3)
    return this.columns
  }
  componentDidMount() {
    const searchParameters = defaultLogFilters(this.user.username)
    searchParameters.users = this.getImpersonated()
    //this.props.filter(searchParameters,this.props.log)
    console.log("mount")
  }
  componentDidUpdate() {
    // this.setState({options: this.props.rootDescendants})
    const searchParameters = defaultLogFilters(this.user.username)
    searchParameters.users = this.getImpersonated()
    if(searchParameters.users !== this.state.lastUsers) {
      this.props.filter(searchParameters,this.props.log)
      this.setState({lastUsers:searchParameters.users})
    }
  }

  async handleTableChange  (type, { page, sizePerPage, filters, sortField, sortOrder, cellEdit }) {
    const self = this
    const filter = new Filters(filters)
    const users = this.getImpersonated();
    sortField = sortField || defaultLogFilters(this.user.username).sortField
    sortOrder = sortOrder  || defaultLogFilters(this.user.username).sortOrder    
    const searchParameters = {page,sizePerPage,filter: filter.get(),sortField,sortOrder,users }
    localStorage.setItem('defaultLogFilters_' + this.user.username , JSON.stringify(searchParameters))
    const filterResult =  await this.props.filter(searchParameters)
    this.setState({
        data: filterResult.logs.data, 
        totalSize: filterResult.logs.totalSize,
        page, sizePerPage
      }) 

  }
  getImpersonated() {
    return this.props.impersonate || defaultLogFilters(this.user.username).users || this.user.username 
  }
  render() {  
    let page = this.props.filterParams ? this.props.filterParams.page : this.state.page
    page = page || 1 
    let sizePerPage = this.props.filterParams ? this.props.filterParams.sizePerPage : this.state.sizePerPage
    sizePerPage = sizePerPage | defaultLogFilters(this.user.username).sizePerPage 
    let data =  this.props.data || this.state.data 
    const totalSize =  this.props.log &&  this.props.log.totalSize ? this.props.log.totalSize : this.state.totalSize  
    return   <BootstrapTable
      bootstrap4
      remote
      bordered={ false }
      hover
      condense
      keyField="key"
      data={ data || [] }
      columns = {this.getColumns()}
      defaultSorted={ [{ dataField: defaultLogFilters(this.user.username).sortField,  order: defaultLogFilters(this.user.username).sortOrder }] }
      filter={ filterFactory() }
      pagination={ paginationFactory({  page, sizePerPage, totalSize }) }
      onTableChange={ this.handleTableChange  }  
    />  
  }
}
const actionCreators = {
  filter: logActions.filter
}
function mapState(state) {
  const { user } = state.authentication;
  const { data, refresh,success, progress } = state.log;
  const { rootDescendants, selectableUsers, descendants, impersonate } = state.usertree;
  return { user, data,  impersonate, refresh, zoneMessage : {success,progress} };
}
const connectedLogTable = connect(mapState, actionCreators)(LogTable)
export {connectedLogTable as LogTable}