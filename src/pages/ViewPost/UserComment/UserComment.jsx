import styles from './UserComment.module.css';
import AutoResizeTextarea from '../../../components/AutoResizeTextarea/AutoResizeTextarea';
import { useState } from 'react';
import _trimStart from 'lodash/trimStart';
import PropTypes from 'prop-types';

function UserComment({
  textareaRef,
  profilePic,
  profilePicSize = 40,
  onUserCommentActionClick,
  onUserCommentCancelClick,
  actionButtonName,
  actionButtonsOpenInitially,
}) {
  const [userComment, setUserComment] = useState('');
  const [userCommentDisabled, setUserCommentDisabled] = useState(true);
  const [showCommentActionButtons, setShowCommentActionButtons] = useState(
    actionButtonsOpenInitially || false,
  );

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
    onUserCommentCancelClick && onUserCommentCancelClick();
  }

  async function handleUserCommentActionClick(e) {
    if (onUserCommentActionClick) {
      try {
        await onUserCommentActionClick(userComment);
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
        style={{ width: profilePicSize, height: profilePicSize }}
      />
      <div className={styles.rightSide}>
        <AutoResizeTextarea
          externalTextareaRef={textareaRef}
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
              onClick={handleUserCommentActionClick}
            >
              {actionButtonName ? actionButtonName : 'Submit'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

UserComment.propTypes = {
  profilePic: PropTypes.string,
  onUserCommentActionClick: PropTypes.func,
  onUserCancelClick: PropTypes.func,
};

export default UserComment;
