import { useEffect, useState, useContext } from 'react';
import styles from './Dashboard.module.css';
import DashboardSidebar from './DashboardSidebar/DashboardSidebar';
import NewBlogModal from './NewBlogModal/NewBlogModal';
import BlogAPI from '../../api/BlogAPI';
import AuthContext from '../../context/AuthProvider';
import Content from './Content/Content';
import { useNavigate, useParams } from 'react-router-dom';
import { SIDEBAR_ITEMS, SIDEBAR_ITEMS_ARRAY } from './sidebarItems';
import getHeaderHeight from '../../getHeaderHeight';

function Dashboard() {
  const { user } = useContext(AuthContext);
  const [showNewBlogModal, setShowNewBlogModal] = useState(false);
  const [blogs, setBlogs] = useState(null);

  const { blogId: blogIdParam, sidebarOption: sidebarOptionParam } =
    useParams();
  const validSidebarOption = SIDEBAR_ITEMS_ARRAY.includes(sidebarOptionParam);

  const [selectedBlogId, setSelectedBlogId] = useState(null);
  const [selectedSidebarItem, setSelectedSidebarItem] = useState(
    (validSidebarOption && sidebarOptionParam) || SIDEBAR_ITEMS.POSTS,
  );
  const navigate = useNavigate();

  useEffect(() => {
    setSelectedBlogId(blogIdParam);
  }, [blogIdParam]);

  useEffect(() => {
    setSelectedSidebarItem(sidebarOptionParam);
  }, [sidebarOptionParam]);

  useEffect(() => {
    if (user.userId) {
      fetchBlogs(user.userId).then((blogs) => setBlogs(blogs));
    }
  }, [user.userId]);

  useEffect(() => {
    if (blogs) {
      const firstBlog = blogs.length > 0 ? blogs[0] : null;
      const blogIds = blogs.map((blog) => blog._id);
      if (!selectedBlogId || !blogIds.includes(selectedBlogId)) {
        if (firstBlog) {
          setSelectedBlogId(firstBlog._id);
          navigate(`/dashboard/blog/${sidebarOptionParam}/${firstBlog._id}`, {
            replace: true,
          });
        } else {
          setSelectedBlogId('none');
          navigate(`/dashboard/blog/${sidebarOptionParam}`, {
            replace: true,
          });
        }
      }
    }
  }, [blogs, selectedBlogId, sidebarOptionParam, navigate]);

  function openNewBlogModal() {
    setShowNewBlogModal(true);
  }

  function closeNewBlogModal() {
    setShowNewBlogModal(false);
  }

  async function handleNewBlogAdded(newBlogId) {
    const updatedBlogs = await fetchBlogs(user.userId);
    setSelectedBlogId(newBlogId);
    setBlogs(updatedBlogs);
    setSelectedSidebarItem(SIDEBAR_ITEMS.POSTS);
    navigate(`/dashboard/blog/posts/${newBlogId}`);
    closeNewBlogModal();
  }

  const headerHeight = getHeaderHeight();

  return (
    <div className={styles.dashboard}>
      {blogs !== null && (
        <DashboardSidebar
          openNewBlogModal={openNewBlogModal}
          blogs={blogs || []}
          selectedBlogId={selectedBlogId}
          setSelectedBlogId={setSelectedBlogId}
          selectedSidebarItem={selectedSidebarItem}
          setSelectedSidebarItem={setSelectedSidebarItem}
        />
      )}
      <div
        className={styles.contentContainer}
        style={
          headerHeight ? { height: `calc(100vh - ${headerHeight}px)` } : {}
        }
      >
        {validSidebarOption && selectedBlogId && (
          <Content
            selectedBlogId={selectedBlogId}
            selectedSidebarItem={selectedSidebarItem}
          />
        )}
      </div>
      <NewBlogModal
        isOpen={showNewBlogModal}
        closeModal={closeNewBlogModal}
        onClose={closeNewBlogModal}
        onNewBlogAdded={handleNewBlogAdded}
      />
    </div>
  );
}

async function fetchBlogs(userId) {
  try {
    const blogsResponse = await BlogAPI.getBlogsByUser(userId);
    const blogs = blogsResponse.data.blogs;
    return blogs;
  } catch (err) {
    console.error(err);
  }
}

export default Dashboard;
