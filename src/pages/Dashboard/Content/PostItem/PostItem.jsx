import styles from './PostItem.module.css';
import formatUTCDate from '../../../../utils/formatUTCDate';
import { useMediaQuery } from '@react-hook/media-query';
import { FaRegComment } from 'react-icons/fa';

function PostItem({ postData, onClick }) {
  const isSmallScreen = useMediaQuery('(max-width: 480px)');
  const title = postData.title !== '' ? postData.title : '(Untitled)';
  const coverImage = postData.cover_image;
  const lastModifiedDate = isSmallScreen
    ? formatUTCDate(postData.updated_at, 'MMM d')
    : formatUTCDate(postData.updated_at, 'MMM d, yyyy');
  const authorImage = postData?.author?.profile_photo;
  const authorUsername = postData.author.username;
  const isPublished = postData.published;

  return (
    <div className={styles.postItem} onClick={onClick}>
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
                <span className={styles.publishStatus}>
                  {isPublished ? 'Published' : 'Draft'}
                </span>
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
