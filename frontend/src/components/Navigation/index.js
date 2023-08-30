import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';
import CreateSpotForm from '../CreateSpotForm';

function Navigation({ isLoaded }){
  const sessionUser = useSelector(state => state.session.user);

  return (
    <ul>
      <li>
        <NavLink exact to="/">airbnb</NavLink>
      </li>
      {sessionUser ?(
      <li>
        <Link exact to='/spots/new'>
          Create a New Spot
        </Link>
      </li>):(<li></li>)}
      {isLoaded && (
        <li>
          <ProfileButton user={sessionUser} />
        </li>
      )}
    </ul>
  );
}

export default Navigation;