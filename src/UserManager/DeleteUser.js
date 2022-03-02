import { ActionDialog } from "../_components/ActionDialog";
import React from "react";
import PropTypes from 'prop-types'
import { userActions, alertActions } from '../_actions';
import { defaultWorkerFilters } from '../defaults.js'
import { connect } from 'react-redux'
import { Filters } from '../_helpers'
import {DeleteCheck} from '.'

class DeleteUser extends React.Component {
    constructor (props) {
        super(props)
        this.state = {
            valid : false
        }
    }
    submitDelete = async () => {
        const searchParameters = defaultWorkerFilters(this.props.user.username)        
        searchParameters.users = this.props.impersonate   
        const filters = new Filters(searchParameters.filter)        
        this.props.progress("Deleting user "+this.props.username)
        this.props.close()
        await this.props.deleteUser(this.props.username, {...searchParameters, filter: filters.get()})
        this.setState({ showDialog : false })
        this.props.message(this.props.userMessage)
    }
    setValid = (valid) =>  {
        this.setState({valid})
    }
    render () {
        const objectName = "user"
        return this.state.valid 
        ? 
        <ActionDialog
            objectName = {objectName}
            objectValue = {this.props.username}
            show       = {this.props.show}
            hide       = {this.props.close}
            action     = {this.submitDelete}
            title      = {"Delete " + objectName+ ": " + this.props.username}
            body       = {"Do you want to delete the "+objectName+" "+this.props.username+" and all it's records?"}
            buttonText = {"Delete"}     
        ></ActionDialog> 
        : 
        <ActionDialog
        objectName = {objectName}
        objectValue = {this.props.username}
        show       = {this.props.show}
        hide       = {this.props.close}
        title      = {"Delete " + objectName+ ": " + this.props.username}
        body       = {<>
            <h5>Can't delete the user {this.props.username}</h5>
            <p>There are objects that are conneced to  {this.props.username}. These objects would loose their owner.</p>
            <DeleteCheck setValid={this.setValid} username={this.props.username}></DeleteCheck>
            </>
        }
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