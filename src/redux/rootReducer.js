import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';
import projects from './modules/projects';

export default combineReducers({
  projects,
  router
});
