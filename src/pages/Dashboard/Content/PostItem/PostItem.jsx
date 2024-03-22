import styles from './PostItem.module.css';
import AuthContext from '../../../../context/AuthProvider';
import { useContext } from 'react';
import formatUTCDate from '../../../../utils/formatUTCDate';
import { useMediaQuery } from '@react-hook/media-query';
import { FaRegComment } from 'react-icons/fa';

function PostItem({ postData }) {
  const { user } = useContext(AuthContext);
  const isSmallScreen = useMediaQuery('(max-width: 480px)');
  const title = postData.title;
  const coverImage = postData.cover_image;
  const lastModifiedDate = isSmallScreen
    ? formatUTCDate(postData.updated_at, 'MMM d')
    : formatUTCDate(postData.updated_at, 'MMM d, yyyy');
  const authorImage = postData?.author?.profile_photo;
  const authorUsername = postData.author.username;

  return (
    <div className={styles.postItem}>
      <div className={styles.postCoverImageContainer}>
        <img
          src={coverImage ?? '/images/no-image.jpg'}
          alt='post cover image'
        />
      </div>
      <div className={styles.postDetails}>
        <div className={styles.topPart}>
          <p className={styles.title}>{title}</p>
          <div className={styles.usernameAndProfilepic}>
            <p className={styles.username}>{authorUsername}</p>
            <img
              className={styles.profilePic}
              src={authorImage ?? '/images/default_profile_photo.jpg'}
              alt='post cover image'
            />
          </div>
        </div>
        <div className={styles.bottomPart}>
          <div className={styles.publishStatusAndLastModifiedDate}>
            {!isSmallScreen && (
              <>
                <span className={styles.publishStatus}>[published]</span>
                {' • '}
              </>
            )}
            <span className={styles.lastModifiedDate}>{lastModifiedDate}</span>
          </div>
          <div className={styles.commentCount}>
            {} <FaRegComment />
          </div>
        </div>
      </div>
    </div>
  );
}

export default PostItem;
