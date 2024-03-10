import styles from './NewBlogModal.module.css';
import Modal from '../../../components/Modal/Modal';
import { useEffect, useState } from 'react';
import BlogAPI from '../../../api/BlogAPI';

function NewBlogModal({ isOpen, closeModal, onClose, onCancel, onSubmit }) {
  const [blogName, setBlogName] = useState('');
  const [blogNameError, setBlogNameError] = useState(false);
  const [blogDescription, setBlogDescription] = useState('');

  useEffect(() => {}, [isOpen]);

  useEffect(() => {
    if (blogNameError && blogName !== '') {
      setBlogNameError(false);
    }
  }, [blogName, blogNameError]);

  function handleSubmit() {
    if (blogName === '') {
      setBlogNameError(true);
      return;
    }
    createBlog();
    onSubmit && onSubmit();
  }

  async function createBlog() {
    try {
      const addedBlog = await BlogAPI.createBlog({
        title: blogName,
        description: blogDescription,
      });
      closeModal();
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} closeOnOverlayClick={true}>
      <div className={styles.newBlogModalContent}>
        <h2>Create New Blog</h2>
        <div className={styles.blogNameInputContainer}>
          <input
            type='text'
            value={blogName}
            onChange={(e) => setBlogName(e.target.value)}
            placeholder='Blog title'
            className={styles.blogNameInput}
          />
          {blogNameError && (
            <span className={styles.errorMsg}>Title must not be empty.</span>
          )}
        </div>
        <input
          type='text'
          value={blogDescription}
          onChange={(e) => setBlogDescription(e.target.value)}
          placeholder='Blog description'
          className={styles.blogDescriptionInput}
        />
        <div className={styles.buttonsContainer}>
          <button className={styles.addBlogButton} onClick={handleSubmit}>
            Add Blog
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default NewBlogModal;
