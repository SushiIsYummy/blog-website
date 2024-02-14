import { useParams, NavLink } from 'react-router-dom';
import styles from './UserRecent.module.css';
import { useState, useEffect } from 'react';
import PostAPI from '../../../../api/PostAPI';
import toRelativeTimeLuxon from '../../../../utils/toRelativeTimeLuxon';
import convertHtmlStringToRawContent from '../../../../utils/convertHtmlStringToRawContent';

function UserRecent({ posts, setPosts }) {
  const { userId } = useParams();
  const [loading, setLoading] = useState(posts ? false : true);

  useEffect(() => {
    async function getPosts() {
      try {
        const response = await PostAPI.getAllPosts({
          author_id: userId,
          sort_by: 'newest',
        });
        setPosts(response.data.posts);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }
    if (posts === null) {
      setLoading(true);
      getPosts();
    } else {
      setLoading(false);
    }
  }, [posts, setPosts, userId]);

  if (loading) {
    return <p>loading...</p>;
  }
  if (!loading && posts.length === 0) {
    return (
      <p className={styles.noPostsMessage}>User has not created any posts</p>
    );
  }
  return (
    <div>
      <div className={styles.posts}>
        {posts &&
          posts.map((post) => {
            return (
              <div key={post._id} className={styles.post}>
                <p className={styles.relativeTimeAndBlog}>
                  {toRelativeTimeLuxon(post.created_at)} •{' '}
                  <NavLink
                    to={`/blogs/${post.blog._id}`}
                    className={styles.blogTitle}
                  >
                    Published in <span>{post.blog.title}</span>
                  </NavLink>
                </p>
                <p className={styles.postTitle}>{post.title}</p>
                <p className={styles.postContent}>
                  {post.subheading
                    ? post.subheading
                    : convertHtmlStringToRawContent(post.content)}
                </p>
              </div>
            );
          })}
      </div>
    </div>
  );
}

export default UserRecent;
