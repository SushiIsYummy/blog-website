import {
  useLoaderData,
  useLocation,
  matchPath,
  NavLink,
  useParams,
} from 'react-router-dom';
import styles from './UserProfile.module.css';
import { useState } from 'react';
import UserAPI from '../../api/UserAPI';
import UserRecent from './tabs/UserRecent/UserRecent';
import UserBlogs from './tabs/UserBlogs/UserBlogs';
import UserAbout from './tabs/UserAbout/UserAbout';

export async function loader({ params }) {
  try {
    const userResponse = await UserAPI.getUserById(params.userId);
    return userResponse;
  } catch (err) {
    console.error(err);
  }
  return null;
}

function UserProfile() {
  const { userId } = useParams();
  const location = useLocation();
  const matchedRoute = matchPath(
    { path: '/users/:userId/:tab', exact: true },
    location.pathname,
  );
  const userResponse = useLoaderData();
  const user = userResponse.user;
  const currentTab = matchedRoute ? matchedRoute.params.tab : 'recent';

  // cache the blogs and posts after they are fetched once
  // to prevent unnecessary fetches
  const [blogs, setBlogs] = useState(null);
  const [posts, setPosts] = useState(null);
  const [editAboutContent, setEditAboutContent] = useState(user.about);
  const [savedAboutContent, setSavedAboutContent] = useState(user.about);

  return (
    <div className={styles.userProfileContainer}>
      <div className={styles.userProfile}>
        <section className={styles.profileHeader}>
          <img
            className={styles.userImage}
            src={
              user.profile_photo !== null
                ? user.profile_photo
                : '/images/default_profile_photo.jpg'
            }
            alt=''
          />
          <h1 className={styles.name}>
            {user.first_name} {user.last_name}
          </h1>
          <p className={styles.username}>@{user.username}</p>
        </section>
        <div className={styles.navigationTabContainer}>
          <div className={styles.navigationTab}>
            <NavLink
              to={`/users/${userId}`}
              className={`${styles.tab} ${currentTab === 'recent' ? styles.active : ''}`}
            >
              Recent
            </NavLink>

            <NavLink
              to={`/users/${userId}/blogs`}
              className={`${styles.tab} ${currentTab === 'blogs' ? styles.active : ''}`}
            >
              Blogs
            </NavLink>
            <NavLink
              to={`/users/${userId}/about`}
              className={`${styles.tab} ${currentTab === 'about' ? styles.active : ''}`}
            >
              About
            </NavLink>
          </div>
          <div className={styles.navigationTabContent}>
            {currentTab === 'recent' && (
              <UserRecent posts={posts} setPosts={setPosts} />
            )}
            {currentTab === 'blogs' && (
              <UserBlogs blogs={blogs} setBlogs={setBlogs} />
            )}
            {currentTab === 'about' && (
              <UserAbout
                editAboutContent={editAboutContent}
                setEditAboutContent={setEditAboutContent}
                savedAboutContent={savedAboutContent}
                setSavedAboutContent={setSavedAboutContent}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
