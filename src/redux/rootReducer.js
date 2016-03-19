import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';
import projectsReducer from './modules/projects';

export default combineReducers({
  projectsReducer,
  router
});
