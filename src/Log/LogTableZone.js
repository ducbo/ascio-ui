import { textFilter, dateFilter, multiSelectFilter } from 'react-bootstrap-table2-filter';
import { FaEye } from 'react-icons/fa';
import {LogTable,LogLevel} from '.'
import { logActions } from '../_actions';
import { connect } from 'react-redux';
import { Filters, FilterElement } from '../_helpers';


const cellFormater  = (cell, row, rowIndex, colIndex,width) => {
  let css = {
    padding: 0,
    paddingLeft:"15px",
    verticalAlign: "middle"
  } 

    return css
}

function dateFormatter (date) {    
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
class LogTableZone extends LogTable.WrappedComponent {
  getFilters() {
    const filters = new Filters()
    //zone
    const filterZoneName = new FilterElement()
    filterZoneName.setType("TagFilterElement")
    filterZoneName.setValue(this.props.zoneName)
    filters.addFilter("objectName",filterZoneName)
    // level
    const filterLevel = new FilterElement()
    filterLevel.setType("FilterElement")
    filterLevel.setValue("completed")
    filters.addFilter("level",filterLevel)   
    return filters
  }
  getColumns = () => {
    this.columns = [{
      dataField: 'CreatedDate',
      text: 'Date',
      formatter: dateFormatter, 
      style : cellFormater,  
      sort: true,
      headerStyle: {width:"180px"}
      },
      {
        dataField: 'action',
        text: 'Action',
        style : cellFormater,  
        sort: true,
        headerStyle: {width:"180px"}
        },
         {
      dataField: 'loginUser.username',
      text: 'Login',
      sort: true,
      style : cellFormater,
      headerStyle: {width:"135px"}
    
      }
      ,  
      {
        dataField: 'oldData.Source',
        text: 'Old Source',
        sort: true,
        style :cellFormater    
      },
      {
        dataField: 'oldData.Target',
        text: 'Old Target',
        sort: true,
        style :cellFormater    
      },   
      {
        dataField: 'message',
        text: 'Message',
        sort: true,
        style :cellFormater    
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
const connectedLogTableZone = connect(mapState, actionCreators)(LogTableZone)
export {connectedLogTableZone as LogTableZone}