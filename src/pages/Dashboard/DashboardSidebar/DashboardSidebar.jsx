import styles from './DashboardSidebar.module.css';
import { useContext, useEffect, useRef, useState } from 'react';
import AuthContext from '../../../context/AuthProvider';
import BlogAPI from '../../../api/BlogAPI';
import { useDashboardSidebar } from '../../../context/DashboardSidebarContext';
import { useMediaQuery } from '@react-hook/media-query';
import { useNavigate, useOutletContext, useParams } from 'react-router-dom';
import { SIDEBAR_ITEMS_ARRAY } from '../sidebarItems';
import { capitalize } from 'lodash';
import getHeaderHeight from '../../../getHeaderHeight';

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

  function handleSidebarItemClick(itemName) {
    setSelectedSidebarItem(itemName);
    if (isSmallScreen) {
      closeDashboardSidebar();
    }
    const blogIds = blogs.map((blog) => blog._id);
    if (blogIds.includes(blogId)) {
      navigate(`/dashboard/blog/${itemName.toLowerCase()}/${blogId}`);
    } else if (blogIds.length > 0) {
      const firstBlogId = blogIds[0];
      setSelectedBlogId(firstBlogId);
      navigate(`/dashboard/blog/${itemName.toLowerCase()}/${firstBlogId}`, {
        replace: true,
      });
    } else {
      navigate(`/dashboard/blog/${itemName.toLowerCase()}`);
    }
  }

  function handleBlogSelectChange(e) {
    setSelectedBlogId(e.target.value);
    if (isSmallScreen) {
      closeDashboardSidebar();
    }
    navigate(`/dashboard/blog/${selectedSidebarItem}/${e.target.value}`);
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
          {SIDEBAR_ITEMS_ARRAY.map((item) => {
            return (
              <li key={item}>
                <button
                  className={`${styles.sidebarItem} ${selectedSidebarItem === item ? styles.selected : ''}`}
                  onClick={() => handleSidebarItemClick(item)}
                >
                  {capitalize(item)}
                </button>
              </li>
            );
          })}
          {/* <li>
            <button
              className={styles.sideBarItem}
              onClick={isSmallScreen ? handleSidebarItemClick : null}
            >
              Posts
            </button>
          </li>
          <li>
            <button
              className={styles.sideBarItem}
              onClick={isSmallScreen ? handleSidebarItemClick : null}
            >
              Comments
            </button>
          </li> */}
        </ul>
      </nav>
    </aside>
  );
}

export default DashboardSidebar;
