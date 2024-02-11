import styles from './Header.module.css';
import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
function Header() {
  return (
    <>
      <header className={styles.header}>
        <nav className={styles.headerNav}>
          <NavLink to={'/'}>
            <h1 className={styles.logo}>CoolBlog</h1>
          </NavLink>
          <div className={styles.mainNav}>
            <NavLink to={'/new-post'}>New Post</NavLink>
            <NavLink to={`/`}>Sign in</NavLink>
          </div>
        </nav>
      </header>
    </>
  );
}

export default Header;
