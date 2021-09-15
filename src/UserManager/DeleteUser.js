import { connect } from 'react-redux';
import { userActions, alertActions, zoneActions, workerActions, userActions } from '../_actions';
import React from 'react';
import { Button } from 'react-bootstrap';
import {defaultZoneFilters, defaultWorkerFilters, defaultAccountFilters}  from '../defaults';

class DeleteUser extends React.Component {
    constructor (props) { 
        super(props)
        this.state = {loading: false}
    }
    send = async () =>  {
        this.setState({loading: true})
        await this.filter(defaultZoneFilters, "Zones")
        await this.filter(defaultWorkerFilters, "Workers")
        await this.filter(defaultAccountFilters, "Accounts")
        this.setState({loading: false})
        this.props.message(this.props.users)
    }
    filter = async (defaultFilters,type) =>  {
        const filters = defaultFilters()
        filters.users = this.username
        return this.props["filter"+type](filters)        
    }
    render() {
       return <Button onClick={this.sendReset} disabled={this.props.users.loading}>Reset Password</Button>
    }
}

function mapState(state) {
    const {  authentication, users ,workers, zones } = state;
    const { user,qr } = authentication;
    return { user,qr,users, workers, zones  };
}

const actionCreators = {
    message : alertActions.message,
	progress: alertActions.progress,
    filterWorkers : workerActions.filter,
    filterUsers : userActions.filter,
    filterZones : zoneActions.filter,
    resetPassword: userActions.resetPassword 
};

const DeleteUserconnected = connect(mapState, actionCreators)(DeleteUser);
export  { DeleteUserconnected as DeleteUser }