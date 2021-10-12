import { combineReducers } from 'redux';

import { authentication } from './authentication.reducer';
import { registration } from './registration.reducer';
import { records } from './records.reducer';
import { zones } from './zones.reducer';
import { usertree } from './usertree.reducer';
import { users } from './users.reducer';
import { workers } from './workers.reducer';
import { alert } from './alert.reducer';
import { nameswitch } from './nameswitch.reducer';
import { log } from './log.reducer';

const rootReducer = combineReducers({
  authentication,
  registration,
  users,
  records,
  zones,
  nameswitch,
  alert,
  usertree,
  workers,
  log
});

export default rootReducer;