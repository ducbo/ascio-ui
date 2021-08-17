/* eslint-disable no-use-before-define */
import React from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import PropTypes from 'prop-types'
import { connect } from 'react-redux';

function UserSelector(props) {
  const getUser = (id) => {
    return {id, name : props.selectableUsers[id]} || {id:"",name:""};
  }
  const [value, setValue] = React.useState(getUser(props.selected));
    const onChange = (event,value) => {
    setValue(value); 
    props.onChange(value);
  }
  return (
    <Autocomplete
      id={props.id}
      options={props.rootDescendants}
      getOptionSelected={(option) => option.id === value.id}
      getOptionLabel={(option) => option.name ||""}
      value = {value}
      onChange={onChange}
      size="small"
      renderInput={(params) => <TextField {...params}  variant="outlined" />}
    />
  );
}
UserSelector.propTypes = {
    id: PropTypes.string.isRequired,
    selected: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired
};

function mapState(state) {
  const { rootDescendants,selectableUsers } = state.usertree;
  return { rootDescendants,selectableUsers };
}
const connectedUserSelector = connect(mapState)(UserSelector)
export {connectedUserSelector as UserSelector}