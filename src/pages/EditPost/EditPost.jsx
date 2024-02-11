import { useLoaderData, NavLink, Form } from 'react-router-dom';
import styles from './EditPost.module.css';
import BlogAPI from '../../api/BlogAPI';
import PostAPI from '../../api/PostAPI';
import TinyMCEView from '../../components/TinyMCE/TinyMCEView';
import TinyMCEEdit from '../../components/TinyMCE/TinyMCEEdit';
import { useState } from 'react';
import TinyMCEInput from '../../components/TinyMCE/TinyMCEInput';
import Modal from '../../components/Modal/Modal';
import './EditPost.css';

export async function loader({ params }) {
  return null;
}

function EditPost() {
  const [title, setTitle] = useState('');
  const [subheading, setSubheading] = useState('');
  const [content, setContent] = useState('');
  console.log(title);
  const [modalOpen, setModalOpen] = useState(true);
  const [coverImage, setCoverImage] = useState(null);

  const handleImageUpload = (event) => {
    const selectedImage = event.target.files[0];
    // Update the state with the selected image
    setCoverImage(selectedImage);
    console.log(selectedImage);
    // Optionally, you can also display the image preview here
    // For example, if you want to display a preview of the image before uploading
    // You can use FileReader to read the file and set it as src for an img tag
    // Example:
    // const reader = new FileReader();
    // reader.onload = (e) => {
    //   setImagePreview(e.target.result);
    // };
    // reader.readAsDataURL(selectedImage);
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
      // userId should
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
            // value={'no file chosen'}
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
