import { ActionDialog } from "../_components/ActionDialog";
import React from "react";
import PropTypes from 'prop-types'
import { defaultZoneFilters } from '../defaults.js'
import { zoneActions, alertActions } from '../_actions';
import { connect } from 'react-redux'
import {Filters} from '../_helpers'

class DeleteZone extends React.Component {
    submitDelete = async () => {
        const searchParameters = defaultZoneFilters(this.props.user.username)        
        searchParameters.users = this.props.impersonate   
        const filters = new Filters(searchParameters.filter)        
        this.props.progress("Deleting zone "+this.props.zoneName)
        this.props.close()
        await this.props.deleteZone(this.props.zoneName, {...searchParameters, filter: filters.get()})
        this.setState({ showDialog : false })
        this.props.message(this.props.zoneMessage) 
    }
    render () {
        const objectName = "zone"
        return <ActionDialog
            objectName = {objectName}
            objectValue = {this.props.zoneName}
            show       = {this.props.show}
            hide       = {this.props.close}
            action     = {this.submitDelete}
            title      = {"Delete " + objectName+ ": " + this.props.zoneName}
            body       = {"Do you want to delete the "+objectName+" "+this.props.zoneName+" and all it's records?"}
            buttonText      = {"Delete"}        
        ></ActionDialog>

    }


}
DeleteZone.propTypes = {
    zoneName : PropTypes.string.isRequired,
    show     : PropTypes.bool.isRequired,
    close     : PropTypes.func.isRequired,
}

const actionCreators = {
    deleteZone: zoneActions.delete,
    message : alertActions.message,
    progress: alertActions.progress,
  }
  function mapState(state) {
    const { user } = state.authentication;
    const { impersonate } = state.usertree
    const { success, progress } = state.zones;
    return { user, impersonate,  zoneMessage : {success,progress} };
  }
  const connectedDeleteZone = connect(mapState, actionCreators)(DeleteZone)
  export {connectedDeleteZone as DeleteZone}