/* eslint-disable no-use-before-define */
import React from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import PropTypes from 'prop-types'
import { connect } from 'react-redux';

class UserSelector extends React.Component {
  constructor(props) {
    super(props)
    this.state = {value : props.selected}
  }
  onChange = async  (event,value) => {
    this.setState({value}); 
    return this.props.onChange(value);
  }
  componentDidUpdate() {
    if(this.state.value !== this.props.selected) {
      this.setState({value: this.props.selected})
    }
  }
  render () {
    return (
      <Autocomplete
        id={this.props.id}
        options={this.props.rootDescendants}
        getOptionSelected={(option,value) =>  option.id === value.id}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        getOptionLabel={(option) => option.name ||""}
        value = {this.state.value}
        //inputValue = {inputValue}
        onChange={this.onChange}
        size="small"
        renderInput={(params) => <TextField {...params}  variant="outlined" />}
      />
    );
  }
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