import { useLoaderData, NavLink, Form } from 'react-router-dom';
import styles from './EditPost.module.css';
import BlogAPI from '../../api/BlogAPI';
import PostAPI from '../../api/PostAPI';
import TinyMCEView from '../../components/TinyMCE/TinyMCEView';
import TinyMCEEdit from '../../components/TinyMCE/TinyMCEEdit';
import { useEffect, useState } from 'react';
import TinyMCEInput from '../../components/TinyMCE/TinyMCEInput';
import Modal from '../../components/Modal/Modal';
import './EditPost.css';
import { useContext } from 'react';
import AuthContext from '../../context/AuthProvider';

function EditPost() {
  const [title, setTitle] = useState('');
  const [subheading, setSubheading] = useState('');
  const [content, setContent] = useState('');
  const [modalOpen, setModalOpen] = useState(true);
  const [coverImage, setCoverImage] = useState(null);
  const [blogId, setBlogId] = useState(null);
  const [userBlogs, setUserBlogs] = useState([]);
  const { auth, user } = useContext(AuthContext);

  useEffect(() => {
    async function getUserBlogs() {
      try {
        const blogsResponse = await BlogAPI.getBlogsByUser(user.userId);
        setUserBlogs(blogsResponse.data.blogs);
      } catch (err) {
        console.error(err);
      }
    }
    if (user.userId) {
      getUserBlogs();
    }
  }, [user]);

  const handleImageUpload = (event) => {
    const selectedImage = event.target.files[0];
    setCoverImage(selectedImage);
  };
  const handleTitleChange = (newTitle, editor) => {
    setTitle(newTitle);
  };
  const handleSubheadingChange = (newSubheading, editor) => {
    setSubheading(newSubheading);
  };
  const handleContentChange = (newContent, editor) => {
    setContent(newContent);
  };

  const publishPost = async () => {
    // e.preventDefault();
    try {
      const response = await PostAPI.createPost(blogId, {
        title,
        subheading,
        content,
        published: true,
        cover_image: null,
      });
      // setSavedAboutContent(editAboutContent);
      // setEditMode(false);
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
            <TinyMCEInput
              content={title}
              placeholder={'Title'}
              onChange={handleTitleChange}
            />
          </div>
          <div className='subheading'>
            <TinyMCEInput
              content={subheading}
              placeholder={'Subheading'}
              onChange={handleSubheadingChange}
            />
          </div>
          <TinyMCEEdit initialValue={content} onChange={handleContentChange} />
        </div>
      </div>
      {modalOpen && (
        <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
          <button onClick={() => setModalOpen(false)}>X</button>
          <p>select cover image</p>
          <input
            type='file'
            id='img'
            name='img'
            accept='image/*'
            onChange={handleImageUpload}
          />
          <div className={styles.imageContainer}>
            <img
              src={
                coverImage
                  ? URL.createObjectURL(coverImage)
                  : '/images/no-image.jpg'
              }
              alt=''
            />
          </div>
          <button className={styles.publishNow} onClick={publishPost}>
            Publish Now
          </button>
        </Modal>
      )}
    </div>
  );
}

export default EditPost;
