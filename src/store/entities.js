import { combineReducers } from 'redux';
import bugReducer from './bugs';
import projectsReducer from './projects';
import usersReducer from './users';

export default combineReducers({
    bugs: bugReducer,
    projects: projectsReducer,
    users: usersReducer
});