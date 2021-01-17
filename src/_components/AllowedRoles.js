import { connect } from 'react-redux';

function AllowedRoles(props)  {
    const user = props.user.user;
    const roles = user.roles instanceof Array ? user.roles : [user.roles]
    const filteredArray = roles.filter(value => props.roles.includes(value));
    if(filteredArray.length > 0) {
        return props.children;
    } else {
        return ""
    }
}
function mapState(state) {
    const { users, authentication,records } = state;
    const { user } = authentication;
    return { user, users, records };
  }
  const connectedAllowedRoles = connect(mapState, {})(AllowedRoles)
  export {connectedAllowedRoles as AllowedRoles}