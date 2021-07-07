import React from 'react';
import {UserSelector} from '../UserManager'
import PropTypes from 'prop-types'
import { zoneActions } from '../_actions';
import { connect } from 'react-redux';

function ZoneUserSelector(props) {
  const onChange = (user) => {
    props.updateOwner(props.zoneName, user.id)
    if(props.onChange) {
        props.onChange(user)
    }
  }
  return (
    <UserSelector
      id={props.zoneName}
      onChange={onChange}
      selected={props.selected}
    />
  );
}
ZoneUserSelector.propTypes = {
    zoneName: PropTypes.string.isRequired,
    selected: PropTypes.string,
    onChange: PropTypes.func
};

const actionCreators = {
    updateOwner: zoneActions.updateOwner
} 
const connectedZoneUserSelector = connect(null, actionCreators)(ZoneUserSelector)
export {connectedZoneUserSelector as ZoneUserSelector}