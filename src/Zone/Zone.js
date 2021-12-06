import React from "react";
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import filterFactory, { selectFilter,textFilter, Comparator } from 'react-bootstrap-table2-filter';
import {ConvertName, Record, DeleteRecord} from '../Record'
import {NameSwitch} from '../Record/NameSwitch'
import {Modal, Button} from 'react-bootstrap'
import { connect } from 'react-redux';
import { recordActions, alertActions } from '../_actions';
import NavProtected from '../NavProtected.js'
import { history } from '../_helpers';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css'
import 'react-widgets/dist/css/react-widgets.css';
import { FaEdit, FaTrash } from 'react-icons/fa';
import {LogTableZone} from '../Log'



const selectOptions = {
    "A" : "A",
    "AAAA" : "AAAA",
    "CNAME" : "CNAME",
    "MX" : "MX",
    "TXT" : "TXT",
    "NS" : "NS",
    "SRV" : "SRV",
    "SOA" : "SOA",
    "MailForward" : "MailForward",
    "WebForward" : "WebForward"
};

const defaultSorted = [{
  dataField: 'name',
  order: 'desc'
}];
class Zone extends React.Component {
  constructor(props) {
    super(props);
    this.state ={
      totalSize:0,
      page: 1,
      users : props.users,
      showDialog : false, 
      createType: {_type: "A", TTL : 3600, RedirectionType : "Permanent"}
    } 
    this.deleteRecord = this.deleteRecord.bind(this)    
    this.closeDialog = this.closeDialog.bind(this)  
    this.zoneName = this.props.match.params.zoneName
    this.columns = [{
      dataField: 'Id',
      text: 'ID',    
      hidden: true
    }, {
      dataField: '_type',
      text: 'Type',
      headerStyle: {width:"120px"},
      filter: selectFilter({
        options: selectOptions,
        comparator: Comparator.EQ // default is Comparator.EQ
      }),   
      style: {fontWeight: 'bold'},
      sort: true 
    }, {
      dataField: 'Source',
      text: 'Source',
      filter: textFilter(),    
      sort: true,
      headerStyle: {width:"300px"},
      style: {wordWrap: "break-word"},
      formatter:  (cellContent, row) => { 
        return <ConvertName value={cellContent} record={row} zone={this.props.match.params.zoneName} keyName={"Source"}></ConvertName>
      }
    }, {
      dataField: 'Target',
      text: 'Target',
      filter: textFilter(),    
      sort: true,
      style: {wordWrap: "break-word"},
      formatter:  (cellContent, row) => { 
        return <ConvertName value={cellContent} record={row} zone={this.props.match.params.zoneName} keyName={"Target"}></ConvertName>
      }
    }, {
      dataField: 'Delete',
      headerStyle: {width:"100px"},
      text: 'Actions',
      style : {
        padding:0
      },
      formatter: (cellContent, row) => { return <><button title="Edit record" className="btn edit-button"><FaEdit  size="20px"/></button> <button className="btn delete-button" id={row.Id} onClick={this.deleteDialog.bind(this)}><FaTrash  size="20px"/></button></>}
    }];
    
  }
  backAction() {
    history.push("/dns-manager")
  }
  componentDidMount() {
    this.props.getRecords(this.props.match.params.zoneName)
  }
  deleteDialog(event) {
    this.setState({
      showDialog : true,
      deleteId : event.currentTarget.id
    })
  }
  async deleteRecord(event) {
    const {id} = event.target
    this.props.progress("Deleting record "+id+" from "+this.props.match.params.zoneName)
    this.closeDialog()
    await this.props.deleteRecord(this.props.match.params.zoneName,id)
    this.props.message(this.props.records)
  }
  closeDialog() {
    this.setState({
      showDialog : false
    })
  }
  render() {     
    const { records } = this.props.records;
    const  { sizePerPage, page } = this.state;
    const zoneName = this.props.match.params.zoneName
    return (
        <NavProtected>
        <div className="row">
            <div className="col-6"><h4 className="create-record">Zone <b>{zoneName}</b></h4></div>
        </div>
        <div className="card record-inputs">
        <div className="card-header">
          <h5>Create Record</h5>
        </div>
        <div className="card-body">
        <Record data={this.state.createType} zone={zoneName} action = "create"></Record>    
        </div>
</div>
      
        
<div className="card record-inputs">
  <div className="card-header">
  <h5>Edit Records</h5>
  </div>
  <div className="card-body card-table">
  <BootstrapTable
    bootstrap4
      keyField="Id"
      hover
      bordered={ false }
      ref="zonetable"
      data={ records }
      columns={ this.columns }
      defaultSorted={ defaultSorted }
      filter={ filterFactory() }
      pagination={ paginationFactory({ page, sizePerPage }) }
      expandRow={{
        showExpandColumn: true,
        renderer: row => (<Record data={{...row}} zone={zoneName} action = "update" key = {row.Id}></Record>)
      }}
    />

    <Button variant="secondary" onClick={this.backAction}>
            Back to Search Zones
    </Button>
    <div className="name-notation-switch"><NameSwitch></NameSwitch></div>
    
  </div>
</div>   
  <div className="card record-inputs">
  <div className="card-header">
  <h5>Zone History</h5>
  </div>
  <div className="card-body card-table">
  <LogTableZone zoneName={this.zoneName}></LogTableZone>
    
  </div>
</div>   
<DeleteRecord
   show = {this.state.showDialog}
   close ={this.closeDialog}
   zoneName={zoneName}
   recordId={this.state.deleteId}

></DeleteRecord>
  </NavProtected>
    );
  }
}
const actionCreators = {
  message : alertActions.message,
	progress: alertActions.progress,
  getRecords: recordActions.getAll,
  deleteRecord: recordActions.delete,
  deleteUser: {}
}
function mapState(state) {
  const { users, authentication,records } = state;
  const { user } = authentication;
  return { user, users, records };
}
const connectedZone = connect(mapState, actionCreators)(Zone)
export {connectedZone as Zone}