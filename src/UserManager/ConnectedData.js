import { connect } from 'react-redux';
import { userActions, alertActions, zoneActions, workerActions, userActions } from '../_actions';
import React from 'react';
import { Button } from 'react-bootstrap';


class ConnectedData extends React.Component {
    constructor (props) { 
        super(props)
        this.state = {loading: false}
        this.filter = this.props.filter
        this.link = this.props.link
        this.username = username
        this.setCount = this.props.setCount
    }
    send = async () =>  {
        this.setState({loading: true})        
        await this.props.filter(defaultZoneFilters)
        await this.props.filter(defaultWorkerFilters)
        await this.props.filter(defaultAccountFilters)
        this.setState({loading: false})
    }
    getFilters = async (defaultFilters) =>  {
        const filters = defaultFilters()
        filters.users = this.username
        return filters
    }
    render() {
       return <Button onClick={this.sendReset} disabled={this.props.users.loading}>Reset Password</Button>
    }
}

function mapState(state) {
    const {  authentication, users  } = state;
    const { user,qr } = authentication;
    return { user,qr,users  };
}

const actionCreators = {
    message : alertActions.message,
	progress: alertActions.progress,
    getWorkers : workerActions.filter,
    getUsers : userActions.filter,
    getZones : zoneActions.filter,
    resetPassword: userActions.resetPassword 
};

const ConnectedDataconnected = connect(mapState, actionCreators)(ConnectedData);
export  { ConnectedDataconnected as ConnectedData }