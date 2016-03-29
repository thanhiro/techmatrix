/* @flow */
// import fetch from 'isomorphic-fetch';
/**
 * Actions are following FSA principles
 * https://github.com/acdlite/flux-standard-action
 */

// ------------------------------------
// Constants
// ------------------------------------
export const REQUEST_PROJECTS = 'REQUEST_PROJECTS';
export const RECEIVE_PROJECTS = 'RECEIVE_PROJECTS';

function requestProjects() {
  return {
    type: REQUEST_PROJECTS
  };
}

function receiveProjects(json) {
  return {
    type: RECEIVE_PROJECTS,
    payload: {projects: json, receivedAt: Date.now()},
    meta: {}
  };
}

export function fetchProjects() {
  return dispatch => {
    dispatch(requestProjects());
    return fetch('/api/projects')
      .then(req => req.json())
      .then(json => dispatch(receiveProjects(json)));
  };
}

export const actions = {
  fetchProjects
};

type PayloadType = {payload: {projects: Array<Object>, receivedAt: Date}};

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [RECEIVE_PROJECTS]: (state,
                       action:PayloadType) => Object.assign({}, state,
                         {
                           projects: action.payload.projects,
                           receivedAt: action.payload.receivedAt
                         })
};

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {projects: []};
export default function projectsReducer(state:{projects: Array<Object>} = initialState, action:Action) {
  const handler = ACTION_HANDLERS[action.type];
  return handler ? handler(state, action) : state;
}
