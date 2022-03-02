import React from "react";
import PropTypes from 'prop-types'
import {DeleteCheckObjects} from '.'
import { userService } from '../_services'

class DeleteCheck extends React.Component {
    constructor (props) {
        super(props); 
        this.state = {
            check : { 
                totalSize: 1,
                zones : 0, 
                users: 0, 
                worker: 0
            }
        }
    }
    async componentDidMount() {
        const check = await userService.checkDelete(this.props.username);
        this.setState({check})
        this.props.setValid(check.totalSize === 0)
    }
    render () {
        return [
            <DeleteCheckObjects check={this.state.check.zones} type={"zone"} username={this.props.username} advice="Please select another owner for these zones." ></DeleteCheckObjects>,
            <DeleteCheckObjects check={this.state.check.users} type={"subaccount"} username={this.props.username} advice="Please move or delete all subaccounts." ></DeleteCheckObjects>,
            <DeleteCheckObjects check={this.state.check.workers} type={"worker"} username={this.props.username} advice="Please move or delete all workers."></DeleteCheckObjects>
        ]

    }


}
DeleteCheck.propTypes = {
    setValid : PropTypes.func.isRequired,
    username : PropTypes.string.isRequired
}
export { DeleteCheck}