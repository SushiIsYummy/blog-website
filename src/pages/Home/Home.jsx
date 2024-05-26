import { useLoaderData, NavLink } from 'react-router-dom';
import styles from './Home.module.css';
import { DateTime } from 'luxon';
import {} from 'react-router-dom';
import PostAPI from '../../api/PostAPI';
import AuthContext from '../../context/AuthProvider';
import { useContext } from 'react';

async function loader() {
  try {
    const postsResponse = await PostAPI.getAllPosts();
    return { postsResponse };
  } catch (err) {
    console.error(err);
  }
  return null;
}

function Home() {
  let { postsResponse } = useLoaderData();
  const posts = postsResponse.data.posts;
  const { user } = useContext(AuthContext);

  return (
    <div className={styles.homeContainer}>
      <div className={styles.home}>
        {user.role === 'guest' && (
          <section className={styles.heroSectionContainer}>
            <div className={styles.heroSection}>
              <h1>CoolBlog, Blogs for cool people</h1>
              <p>
                Explore narratives, perspectives, and knowledge shared by
                writers covering a wide array of topics.
              </p>
              <NavLink to={'/register'}>
                <button className={styles.getStartedButton}>Get Started</button>
              </NavLink>
            </div>
          </section>
        )}
        <section className={styles.topPostsContainer}>
          <h1>Top Posts</h1>
          <div className={styles.topPosts}>
            {posts.map((post) => {
              const dateTime = DateTime.fromISO(post.created_at, {
                zone: 'utc',
              });
              const formattedDate = dateTime.toFormat('LLL d, yyyy');
              return (
                <div key={post._id} className={styles.post}>
                  <NavLink
                    to={`users/${post.author._id}`}
                    className={styles.author}
                  >
                    <img src='/images/default_profile_photo.jpg' alt='' />
                    <p>
                      {post.author.first_name} {post.author.last_name}
                    </p>
                  </NavLink>
                  <p className={styles.postTitle}>{post.title}</p>
                  <p className={styles.postDate}>{formattedDate}</p>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}

Home.loader = loader;

export default Home;
