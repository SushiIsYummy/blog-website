import { useNavigate } from 'react-router-dom';
import styles from './EditPost.module.css';
import BlogAPI from '../../api/BlogAPI';
import PostAPI from '../../api/PostAPI';
import TinyMCEEdit from '../../components/TinyMCE/TinyMCEEdit';
import { useEffect, useState } from 'react';
import './EditPost.css';
import { useContext } from 'react';
import AuthContext from '../../context/AuthProvider';
import EditPostModal from './EditPostModal/EditPostModal';
import AutoResizeTextArea from '../../components/AutoResizeTextArea/AutoResizeTextArea';
import checkImageValidity from '../../utils/checkImageValidity';

function EditPost() {
  const [title, setTitle] = useState('');
  const [subheading, setSubheading] = useState('');
  const [content, setContent] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [coverImage, setCoverImage] = useState(null);
  const [coverImageInput, setCoverImageInput] = useState('');
  const [selectedBlogId, setSelectedBlogId] = useState(null);
  const [userBlogs, setUserBlogs] = useState([]);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // TODO: do not allow user to create a post without having at least one blog

  useEffect(() => {
    async function getUserBlogs() {
      try {
        const blogsResponse = await BlogAPI.getBlogsByUser(user.userId);
        setUserBlogs(blogsResponse.data.blogs);
        setSelectedBlogId(blogsResponse.data.blogs[0]._id);
      } catch (err) {
        console.error(err);
      }
    }
    if (user.userId) {
      getUserBlogs();
    }
  }, [user]);

  const handleImageUpload = async (imageUrl) => {
    const isValidImage = await checkImageValidity(imageUrl);
    if (isValidImage) {
      setCoverImage(imageUrl);
    } else {
      setCoverImage(null);
    }
  };

  // below function is for uploading local files
  // const handleImageUpload = (event) => {
  //   const selectedImage = event.target.files[0];

  //   if (selectedImage) {
  //     const reader = new FileReader();

  //     reader.onload = function (event) {
  //       const imageData = event.target.result;
  //       setCoverImageData(imageData);
  //     };

  //     reader.readAsDataURL(selectedImage);
  //     setCoverImage(selectedImage);
  //   }
  // };

  const handleOnClearButtonClick = () => {
    setCoverImage(null);
    setCoverImageInput('');
  };

  const handleTitleChange = (newTitle) => {
    setTitle(newTitle);
  };
  const handleSubheadingChange = (newSubheading) => {
    setSubheading(newSubheading);
  };
  const handleContentChange = (newContent, editor) => {
    setContent(newContent);
  };

  const publishPost = async () => {
    try {
      const response = await PostAPI.createPost(selectedBlogId, {
        title,
        subheading,
        content,
        published: true,
        cover_image: coverImage,
      });
      const postId = response?.data?.post?._id;
      if (postId) {
        navigate(`/posts/${postId}`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className={styles.postContainer}>
      <div className={styles.post}>
        <div className={styles.newPostForm}>
          <button
            className={styles.publishButton}
            onClick={() => setModalOpen(true)}
          >
            Publish
          </button>
          <div className='title'>
            <AutoResizeTextArea
              content={title}
              onTextChange={handleTitleChange}
              placeholder='Title'
              style={{
                fontSize: '32px',
                fontWeight: 'bold',
                fontFamily: 'Arial, sans-serif',
              }}
            />
          </div>
          <div className='subheading'>
            <AutoResizeTextArea
              content={subheading}
              onTextChange={handleSubheadingChange}
              placeholder='Subheading'
              style={{
                fontSize: '20px',
                color: 'gray',
                fontFamily: 'Arial, sans-serif',
              }}
            />
          </div>
          <TinyMCEEdit initialValue={content} onChange={handleContentChange} />
        </div>
      </div>
      {modalOpen && (
        <EditPostModal
          setModalOpen={setModalOpen}
          handleImageUpload={handleImageUpload}
          handleOnClearButtonClick={handleOnClearButtonClick}
          coverImage={coverImage}
          selectedBlogId={selectedBlogId}
          setSelectedBlogId={setSelectedBlogId}
          userBlogs={userBlogs}
          publishPost={publishPost}
          coverImageInput={coverImageInput}
          setCoverImageInput={setCoverImageInput}
        />
      )}
    </div>
  );
}

export default EditPost;
