/* eslint-disable no-use-before-define */
import React from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import PropTypes from 'prop-types'
import { connect } from 'react-redux';

function UserSelector(props) {
  const [value, setValue] = React.useState(props.selected);
  const onChange = async  (event,value) => {
    setValue(value); 
    return props.onChange(value);
  }
  return (
    <Autocomplete
      id={props.id}
      options={props.rootDescendants}
      getOptionSelected={(option) =>  option.id === value.id}
      getOptionLabel={(option) => option.name ||""}
      value = {value}
      //inputValue = {inputValue}
      onChange={onChange}
      size="small"
      renderInput={(params) => <TextField {...params}  variant="outlined" />}
    />
  );
}
UserSelector.propTypes = {
    id: PropTypes.string.isRequired,
    selected: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired
};

function mapState(state) {
  const { rootDescendants} = state.usertree;
  return { rootDescendants };
}
const connectedUserSelector = connect(mapState)(UserSelector)
export {connectedUserSelector as UserSelector}