import styles from './Header.module.css';
import { NavLink, useLocation } from 'react-router-dom';
import AuthContext from '../../context/AuthProvider';
import { useContext } from 'react';
import UserMenu from '../../components/Dropdown/UserMenu';
import { useDashboardSidebar } from '../../context/DashboardSidebarContext';
import { GiHamburgerMenu } from 'react-icons/gi';

function Header() {
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const { toggleDashboardSidebar } = useDashboardSidebar();
  const onDashboardPage = location.pathname.startsWith('/dashboard');

  return (
    <header className={styles.header}>
      <nav className={styles.headerNav}>
        <div className={styles.leftSide}>
          {onDashboardPage ? (
            <GiHamburgerMenu
              className={styles.hamburgerMenu}
              onClick={toggleDashboardSidebar}
            ></GiHamburgerMenu>
          ) : null}
          <NavLink to={'/'}>
            <h1 className={styles.logo}>CoolBlog</h1>
          </NavLink>
        </div>
        <div className={styles.mainNav}>
          {user?.role === 'guest' && (
            <NavLink to={`/sign-in`} state={{ redirectTo: location }}>
              Sign in
            </NavLink>
          )}
          {user?.role === 'user' && (
            <>
              <NavLink to={'/new-post'} className={styles.writeButton}>
                Write
              </NavLink>
              <UserMenu
                userProfilePic={
                  user.profile_photo ?? '/images/default_profile_photo.jpg'
                }
                userUsername={user?.username}
              ></UserMenu>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Header;
