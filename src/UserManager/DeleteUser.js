import { ActionDialog } from "../_components/ActionDialog";
import React from "react";
import PropTypes from 'prop-types'
import { userActions, alertActions } from '../_actions';
import { connect } from 'react-redux'

class DeleteUser extends React.Component {
    submitDelete = async () => {
        console.log("disabled")
        /* 
        const searchParameters = defaultUserFilters(this.props.user.username)        
        searchParameters.users = this.props.impersonate   
        const filters = new Filters(searchParameters.filter)        
        this.props.progress("Deleting user "+this.props.username)
        this.props.close()
        await this.props.DeleteUser(this.props.username, {...searchParameters, filter: filters.get()})
        this.setState({ showDialog : false })
        this.props.message(this.props.userMessage)  
        */
    }
    render () {
        const objectName = "user"
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
DeleteUser.propTypes = {
    username : PropTypes.string.isRequired,
    show     : PropTypes.bool.isRequired,
    close     : PropTypes.func.isRequired,
}

const actionCreators = {
    deleteUser: userActions.delete,
    message : alertActions.message,
    progress: alertActions.progress,
  }
  function mapState(state) {
    const { user } = state.authentication;
    const { impersonate } = state.usertree
    const { success, progress } = state.users;
    return { user, impersonate,  userMessage : {success,progress} };
  }
  const connectedDeleteUser = connect(mapState, actionCreators)(DeleteUser)
  export {connectedDeleteUser as DeleteUser}