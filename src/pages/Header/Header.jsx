import styles from './Header.module.css';
import { NavLink, useLocation, useNavigate, useParams } from 'react-router-dom';
import AuthContext from '../../context/AuthProvider';
import { useContext } from 'react';
import UserMenu from './UserMenu/UserMenu';
import { useDashboardSidebar } from '../../context/DashboardSidebarContext';
import { GiHamburgerMenu } from 'react-icons/gi';
import { IoMdArrowRoundBack } from 'react-icons/io';

function Header({ headerRef }) {
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  const { blogId } = useParams();
  const { toggleDashboardSidebar } = useDashboardSidebar();
  const onDashboardPage =
    location.pathname === '/dashboard' ||
    location.pathname.match(/^\/dashboard\/blogs\/([^/]+)\/([^/]+)$/);
  const onEditPostPage = location.pathname.match(
    /^\/dashboard\/blogs\/([^/]+)\/posts\/([^/]+)\/edit$/,
  );
  const onPreviewPostPage = location.pathname.match(
    /^\/dashboard\/blogs\/([^/]+)\/posts\/([^/]+)\/preview$/,
  );

  function handleBackArrowClick() {
    if (blogId) {
      navigate(`/dashboard/blogs/${blogId}/posts`);
    }
  }

  return (
    <header ref={headerRef} className={styles.header}>
      <nav className={styles.headerNav}>
        <div className={styles.leftSide}>
          {onDashboardPage ? (
            <GiHamburgerMenu
              className={styles.hamburgerMenu}
              onClick={toggleDashboardSidebar}
            />
          ) : null}
          {(onEditPostPage || onPreviewPostPage) && (
            <IoMdArrowRoundBack
              className={styles.backArrow}
              onClick={handleBackArrowClick}
            />
          )}
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
            <UserMenu
              userProfilePic={
                user.profile_photo ?? '/images/default_profile_photo.jpg'
              }
              userUsername={user?.username}
            />
          )}
        </div>
      </nav>
    </header>
  );
}

export default Header;
