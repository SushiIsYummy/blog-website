import styles from './DashboardSidebar.module.css';
import { useEffect, useRef, useState } from 'react';
import { useDashboardSidebar } from '../../../context/DashboardSidebarContext';
import { useMediaQuery } from '@react-hook/media-query';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import { SIDEBAR_ITEMS_ARRAY } from '../sidebarItems';
import getHeaderHeight from '../../../getHeaderHeight';
import PostAPI from '../../../api/PostAPI';

function DashboardSidebar({
  openNewBlogModal,
  blogs,
  selectedBlogId,
  setSelectedBlogId,
  selectedSidebarItem,
  setSelectedSidebarItem,
}) {
  const { dashboardSidebarIsOpen, closeDashboardSidebar } =
    useDashboardSidebar();
  const isSmallScreen = useMediaQuery('(max-width: 1024px)');
  const sidebarRef = useRef(null);
  const navigate = useNavigate();
  const { blogId } = useParams();
  const [sidebarItemLinks, setSidebarItemLinks] = useState([]);

  useEffect(() => {
    function getSidebarItemLink(routeParam) {
      let link = '';
      const blogIds = blogs.map((blog) => blog._id);

      if (blogIds.includes(blogId)) {
        link = `/dashboard/blogs/${blogId}/${routeParam}`;
      } else if (blogIds.length > 0) {
        const firstBlogId = blogIds[0];
        link = `/dashboard/blogs/${firstBlogId}/${routeParam}`;
      }

      return link;
    }

    const links = [];

    SIDEBAR_ITEMS_ARRAY.forEach((item) => {
      const link = getSidebarItemLink(item.routeParam);
      links.push(link);
    });

    setSidebarItemLinks(links);
  }, [blogId, blogs]);

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

  function handleBlogSelectChange(e) {
    setSelectedBlogId(e.target.value);
    if (isSmallScreen) {
      closeDashboardSidebar();
    }
    navigate(`/dashboard/blogs/${e.target.value}/${selectedSidebarItem}`);
  }

  async function handleNewPostClick() {
    try {
      const response = await PostAPI.createPost(selectedBlogId);
      const postId = response.data.post._id;
      navigate(`/dashboard/blogs/${selectedBlogId}/posts/${postId}/edit`);
    } catch (err) {
      console.error(err);
    }
  }

  const headerHeight = getHeaderHeight();

  return (
    <aside
      ref={sidebarRef}
      className={`${styles.sidebar} ${dashboardSidebarIsOpen ? styles.open : ''} ${isSmallScreen ? styles.isSmallScreen : ''}`}
      style={headerHeight ? { height: `calc(100vh - ${headerHeight}px)` } : {}}
    >
      <nav>
        <ul>
          <li className={styles.blogSelect}>
            <div className={styles.selectBlog}>
              <p>Current selected blog:</p>
              {blogs.length > 0 ? (
                <select
                  value={selectedBlogId}
                  onChange={handleBlogSelectChange}
                >
                  {blogs.map((blog) => {
                    return (
                      <option key={blog._id} value={blog._id}>
                        {blog.title}
                      </option>
                    );
                  })}
                </select>
              ) : (
                <p>No Blogs Available.</p>
              )}
            </div>
            <button className={styles.newBlogButton} onClick={openNewBlogModal}>
              + NEW BLOG
            </button>
          </li>
          {blogs.length > 0 && (
            <>
              <li className={styles.sideBarItemNewPost}>
                <button
                  className={styles.newPostButton}
                  onClick={handleNewPostClick}
                >
                  + NEW POST
                </button>
              </li>
              {SIDEBAR_ITEMS_ARRAY.map((item, index) => {
                return (
                  <li className={styles.sidebarItemLink} key={item.name}>
                    <NavLink
                      to={sidebarItemLinks[index]}
                      className={`${styles.sidebarItem} ${selectedSidebarItem === item.routeParam ? styles.selected : ''}`}
                      onClick={() => {
                        setSelectedSidebarItem(item.routeParam);
                        if (isSmallScreen) {
                          closeDashboardSidebar();
                        }
                      }}
                    >
                      {item.name}
                    </NavLink>
                  </li>
                );
              })}
            </>
          )}
        </ul>
      </nav>
    </aside>
  );
}

export default DashboardSidebar;
