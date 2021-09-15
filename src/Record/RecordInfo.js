import React from "react";
import { connect } from 'react-redux';
import { recordToApi } from '../_helpers';
import fields from './fields';

class  RecordInfo extends React.Component {
    dotText() {
        if(!this.props.nameswitch) {
            const record = this.props.record
            const dot = fields[record._type].dot
            let dotText = ""
            if(dot && (record.Target.indexOf(".") > -1)) {
                dotText = <span>Please add a  <b>dot</b> at the end for a targets outside of  <b>{this.props.zone}</b></span>
            }
            return dotText
        }    
    }
    render() {
        const text = this.props.done ? this.props.textDone : this.props.text
        const record = this.props.record
        if ((record.Source && record.Target) || record._type === 'SOA') {
            //const newRecord = this.props.nameswitch ? recordToApi(this.props.zone, {...record}, 'Ascio') : record;
            const newRecord =  recordToApi(this.props.zone, {...record}, 'Ascio');
            return (
                <span>
                    <b>{newRecord.Source}</b> {text} <b>{newRecord.Target}</b><br></br>
                    {this.dotText()}
                </span>
            );
        } else {
            return 'Please enter Source and Target';
        }
    }
}
function mapState(state) {
    const { nameswitch } = state;
    return { nameswitch };
}
const connectedRecordInfo = connect(mapState)(RecordInfo)
export {connectedRecordInfo as RecordInfo}