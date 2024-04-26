import { Modal } from '@mantine/core';
import styles from './DeletePostModal.module.css';
import PostAPI from '../../../../../api/PostAPI';
import { notifications } from '@mantine/notifications';
import { useContext } from 'react';
import DeletePostModalContext from '../../../../../context/DeletePostModalProvider';

function DeletePostModal({ removePost }) {
  const { isDeletePostModalOpen, postId, postTitle, closeDeletePostModal } =
    useContext(DeletePostModalContext);

  async function handleConfirmClick() {
    const deletePostNotificationId = `delete-post-notification-${postId}`;
    try {
      notifications.show({
        id: deletePostNotificationId,
        message: `Deleting "${postTitle}"...`,
        autoClose: false,
      });
      const deletedPost = await PostAPI.deletePost(postId);
      removePost(postId);
      notifications.update({
        id: deletePostNotificationId,
        message: `Deleted "${postTitle}"`,
        autoClose: 3000,
      });
      closeDeletePostModal();
    } catch (err) {
      notifications.update({
        id: deletePostNotificationId,
        message: `Failed to delete "${postTitle}"`,
        autoClose: 3000,
      });
      closeDeletePostModal();
    }
  }

  return (
    <Modal
      className={styles.deletePostModal}
      opened={isDeletePostModalOpen}
      onClose={closeDeletePostModal}
      onClick={(e) => e.stopPropagation()}
      transitionProps={{ duration: 50 }}
      title={
        <h2 style={{ fontSize: '30px', fontWeight: 'bold' }}>
          Delete post forever?
        </h2>
      }
      size={'400px'}
      centered
    >
      <div className={styles.message}>
        <p>
          This will delete &quot;
          <span className={styles.postTitle}>{postTitle}</span>&quot; forever.
          This action cannot be undone and the post will be lost permanently.
        </p>
      </div>
      <div className={styles.actionButtons}>
        <button className={styles.cancelButton}>CANCEL</button>
        <button className={styles.deleteButton} onClick={handleConfirmClick}>
          DELETE POST
        </button>
      </div>
    </Modal>
  );
}

export default DeletePostModal;
