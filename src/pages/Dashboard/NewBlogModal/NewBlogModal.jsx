import styles from './NewBlogModal.module.css';
import Modal from '../../../components/Modal/Modal';
import { useEffect, useState } from 'react';
import BlogAPI from '../../../api/BlogAPI';
import { notifications } from '@mantine/notifications';

function NewBlogModal({ isOpen, onClose, onSubmit, onNewBlogAdded }) {
  const [blogName, setBlogName] = useState('');
  const [blogNameError, setBlogNameError] = useState(false);
  const [blogDescription, setBlogDescription] = useState('');
  const [errorCreatingBlog, setErrorCreatingBlog] = useState(false);
  const [creatingBlog, setCreatingBlog] = useState(false);

  // remove title error while typing
  useEffect(() => {
    if (blogNameError && blogName !== '') {
      setBlogNameError(false);
    }
  }, [blogName, blogNameError]);

  function handleSubmit() {
    setErrorCreatingBlog(false);
    if (blogName === '') {
      setBlogNameError(true);
      return;
    }
    createBlog();
    onSubmit && onSubmit();
  }

  function handleCancel() {
    onClose && onClose();
    clearInputs();
  }

  async function createBlog() {
    const blogCreationNotificationId = 'blog-creation-notification';
    try {
      setCreatingBlog(true);
      notifications.show({
        id: blogCreationNotificationId,
        message: 'Processing...',
        autoClose: false,
      });
      const addedBlog = await BlogAPI.createBlog({
        title: blogName,
        description: blogDescription,
      });
      notifications.update({
        id: blogCreationNotificationId,
        message: 'Blog created successfully',
        autoClose: 3000,
      });
      await onNewBlogAdded(addedBlog.data.blog._id);
      clearInputs();
    } catch (err) {
      console.error(err);
      setErrorCreatingBlog(true);
      notifications.update({
        id: blogCreationNotificationId,
        message: 'Failed to create blog',
        autoClose: 3000,
      });
    } finally {
      setCreatingBlog(false);
    }
  }

  function clearInputs() {
    setBlogName('');
    setBlogDescription('');
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} includeCloseIcon={false}>
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
        <textarea
          value={blogDescription}
          onChange={(e) => setBlogDescription(e.target.value)}
          placeholder='Blog description'
          className={styles.blogDescriptionInput}
        />
        {errorCreatingBlog && !creatingBlog && (
          <p className={styles.errorMsg}>
            An error occured while creating blog. Please try again.
          </p>
        )}
        {creatingBlog && <p>Creating blog...</p>}
        <div className={styles.buttonsContainer}>
          <button className={styles.cancelButton} onClick={handleCancel}>
            Cancel
          </button>
          <button
            className={styles.addBlogButton}
            onClick={!creatingBlog ? handleSubmit : undefined}
          >
            Add Blog
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default NewBlogModal;
