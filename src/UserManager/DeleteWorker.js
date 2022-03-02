import { ActionDialog } from "../_components/ActionDialog";
import React from "react";
import PropTypes from 'prop-types'
import { workerActions, alertActions } from '../_actions';
import { defaultWorkerFilters } from '../defaults.js'
import { connect } from 'react-redux'
import { Filters } from '../_helpers'

class DeleteWorker extends React.Component {
    submitDelete = async () => {
        const searchParameters = defaultWorkerFilters(this.props.user.username)        
        searchParameters.users = this.props.impersonate   
        const filters = new Filters(searchParameters.filter)        
        this.props.progress("Deleting worker "+this.props.username)
        this.props.close()
        await this.props.deleteWorker(this.props.username, {...searchParameters, filter: filters.get()})
        this.setState({ showDialog : false })
        this.props.message(this.props.userMessage)
    }
    render () {
        const objectName = "worker"
        return <ActionDialog
            objectName = {objectName}
            objectValue = {this.props.username}
            show       = {this.props.show}
            hide       = {this.props.close}
            action     = {this.submitDelete}
            title      = {"Delete " + objectName+ ": " + this.props.username}
            body       = {"Do you want to delete the "+objectName+" "+this.props.username+" and all it's records?"}
            buttonText      = {"Delete"}        
        ></ActionDialog>

    }


}
DeleteWorker.propTypes = {
    username : PropTypes.string.isRequired,
    show     : PropTypes.bool.isRequired,
    close     : PropTypes.func.isRequired,
}

const actionCreators = {
    deleteWorker: workerActions.delete,
    message : alertActions.message,
    progress: alertActions.progress,
  }
  function mapState(state) {
    const { user } = state.authentication;
    const { impersonate } = state.usertree
    const { success, progress } = state.workers;
    return { user, impersonate,  userMessage : {success,progress} };
  }
  const connectedDeleteWorker = connect(mapState, actionCreators)(DeleteWorker)
  export {connectedDeleteWorker as DeleteWorker}