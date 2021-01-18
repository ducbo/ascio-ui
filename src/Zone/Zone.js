import React from "react";
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import filterFactory, { selectFilter,textFilter, Comparator } from 'react-bootstrap-table2-filter';
import {Record} from '../Record'
import {Modal, Button} from 'react-bootstrap'
import { connect } from 'react-redux';
import { recordActions } from '../_actions';
import NavProtected from '../NavProtected.js'
import { history } from '../_helpers';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css'
import 'react-widgets/dist/css/react-widgets.css';
import { FaEdit, FaTrash } from 'react-icons/fa';


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
    this.columns = [{
      dataField: 'Id',
      text: 'ID',    
      hidden: true
    }, {
      dataField: '_type',
      text: 'Type',
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
      formatter : (cellContent, row) => { return cellContent && (cellContent.length > 30 ? <span title={cellContent}>{cellContent.slice(0,30) +" ..." }</span>: cellContent )}
    }, {
      dataField: 'Target',
      text: 'Target',
      filter: textFilter(),    
      sort: true,
      formatter : (cellContent, row) => { return cellContent && (cellContent.length > 30 ? <span title={cellContent}>{cellContent.slice(0,30) +" ..." }</span>: cellContent )}
    }, {
      dataField: 'Delete',
      text: 'Delete',
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
    this.state.showDialog = true;
    this.state.deleteId = event.currentTarget.id
    this.setState(this.state)
  }
  deleteRecord(event) {
    const {id} = event.target
    
    this.props.deleteRecord(this.props.match.params.zoneName,id)
    this.closeDialog()
  }
  closeDialog() {
    this.state.showDialog = false;
    this.setState(this.state)
  }
  render() { 
    const { records } = this.props.records;
    const  { data, sizePerPage, page } = this.state;
    const {title,description,action} = this.state
    const zoneName = this.props.match.params.zoneName
    return (
        <NavProtected>
        <div className="row">
            <div className="col-6"><h4 className="create-record">Zone <b>{zoneName}</b>: Create record</h4></div>
        </div>
        
        <Record data={this.state.createType} zone={zoneName} action = "create"></Record>    
        <Modal  style={{opacity:1}} show={this.state.showDialog} onHide={this.closeDialog}>
          <Modal.Header closeButton>
            <Modal.Title>Delete record from {zoneName}</Modal.Title>
          </Modal.Header>
          <Modal.Body>Do you want to delete the record {this.state.deleteId}?</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.closeDialog}>
              Close
            </Button>
            <Button variant="primary" id={this.state.deleteId} onClick={this.deleteRecord}>
              Delete record
            </Button>
          </Modal.Footer>
        </Modal>
    <BootstrapTable
    bootstrap4
      keyField="Id"
      hover
      bordered={ false }
      ref="zonetable"
      data={ records }
      columns={ this.columns }
      onTableChange={ console.log("Table has changed")}
      defaultSorted={ defaultSorted }
      filter={ filterFactory() }
      pagination={ paginationFactory({ page, sizePerPage }) }
      expandRow={{
        showExpandColumn: true,
        renderer: row => (<Record data={{...row}} zone={zoneName} action = "update"></Record>)
      }}
    />
    <Button variant="secondary" onClick={this.backAction}>
            Back to Search Zones
      </Button>
  </NavProtected>
    );
  }
}
const actionCreators = {
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