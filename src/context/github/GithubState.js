import React, { useReducer } from 'react';
import axios from 'axios';
import GithubContext from './GithubContext';
import GithubReducer from './GithubReducer';

import {
  SEARCH_USERS,
  SET_ALERT,
  SET_LOADING,
  GET_REPOS,
  GET_USER,
  GET_USERS,
  CLEAR_USERS
} from '../types';

const GithubState = props => {
  const initialState = {
    users: [],
    user: {},
    repos: [],
    loading: false
  }

  const [state, dispatch] = useReducer(GithubReducer, initialState);
  let githubClientId;
  let githubClientSecret;

  if (process.env.NODE_ENV !== 'production') {
    githubClientId = process.env.REACT_APP_GITHUB_CLIENT_ID;
    githubClientSecret = process.env.REACT_APP_GITHUB_CLIENT_SECRET;
  } else {
    githubClientId = process.env.GITHUB_CLIENT_ID;
    githubClientSecret = process.env.GITHUB_CLIENT_SECRET;
  }
  //SearchUser
  const searchUsers = async text => {
    setLoading();
    const res = await axios.get(`https://api.github.com/search/users?q=${text} & client_id=${githubClientId}&client_secret=${githubClientSecret}`);
    dispatch({
      type: SEARCH_USERS,
      payload: res.data.items
    })
  }
  //get user
  const getUser = async (username) => {
    setLoading();
    const res = await axios.get(`https://api.github.com/users/${username}?client_id=${githubClientId}&client_secret=${githubClientSecret}`);
    dispatch({
      type: GET_USER,
      payload: res.data
    });
  }
  //Get repos
  const getUserRepo = async username => {
    setLoading();
    const res = await axios.get(`https://api.github.com/users/${username}/repos?per_page=5&sort=created:asc&client_id=${githubClientId}&client_secret=${githubClientSecret}`);
    dispatch({
      type: GET_REPOS,
      payload: res.data
    })
  }
  //Clear users
  const clearUsers = () => dispatch({ type: CLEAR_USERS });
  //Set loading
  const setLoading = () => dispatch({ type: SET_LOADING });
  return <GithubContext.Provider
    value={{
      users: state.users,
      user: state.user,
      loading: state.loading,
      repos: state.repos,
      searchUsers,
      clearUsers,
      getUser,
      getUserRepo

    }}>
    {props.children}
  </GithubContext.Provider>
}

export default GithubState