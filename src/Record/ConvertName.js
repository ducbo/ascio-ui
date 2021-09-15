import React from "react";
import { connect } from 'react-redux';
import {recordToApi} from "../_helpers"

class  ConvertName extends React.Component {
    render () {
        if(!this.props.nameswitch) {
            return this.props.value || ""
        }
        const key = this.props.keyName
        const newRecord = recordToApi(this.props.zone, {...this.props.record} , "Ascio")
        this.props.record.nameswitch = this.props.nameswitch
        return newRecord[key] || ""
   }

}
function mapState(state) {
    const { nameswitch } = state;
    return { nameswitch };
  }

const connectedConvertName = connect(mapState)(ConvertName)
export {connectedConvertName as ConvertName}