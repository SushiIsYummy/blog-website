import { useParams } from 'react-router-dom';
import styles from './UserBlogs.module.css';
import { useEffect, useState } from 'react';
import BlogAPI from '../../../../api/BlogAPI';

export async function loader({ params }) {
  try {
    const userBlogsResponse = BlogAPI.getBlogsByUser(params.userId);
    return userBlogsResponse;
  } catch (err) {
    console.error(err);
  }
  return null;
}

function UserBlogs({ blogs, setBlogs }) {
  const { userId } = useParams();
  const [loading, setLoading] = useState(blogs ? false : true);

  useEffect(() => {
    async function getBlogs() {
      try {
        const response = await BlogAPI.getBlogsByUser(userId);
        setBlogs(response.data.blogs);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }
    if (blogs === null) {
      setLoading(true);
      getBlogs();
    } else {
      setLoading(false);
    }
  }, [blogs, setBlogs, userId]);

  if (loading) {
    return <p>loading...</p>;
  }
  if (!loading && blogs.length === 0) {
    return (
      <p className={styles.noBlogsMessage}>User has not created any blogs</p>
    );
  }
  return (
    <div>
      <div className={styles.blogs}>
        {blogs &&
          blogs.map((blog) => {
            return (
              <div key={blog._id} className={styles.blog}>
                <p className={styles.blogTitle}>{blog.title}</p>
                <p className={styles.blogDescription}>{blog.description}</p>
              </div>
            );
          })}
      </div>
    </div>
  );
}

export default UserBlogs;
