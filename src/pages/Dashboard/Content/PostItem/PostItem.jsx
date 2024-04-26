import styles from './PostItem.module.css';
import formatUTCDateToLocal from '../../../../utils/formatUTCDateToLocal';
import { useMediaQuery } from '@react-hook/media-query';
// import { FaRegComment } from 'react-icons/fa';
import { Tooltip } from '@mantine/core';
import { useState } from 'react';
import OverflowMenu from './OverflowMenu/OverflowMenu';
import { useNavigate } from 'react-router-dom';
import { notifications } from '@mantine/notifications';
import PostAPI from '../../../../api/PostAPI';
import PostItemOptions from './PostItemOptions/PostItemOptions';
import clsx from 'clsx';

function PostItem({ postData, inTrash, removePost, selectedOption }) {
  const maxWidth600 = useMediaQuery('(max-width: 600px)');
  const minWidth500 = useMediaQuery('(min-width: 500px)');
  const isHoverDevice = useMediaQuery('(hover: hover)');
  const title = postData.title !== '' ? postData.title : '(Untitled)';
  const coverImage = postData.cover_image;
  const lastModifiedDate =
    formatUTCDateToLocal(postData.updated_at, 'MMM d, yyyy') ||
    formatUTCDateToLocal(postData.created_at, 'MMM d, yyyy');
  const trashedDate =
    formatUTCDateToLocal(postData.trashed_at, 'MMM d, yyyy') || 'No date';
  const trashedTime =
    formatUTCDateToLocal(postData.trashed_at, 'h:mma') || 'No time';
  const lastModifiedTime =
    formatUTCDateToLocal(postData.updated_at, 'h:mma') ||
    formatUTCDateToLocal(postData.created_at, 'h:mma');
  const lastModifiedDateTooltip = `${lastModifiedDate}, ${lastModifiedTime}, Last Modified Date`;
  const trashedDateTooltip = `${trashedDate}, ${trashedTime}, Trashed Date`;

  const authorImage = postData?.author?.profile_photo;
  const authorUsername = postData.author.username;
  const [isPublished, setIsPublished] = useState(postData.published);

  const postId = postData._id;
  const blogId = postData.blog;
  const navigate = useNavigate();

  const [isHovered, setIsHovered] = useState(false);

  async function handleTrashClick() {
    const trashPostNotificationId = `trash-post-notification-${postId}`;
    try {
      notifications.show({
        id: trashPostNotificationId,
        message: `Moving "${title}" to Trash...`,
        autoClose: false,
      });
      const trashedPost = await PostAPI.movePostToTrash(postId);
      removePost(postId);
      notifications.update({
        id: trashPostNotificationId,
        message: `Moved "${title}" to Trash`,
        autoClose: 3000,
      });
    } catch (err) {
      notifications.update({
        id: trashPostNotificationId,
        message: `Failed to move ${title} to Trash`,
        autoClose: 3000,
      });
    }
  }

  async function handleRestoreClick(action) {
    const restorePostNotificationId = `restore-post-notification-${postId}`;
    try {
      notifications.show({
        id: restorePostNotificationId,
        message: `Restoring "${title}"...`,
        autoClose: false,
      });
      const restoredPost = await PostAPI.restorePostFromTrash(postId, {
        action: action,
      });
      removePost(postId);
      notifications.update({
        id: restorePostNotificationId,
        message: `Restored "${title}"`,
        autoClose: 3000,
      });
    } catch (err) {
      notifications.update({
        id: restorePostNotificationId,
        message: `Failed to restore "${title}"`,
        autoClose: 3000,
      });
    }
  }

  async function handlePublishClick() {
    const publishPostNotificationId = `publish-post-notification-${postId}`;
    try {
      notifications.show({
        id: publishPostNotificationId,
        message: `Publishing "${title}"...`,
        autoClose: false,
      });
      const restoredPost = await PostAPI.updatePostPublishStatus(postId, {
        published: true,
      });
      setIsPublished(true);
      if (selectedOption === 'Draft') {
        removePost(postId);
      }
      notifications.update({
        id: publishPostNotificationId,
        message: `Published "${title}"`,
        autoClose: 3000,
      });
    } catch (err) {
      notifications.update({
        id: publishPostNotificationId,
        message: `Failed to publish "${title}"`,
        autoClose: 3000,
      });
    }
  }
  async function handleUnpublishClick() {
    const publishPostNotificationId = `unpublish-post-notification-${postId}`;
    try {
      notifications.show({
        id: publishPostNotificationId,
        message: `Unpublishing "${title}"...`,
        autoClose: false,
      });
      const unpublishedPost = await PostAPI.updatePostPublishStatus(postId, {
        published: false,
      });
      setIsPublished(false);
      if (selectedOption === 'Published') {
        removePost(postId);
      }
      notifications.update({
        id: publishPostNotificationId,
        message: `Unpublished "${title}"`,
        autoClose: 3000,
      });
    } catch (err) {
      notifications.update({
        id: publishPostNotificationId,
        message: `Failed to unpublish "${title}"`,
        autoClose: 3000,
      });
    }
  }

  return (
    <div
      className={styles.postItem}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => {
        !inTrash && navigate(`/dashboard/blogs/${blogId}/posts/${postId}/edit`);
      }}
    >
      <div className={styles.postCoverImageContainer}>
        <img
          src={coverImage ?? '/images/no-image.jpg'}
          alt='post cover image'
        />
      </div>
      <div className={styles.postDetails}>
        <div className={styles.topPart}>
          <p className={styles.title}>{title}</p>
          <div className={styles.topRight} onClick={(e) => e.stopPropagation()}>
            {maxWidth600 || !isHoverDevice ? (
              <OverflowMenu
                postId={postId}
                postTitle={title}
                inTrash={inTrash}
                isPublished={isPublished}
                onPublishClick={handlePublishClick}
                onRestoreClick={handleRestoreClick}
                onUnpublishClick={handleUnpublishClick}
                onTrashClick={handleTrashClick}
              />
            ) : (
              <>
                <PostItemOptions
                  inTrash={inTrash}
                  isHovered={isHovered}
                  postId={postId}
                  title={title}
                  isPublished={isPublished}
                  onRestoreClick={handleRestoreClick}
                  onTrashClick={handleTrashClick}
                  onUnpublishClick={handleUnpublishClick}
                  onPublishClick={handlePublishClick}
                />
                <div className={styles.usernameAndProfilePic}>
                  {!isHovered && (
                    <p className={styles.username}>{authorUsername}</p>
                  )}
                  <img
                    className={styles.profilePic}
                    src={authorImage ?? '/images/default_profile_photo.jpg'}
                    alt='post cover image'
                  />
                </div>
              </>
            )}
          </div>
        </div>
        <div className={styles.bottomPart}>
          <div className={styles.publishStatusAndLastModifiedDate}>
            <p>
              <span
                className={clsx({
                  [styles.publishStatus]: true,
                  [styles.published]: isPublished,
                  [styles.draft]: !isPublished,
                })}
              >
                {isPublished ? 'Published' : 'Draft'}
              </span>
              {inTrash && (
                <span className={styles.trashIndicator}>&nbsp;(Trash)</span>
              )}
            </p>
            {minWidth500 && <span>&nbsp;•&nbsp;</span>}
            <Tooltip
              label={inTrash ? trashedDateTooltip : lastModifiedDateTooltip}
              onClick={(e) => e.stopPropagation()}
            >
              <p className={styles.lastModifiedDate}>{lastModifiedDate}</p>
            </Tooltip>
          </div>
          {/* <div className={styles.commentCount}>
            {} <FaRegComment />
          </div> */}
        </div>
      </div>
    </div>
  );
}

export default PostItem;
