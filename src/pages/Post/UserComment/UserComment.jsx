import styles from './UserComment.module.css';
import AutoResizeTextArea from '../../../components/AutoResizeTextArea/AutoResizeTextArea';
import { useState } from 'react';
import _trimStart from 'lodash/trimStart';
import PropTypes from 'prop-types';

function UserComment({
  profilePic,
  onUserCommentCommentClick,
  onUserCancelClick,
}) {
  const [userComment, setUserComment] = useState('');
  const [userCommentDisabled, setUserCommentDisabled] = useState(true);
  const [showCommentActionButtons, setShowCommentActionButtons] =
    useState(false);

  function handleUserCommentChange(comment) {
    const trimmedComment = _trimStart(comment);
    if (trimmedComment !== '') {
      setUserCommentDisabled(false);
    } else {
      setUserCommentDisabled(true);
    }
    setUserComment(comment);
  }

  function handleUserCommentFocus(e) {
    if (e.target.value === '' && !showCommentActionButtons) {
      setShowCommentActionButtons(true);
    }
  }

  function resetCommentState(e) {
    e.target.blur();
    setUserComment('');
    setUserCommentDisabled(true);
    setShowCommentActionButtons(false);
  }

  function handleUserCommentCancelClick(e) {
    resetCommentState(e);
    onUserCancelClick && onUserCancelClick();
  }

  async function handleUserCommentCommentClick(e) {
    if (onUserCommentCommentClick) {
      try {
        await onUserCommentCommentClick(userComment);
        resetCommentState(e);
      } catch (err) {
        console.error(err);
      }
    }
  }

  return (
    <div className={styles.userComment}>
      <img
        src={
          profilePic !== null ? profilePic : '/images/default_profile_photo.jpg'
        }
        alt='user profile pic'
      />
      <div className={styles.rightSide}>
        <AutoResizeTextArea
          content={userComment}
          allowLineBreak={true}
          onTextChange={handleUserCommentChange}
          placeholder='Add a comment...'
          onFocus={handleUserCommentFocus}
        />
        {showCommentActionButtons && (
          <div className={styles.userCommentActionButtons}>
            <button
              className={styles.cancelButton}
              onClick={handleUserCommentCancelClick}
            >
              Cancel
            </button>
            <button
              disabled={userCommentDisabled}
              className={styles.commentButton}
              onClick={handleUserCommentCommentClick}
            >
              Comment
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

UserComment.propTypes = {
  profilePic: PropTypes.string,
  onUserCommentCommentClick: PropTypes.func,
  onUserCancelClick: PropTypes.func,
};

export default UserComment;
