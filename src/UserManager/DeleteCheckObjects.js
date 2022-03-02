import React from "react";
import PropTypes from 'prop-types'

class DeleteCheckObjects extends React.Component {
    render () {
        return this.props.check && this.props.check.totalSize > 0 ? <>
            <p><b>Connected {this.props.type}(s): </b></p>
            <p>{this.props.advice}</p>
            <div className="userDeleteCheck">{this.props.check.data.join(", ")}</div>
        </> : ""
    }
}
DeleteCheckObjects.propTypes = {
    check : PropTypes.number.isRequired,
    username : PropTypes.string.isRequired,
    type : PropTypes.string.isRequired
}
export { DeleteCheckObjects }