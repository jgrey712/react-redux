// root reducer
// combine different reducers eg auth reducer, entities reducer, ui reducer
// imagne a heirarchy of reducers

import { combineReducers } from 'redux';
import entitiesReducer from './entities';

export default combineReducers({
    entities: entitiesReducer
});