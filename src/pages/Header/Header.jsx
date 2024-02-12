import styles from './Header.module.css';
import { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import AuthContext from '../../context/AuthProvider';
import { useContext } from 'react';

function Header() {
  const { user } = useContext(AuthContext);
  const location = useLocation();
  return (
    <>
      <header className={styles.header}>
        <nav className={styles.headerNav}>
          <NavLink to={'/'}>
            <h1 className={styles.logo}>CoolBlog</h1>
          </NavLink>
          <div className={styles.mainNav}>
            {user?.role === 'guest' && (
              <NavLink to={`/sign-in`} state={{ redirectTo: location }}>
                Sign in
              </NavLink>
            )}
            {user?.role === 'user' && (
              <>
                <NavLink to={'/new-post'}>Write</NavLink>
                <img
                  className={styles.profile_photo}
                  src={
                    user.profile_photo
                      ? user.profile_photo
                      : '/images/default_profile_photo.jpg'
                  }
                  alt=''
                />
              </>
            )}
          </div>
        </nav>
      </header>
    </>
  );
}

export default Header;
