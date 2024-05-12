import { useEffect, useState, useContext } from 'react';
import styles from './Dashboard.module.css';
import DashboardSidebar from './DashboardSidebar/DashboardSidebar';
import NewBlogModal from './NewBlogModal/NewBlogModal';
import BlogAPI from '../../api/BlogAPI';
import AuthContext from '../../context/AuthProvider';
import Content from './Content/Content';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { SIDEBAR_ITEMS, SIDEBAR_ITEMS_ARRAY } from './sidebarItems';

function Dashboard() {
  const { user } = useContext(AuthContext);
  const [showNewBlogModal, setShowNewBlogModal] = useState(false);
  const [blogs, setBlogs] = useState(null);

  const {
    blogId: blogIdParam,
    sidebarOption: sidebarOptionParam,
    postId: postIdParam,
  } = useParams();
  const validSidebarOption = SIDEBAR_ITEMS_ARRAY.map(
    (item) => item.routeParam,
  ).includes(sidebarOptionParam);
  const [selectedBlogId, setSelectedBlogId] = useState(null);
  const [selectedSidebarItem, setSelectedSidebarItem] = useState(
    (validSidebarOption && sidebarOptionParam) || SIDEBAR_ITEMS.POSTS,
  );
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (blogIdParam) {
      setSelectedBlogId(blogIdParam);
    }
  }, [blogIdParam]);

  useEffect(() => {
    if (sidebarOptionParam) {
      setSelectedSidebarItem(sidebarOptionParam);
    }
  }, [sidebarOptionParam]);

  useEffect(() => {
    if (user.userId) {
      fetchBlogs(user.userId).then((blogs) => setBlogs(blogs));
    }
  }, [user.userId]);

  useEffect(() => {
    if (blogs) {
      if (blogs.length > 0) {
        const firstBlog = blogs[0];
        const blogIds = blogs.map((blog) => blog._id);
        if (!selectedBlogId || !blogIds.includes(selectedBlogId)) {
          if (firstBlog) {
            setSelectedBlogId(firstBlog._id);
            navigate(
              `/dashboard/blogs/${firstBlog._id}/${selectedSidebarItem}`,
              {
                replace: true,
              },
            );
          }
        }
      } else if (blogs.length === 0) {
        setSelectedBlogId('none');
      }
    }
  }, [
    blogs,
    selectedBlogId,
    sidebarOptionParam,
    navigate,
    selectedSidebarItem,
  ]);

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
    navigate(`/dashboard/blogs/${newBlogId}/posts`);
    closeNewBlogModal();
  }

  return (
    <>
      <div className={styles.dashboard}>
        {blogs !== null && location.pathname !== '/dashboard' && (
          <DashboardSidebar
            openNewBlogModal={openNewBlogModal}
            blogs={blogs}
            selectedBlogId={selectedBlogId}
            setSelectedBlogId={setSelectedBlogId}
            selectedSidebarItem={selectedSidebarItem}
            setSelectedSidebarItem={setSelectedSidebarItem}
          />
        )}
        <div className={styles.contentContainer}>
          {validSidebarOption && selectedBlogId && (
            <Content
              selectedBlogId={selectedBlogId}
              selectedSidebarItem={selectedSidebarItem}
            />
          )}
        </div>
        <NewBlogModal
          isOpen={showNewBlogModal}
          onClose={closeNewBlogModal}
          onNewBlogAdded={handleNewBlogAdded}
        />
      </div>
    </>
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
