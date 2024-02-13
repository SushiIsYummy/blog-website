import styles from './EditPostModal.module.css';

function EditPostModal({
  setModalOpen,
  handleImageUpload,
  handleOnClearButtonClick,
  coverImage,
  selectedBlogId,
  setSelectedBlogId,
  userBlogs,
  publishPost,
  coverImageInput,
  setCoverImageInput,
}) {
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button
          className={styles.closeButton}
          onClick={() => setModalOpen(false)}
        >
          X
        </button>
        <div className={styles.editContent}>
          <div className={styles.selectCoverImage}>
            <p>
              Select cover image (provide a valid external link to an image)
            </p>
            <input
              type='text'
              value={coverImageInput}
              onChange={(e) => {
                setCoverImageInput(e.target.value);
                handleImageUpload(e.target.value);
              }}
            />
            <button
              className={styles.clearImageButton}
              onClick={handleOnClearButtonClick}
            >
              Clear image
            </button>
            <div className={styles.imageContainer}>
              <img
                src={coverImage ? coverImage : '/images/no-image.jpg'}
                alt=''
              />
            </div>
          </div>
          <div className={styles.selectBlog}>
            <p>Select blog to publish in:</p>
            <select
              value={selectedBlogId}
              onChange={(e) => setSelectedBlogId(e.target.value)}
            >
              {userBlogs.map((blog) => {
                return (
                  <option key={blog._id} value={blog._id}>
                    {blog.title}
                  </option>
                );
              })}
            </select>
          </div>
          <button className={styles.publishNow} onClick={publishPost}>
            Publish Now
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditPostModal;
