import { Modal } from '@mantine/core';
import styles from './PublishPostModal.module.css';
import PostAPI from '../../../api/PostAPI';
import { useParams } from 'react-router-dom';
import { notifications } from '@mantine/notifications';

function PublishPostModal({
  opened,
  onClose,
  postIsSaved,
  setPostIsPublished,
}) {
  const { postId } = useParams();

  async function handleConfirmClick() {
    const blogCreationNotificationId = 'blog-creation-notification';
    try {
      notifications.show({
        id: blogCreationNotificationId,
        message: 'Publishing post...',
        autoClose: false,
      });
      const updatedPost = await PostAPI.updatePostContent(postId, {
        published: true,
      });
      setPostIsPublished(true);
      notifications.update({
        id: blogCreationNotificationId,
        message: 'Published post',
        autoClose: 3000,
      });
      onClose();
    } catch (err) {
      notifications.update({
        id: blogCreationNotificationId,
        message: 'Failed to publish post',
        autoClose: 3000,
      });

      console.error(err);
    }
  }

  return (
    <Modal
      className={styles.publishPostModal}
      opened={opened}
      onClose={onClose}
      title={
        <h2 style={{ fontSize: '30px', fontWeight: 'bold' }}>Publish Post?</h2>
      }
      size={'400px'}
      centered
    >
      <div className={styles.message}>
        {postIsSaved === false ? (
          <p>
            You have unsaved changes. Please save your post before publishing.
          </p>
        ) : (
          <p>This will publish this post to your blog.</p>
        )}
      </div>
      <div className={styles.actionButtons}>
        {postIsSaved !== false && (
          <button className={styles.confirmButton} onClick={handleConfirmClick}>
            Confirm
          </button>
        )}
      </div>
    </Modal>
  );
}

export default PublishPostModal;
