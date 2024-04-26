import styles from './CommentItem.module.css';
// import Modal from '../../../components/Modal/Modal';
// import { useEffect, useState } from 'react';
// import BlogAPI from '../../../api/BlogAPI';
import AuthContext from '../../../../context/AuthProvider';
import { useContext } from 'react';
import formatUTCDateToLocal from '../../../../utils/formatUTCDateToLocal';
import { NavLink } from 'react-router-dom';

function CommentItem({ commentData }) {
  const { user } = useContext(AuthContext);
  const title = commentData.title;
  const userProfilePic = commentData.author.profile_photo;
  const authorName = commentData.author.username;
  const authorId = commentData.author._id;
  const postId = commentData.post._id;
  const commentId = commentData._id;
  const postTitle = commentData.post.title;
  const commentDate = formatUTCDateToLocal(
    commentData.created_at,
    'MMM d, yyyy',
  );
  const commentContent = commentData.content;

  return (
    <div className={styles.commentItem}>
      <div className={styles.commentCoverImageContainer}>
        <img
          src={userProfilePic ?? '/images/default_profile_photo.jpg'}
          alt='comment cover image'
        />
      </div>
      <div className={styles.commentDetails}>
        <div className={styles.topPart}>
          <p className={styles.commentActivity}>
            <NavLink
              to={`/users/${authorId}`}
              className={styles.authorUsername}
            >
              {authorName}
            </NavLink>{' '}
            commented on{' '}
            <NavLink
              to={`/posts/${postId}?hc=${commentId}`}
              className={styles.postTitle}
            >
              &quot;{postTitle}&quot;
            </NavLink>
          </p>
          <p className={styles.commentDate}>{commentDate}</p>
        </div>
        <div className={styles.bottomPart}>
          <p className={styles.commentContent}>{commentContent}</p>
        </div>
      </div>
    </div>
  );
}

export default CommentItem;
