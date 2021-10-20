import React from "react";
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import filterFactory, { textFilter, dateFilter, multiSelectFilter } from 'react-bootstrap-table2-filter';
import { connect } from 'react-redux';
import { logActions } from '../_actions';
import {defaultLogFilters} from '../defaults.js'
import {Modal, Button} from 'react-bootstrap'
import { FaEye } from 'react-icons/fa';
import {LogLevel,Entry} from '.'
import { Filters, FilterElement } from '../_helpers';


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

const cellFormater  = (cell, row, rowIndex, colIndex,width) => {
  let css = {
    padding: 0,
    paddingLeft:"15px",
    verticalAlign: "middle"
  } 

    return css
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
    }

    this.rootDescendants = this.props.rootDescendants

  }
  getColumns = () => {
    const logLevel = new LogLevel()
    this.columns = [{
      dataField: 'CreatedDate',
      text: 'Date',
      formatter: dateFormatter, 
      style : cellFormater,
      filter: dateFilter(),   
      sort: true,
      headerStyle: {width:"180px"}
    }, {
      dataField: 'loginUser.username',
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
            options: logLevel.formatForTable()
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
        formatter: (cellContent, row) => { return <FaEye style={{color:'grey'}} size="20px"></FaEye>}
      }
];
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
    searchParameters.filter = this.getFilters(searchParameters.filter).items
    if(searchParameters.users !== this.state.lastUsers) {
      this.props.filter(searchParameters,this.props.log)
      this.setState({lastUsers:searchParameters.users})
    }
  }
  getFilters(filters) {
    return new Filters(filters)
  }
  async handleTableChange  (type, { page, sizePerPage, filters, sortField, sortOrder, cellEdit }) {
    const filter = this.getFilters(filters)
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
      expandRow={{
        showExpandColumn: true,
        renderer: row => (<Entry data={{...row}} key = {row.Id}></Entry>)
      }}
    />  
  }
}
const actionCreators = {
  filter: logActions.filter
}
function mapState(state) {
  const { user } = state.authentication;
  const { data, refresh,success, progress } = state.log;
  const { impersonate } = state.usertree;
  return { user, data,  impersonate, refresh, zoneMessage : {success,progress} };
}
const connectedLogTable = connect(mapState, actionCreators)(LogTable)
export {connectedLogTable as LogTable}