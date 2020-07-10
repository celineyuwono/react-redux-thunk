import { applyMiddleware, combineReducers, createStore } from 'redux';

import thunk from 'redux-thunk';

// actions.js

// Just naming standards
const ADD_REPOS = 'ADD_REPOS';
const CLEAR_REPOS = 'CLEAR_REPOS'

export const addRepos = repos => ({
  type: ADD_REPOS,
  repos,
});

export const clearRepos = () => ({ type: CLEAR_REPOS });

// This getRepos function is not connected to reducers. It doesn't return an action,
// but calls a function (or does some random stuff), then "dispatch" or calls an action creator 
// that returns an action to the reducer, where the state is mutated.
// The purpose of this getRepos is to do calculations or (async/sync) function calls before state mutation.
// This is made possible by applyMiddleware(thunk) in Line 51.
export const getRepos = username => async dispatch => {
  try {
    const url = `https://api.github.com/users/${username}/repos?sort=updated`;
    const response = await fetch(url);
    const responseBody = await response.json();
    dispatch(addRepos(responseBody));
  } catch (error) {
    console.error(error);
    dispatch(clearRepos());
  }
};

// reducers.js
export const repos = (state = [], action) => {
  switch (action.type) {
    case 'ADD_REPOS':
      return action.repos;
    case 'CLEAR_REPOS':
      return [];
    default:
      return state;
  }
};

export const reducers = combineReducers({ repos });

// store.js
export function configureStore(initialState = {}) {
  const store = createStore(reducers, initialState, applyMiddleware(thunk));
  return store;
}

export const store = configureStore();
