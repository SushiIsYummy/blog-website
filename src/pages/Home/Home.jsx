import { useLoaderData } from 'react-router-dom';
import { getTopPosts } from '../../api';
import styles from './Home.module.css';
import { DateTime } from 'luxon';

export async function loader() {
  try {
    let postsResponse = await getTopPosts(6);
    return { postsResponse };
  } catch (err) {
    console.error(err);
  }
  return null;
}

function Home() {
  let { postsResponse } = useLoaderData();
  const posts = postsResponse.data.data.posts;
  return (
    <div className={styles.home}>
      <section className={styles.heroSectionContainer}>
        <div className={styles.heroSection}>
          <h1>CoolBlog, Blogs for cool people</h1>
          <p>
            Explore narratives, perspectives, and knowledge shared by writers
            covering a wide array of topics.
          </p>
          <button className={styles.getStartedButton}>Get Started</button>
        </div>
      </section>
      <section className={styles.topPostsContainer}>
        <h1>Top Posts</h1>
        <div className={styles.topPosts}>
          {posts.map((post) => {
            const dateTime = DateTime.fromISO(post.created_at, { zone: 'utc' });
            const formattedDate = dateTime.toFormat('LLL d, yyyy');
            return (
              <div key={post._id} className={styles.post}>
                <div className={styles.author}>
                  <img src='/images/default_profile_photo.jpg' alt='' />
                  <p>
                    {post.author.first_name} {post.author.last_name}
                  </p>
                </div>
                <p className={styles.postTitle}>{post.title}</p>
                <p className={styles.postDate}>{formattedDate}</p>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

export default Home;
