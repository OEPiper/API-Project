import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';
import CreateSpotForm from '../CreateSpotForm';

function Navigation({ isLoaded }){
  const sessionUser = useSelector(state => state.session.user);

  return (
    <ul className='nav'>
      <li className='logo'>
        <NavLink exact to="/"><img className="airbnb" src='https://seeklogo.com/images/A/airbnb-logo-1D03C48906-seeklogo.com.png' />AirBnotB</NavLink>
      </li>
      {isLoaded && (
        <li className='nav-right'>
        {sessionUser &&
          <div className='create-new-spot'>
        <Link exact to='/spots/new'>
          Create a New Spot
        </Link>
          </div>}
          <div>
          <ProfileButton user={sessionUser} />
          </div>
        </li>
      )}
    </ul>
  );
}

export default Navigation;