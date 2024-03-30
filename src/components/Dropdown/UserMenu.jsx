'use client';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './UserMenu.module.css';
import { Avatar, Dropdown } from 'flowbite-react';
import { useContext } from 'react';
import AuthContext from '../../context/AuthProvider';

function UserMenu({ userProfilePic, userUsername }) {
  const navigate = useNavigate();
  const { user, signOut } = useContext(AuthContext);
  const location = useLocation();
  const onDashboardPage = location.pathname.startsWith('/dashboard');
  const onEditPostPage = location.pathname.match(
    /^\/dashboard\/blogs\/([^/]+)\/posts\/([^/]+)\/edit$/,
  );
  const signOutAndNavigateHome = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className={styles.userMenu}>
      <Dropdown
        label={<Avatar alt='User settings' img={userProfilePic} rounded />}
        arrowIcon={false}
        inline
      >
        <Dropdown.Item onClick={() => navigate(`/users/${user.userId}`)}>
          Profile
        </Dropdown.Item>
        <Dropdown.Item
          onClick={() => {
            if (onDashboardPage && !onEditPostPage) {
              // navigate(0);
            } else {
              navigate(`/dashboard`);
            }
          }}
        >
          Dashboard
        </Dropdown.Item>
        <div className={styles.divider}></div>
        <Dropdown.Item onClick={signOutAndNavigateHome}>
          Sign out
          <br />@{userUsername}
          <br />
        </Dropdown.Item>
      </Dropdown>
    </div>
  );
}

export default UserMenu;
