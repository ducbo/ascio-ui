import { ActionDialog } from "../_components/ActionDialog";
import React from "react";
import PropTypes from 'prop-types'
import { defaultZoneFilters } from '../defaults.js'
import { recordActions, alertActions } from '../_actions';
import { connect } from 'react-redux'

class DeleteRecord extends React.Component {
    submitDelete = async () => {
        const searchParameters = defaultZoneFilters(this.props.user.username)        
        searchParameters.users = this.props.impersonate   
        this.props.progress("Deleting record "+this.props.recordId+ " from Zone: "+this.props.zoneName)
        this.props.close()
        await this.props.deleteRecord(this.props.zoneName, this.props.recordId)
        this.setState({ showDialog : false })
        this.props.message(this.props.recordMessage) 
    }
    render () {
        const objectName = "zone"
        return <ActionDialog
            objectName = {objectName}
            objectValue = {this.props.recordId}
            show       = {this.props.show}
            hide       = {this.props.close}
            action     = {this.submitDelete}
            title      = {"Delete " + objectName+ ": " + this.props.recordId}
            body       = {"Do you want to delete the "+objectName+" "+this.props.recordId+" and all it's records?"}
            buttonText      = {"Delete"}        
        ></ActionDialog>

    }


}
DeleteRecord.propTypes = {
    recordId : PropTypes.string.isRequired,
    zoneName : PropTypes.string.isRequired,
    show     : PropTypes.bool.isRequired,
    close     : PropTypes.func.isRequired,
}

const actionCreators = {
    deleteRecord: recordActions.delete,
    message : alertActions.message,
    progress: alertActions.progress,
  }
  function mapState(state) {
    const { user } = state.authentication;
    const { impersonate } = state.usertree
    const { success, progress } = state.records;
    return { user, impersonate,  recordMessage : {success,progress} };
  }
  const connectedDeleteRecord = connect(mapState, actionCreators)(DeleteRecord)
  export {connectedDeleteRecord as DeleteRecord}