import styles from './Comment.module.css';
import toRelativeTimeLuxon from '../../../utils/toRelativeTimeLuxon';
import { NavLink } from 'react-router-dom';

function Comment({ commentData }) {
  const profilePhoto = commentData.author.profile_photo;
  const content = commentData.content;
  const username = commentData.author.username;
  const commentCreationDate = toRelativeTimeLuxon(commentData.created_at);
  const commentUserId = commentData.author._id;

  return (
    <div className={styles.comment}>
      <img
        src={
          profilePhoto !== null
            ? profilePhoto
            : '/images/default_profile_photo.jpg'
        }
        alt='user profile pic'
      />
      <div className={styles.rightSide}>
        <p>
          <NavLink to={`/users/${commentUserId}`}>@{username}</NavLink>
          <span className={styles.commentCreationDate}>
            {' '}
            • {commentCreationDate}
          </span>
        </p>
        <p>{content}</p>
      </div>
    </div>
  );
}

export default Comment;
