import styles from './DashboardSidebar.module.css';
import { useContext, useEffect, useRef, useState } from 'react';
import AuthContext from '../../../context/AuthProvider';
import BlogAPI from '../../../api/BlogAPI';
import { useDashboardSidebar } from '../../../context/DashboardSidebarContext';
import { useMediaQuery } from '@react-hook/media-query';

function DashboardSidebar({
  openNewBlogModal,
  blogs,
  selectedBlog,
  setSelectedBlog,
  // blogAddedOrDeleted,
  // onBlogAddedOrDeleted,
}) {
  const { user } = useContext(AuthContext);
  const { dashboardSidebarIsOpen, closeDashboardSidebar } =
    useDashboardSidebar();
  // const [selectedBlog, setSelectedBlog] = useState('');
  // const [blogs, setBlogs] = useState([]);
  const [firstFetch, setFirstFetch] = useState(true);
  const isSmallScreen = useMediaQuery('(max-width: 1024px)');
  const sidebarRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        isSmallScreen &&
        dashboardSidebarIsOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target)
      ) {
        closeDashboardSidebar();
      }
    }

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [closeDashboardSidebar, dashboardSidebarIsOpen, isSmallScreen]);

  // useEffect(() => {
  //   async function fetchBlogs() {
  //     try {
  //       const blogResponse = await BlogAPI.getBlogsByUser(user.userId);
  //       setBlogs(blogResponse.data.blogs);
  //       setSelectedBlog(blogResponse.data.blogs[0]);
  //       // const postsResponse = await PostAPI.getPostsByBlog(params.blogId);
  //       return { blogResponse };
  //     } catch (err) {
  //       console.error(err);
  //     }
  //   }

  //   if (user.userId && firstFetch) {
  //     fetchBlogs();
  //     setFirstFetch(false);
  //   }
  // }, [blogs.length, user.userId, firstFetch]);

  function handleSidebarItemClick() {
    closeDashboardSidebar();
  }

  return (
    <aside
      ref={sidebarRef}
      className={`${styles.sidebar} ${dashboardSidebarIsOpen ? styles.open : ''} ${isSmallScreen ? styles.isSmallScreen : ''}`}
    >
      <nav>
        <ul>
          <li className={styles.blogSelect}>
            <div className={styles.selectBlog}>
              <p>Current selected blog:</p>
              <select
                value={selectedBlog}
                onChange={(e) => setSelectedBlog(e.target.value)}
              >
                {blogs.map((blog) => {
                  return (
                    <option key={blog._id} value={blog._id}>
                      {blog.title}
                    </option>
                  );
                })}
              </select>
            </div>
            <button className={styles.newBlogButton} onClick={openNewBlogModal}>
              + NEW BLOG
            </button>
          </li>
          <li>
            <button onClick={isSmallScreen ? handleSidebarItemClick : null}>
              Posts
            </button>
          </li>
          <li>
            <button onClick={isSmallScreen ? handleSidebarItemClick : null}>
              Comments
            </button>
          </li>
        </ul>
      </nav>
    </aside>
  );
}

export default DashboardSidebar;
