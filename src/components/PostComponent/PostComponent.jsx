import styles from './PostComponent.module.css';

function PostComponent({
  title,
  coverPhoto,
  lastUpdated,
  authorName,
  profilePicture,
}) {
  return (
    <div className={styles.postComponent}>
      <div className={styles.leftSide}>
        <img src={coverPhoto} alt='cover photo' />
      </div>
    </div>
  );
}

export default PostComponent;
