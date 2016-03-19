/* @flow */
//import fetch from 'isomorphic-fetch';

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

const rows = [
  {
    name: 'CSC Avop.fi',
    projectTimespan: 'Feb 2016',
    prodUrl: 'http://avop.fi',
    team: ['Timo Hanhirova'],
    techTags: ['Compojure',
      'Ring', 'Luminus', 'HugSQL',
      'buddy-auth', 'migratus',
      'PostgreSQL', 'ES2015',
      'React', 'Webpack', 'Ansible',
      'Docker', 'Shibboleth 2'],
    otherTags: ['Haka',
      'VIRTA', 'Opintpolku', 'SPA'],
    description: 'Small **SPA** with Haka login and VIRTA/Opintopolku integrations'
  },
  {
    name: 'Hyvis',
    projectTimespan: 'TBA',
    prodUrl: 'http://www.hyvis.fi',
    team: ['Niko Sten', 'Tero Ulvinen',
      'Harri Mustonen', 'Joel Peltonen'],
    techTags: ['Liferay 6.2 EE', 'LDAP',
      'Activity', 'TOAS-stack'],
    otherTags: [],
    description: 'Ground-up rewrite of existing [www.hyvis.fi](http://www.hyvis.fi/) site from ' +
    'Sharepoint et al. Provides electronic services for residents in various Finnish provinces in ' +
    'the field of health and well being.'
  }
];

export function fetchProjects() {
  return dispatch => {
    dispatch(requestProjects());
    dispatch(receiveProjects(rows));
    return new Promise((resolve, reject) => { resolve(rows) });
    //return fetch(`/api/projects`)
    //  .then(req => req.json())
    //  .then(json => dispatch(receiveProjects(json)));
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
