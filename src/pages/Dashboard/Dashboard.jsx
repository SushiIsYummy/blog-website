import { useEffect, useState, useContext } from 'react';
import styles from './Dashboard.module.css';
import DashboardSidebar from './DashboardSidebar/DashboardSidebar';
import NewBlogModal from './NewBlogModal/NewBlogModal';
import BlogAPI from '../../api/BlogAPI';
import PostAPI from '../../api/PostAPI';
import AuthContext from '../../context/AuthProvider';

function Dashboard() {
  const { user } = useContext(AuthContext);
  const [showNewBlogModal, setShowNewBlogModal] = useState(false);
  const [blogs, setBlogs] = useState([]);
  const [posts, setPosts] = useState([]);
  const [selectedBlog, setSelectedBlog] = useState('');

  useEffect(() => {
    async function fetchAndSetItems() {
      try {
        const blogsResponse = await BlogAPI.getBlogsByUser(user.userId);
        const blogs = blogsResponse.data.blogs;
        const firstBlog = blogs.length > 0 ? blogs[0] : null;
        let postsResponse = null;
        if (firstBlog) {
          postsResponse = await PostAPI.getPostsByBlog(firstBlog._id);
        }

        const posts = postsResponse ? postsResponse.data.posts : [];
        setBlogs(blogs);
        setPosts(posts);
        return { blogsResponse };
      } catch (err) {
        console.error(err);
      }
    }

    if (user.userId) {
      fetchAndSetItems();
    }
  }, [user.userId]);

  useEffect(() => {
    async function fetchAndSetItems() {
      try {
        const blogsResponse = await BlogAPI.getBlogsByUser(user.userId);
        const blogs = blogsResponse.data.blogs;
        const firstBlog = blogs.length > 0 ? blogs[0] : null;
        let postsResponse = null;
        if (firstBlog) {
          postsResponse = await PostAPI.getPostsByBlog(firstBlog._id);
        }

        const posts = postsResponse ? postsResponse.data.posts : [];
        setBlogs(blogs);
        setPosts(posts);
        return { blogsResponse };
      } catch (err) {
        console.error(err);
      }
    }
  }, [selectedBlog, user.userId]);

  function openNewBlogModal() {
    setShowNewBlogModal(true);
  }

  function closeNewBlogModal() {
    setShowNewBlogModal(false);
  }

  return (
    <div className={styles.dashboard}>
      <DashboardSidebar
        openNewBlogModal={openNewBlogModal}
        blogs={blogs}
        selectedBlog={selectedBlog}
        setSelectedBlog={setSelectedBlog}
      />
      <NewBlogModal
        isOpen={showNewBlogModal}
        closeModal={closeNewBlogModal}
        onClose={closeNewBlogModal}
      />
      <div className={styles.content}></div>
    </div>
  );
}

export default Dashboard;
