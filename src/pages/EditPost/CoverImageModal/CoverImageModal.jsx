import { useDisclosure, usePageLeave } from '@mantine/hooks';
import { Modal, useMantineTheme } from '@mantine/core';
import styles from './CoverImageModal.module.css';
import { useState } from 'react';
import checkImageValidity from '../../../utils/checkImageValidity';
import PostAPI from '../../../api/PostAPI';
import { useParams } from 'react-router-dom';

function CoverImageModal({
  opened,
  onClose,
  currentCoverImage,
  setCurrentCoverImage,
}) {
  const [newCoverImage, setNewCoverImage] = useState(null);
  const [newCoverImageInput, setNewCoverImageInput] = useState('');
  const [updatingCoverImage, setUpdatingCoverImage] = useState(false);
  const [updatedCoverImage, setUpdatedCoverImage] = useState(false);
  const [isValidImageInput, setIsValidImageInput] = useState(true);
  const { postId } = useParams();

  async function handleImageUpload(imageUrl) {
    const isValidImage = await checkImageValidity(imageUrl);

    if (imageUrl === '') {
      setNewCoverImage(null);
      setIsValidImageInput(true);
      return;
    }

    if (isValidImage) {
      setNewCoverImage(imageUrl);
      setIsValidImageInput(true);
    } else {
      setNewCoverImage(null);
      setIsValidImageInput(false);
    }
  }

  // below function is for uploading local files
  // const handleImageUpload = (event) => {
  //   const selectedImage = event.target.files[0];

  //   if (selectedImage) {
  //     const reader = new FileReader();

  //     reader.onload = function (event) {
  //       const imageData = event.target.result;
  //       setCoverImageData(imageData);
  //     };

  //     reader.readAsDataURL(selectedImage);
  //     setCoverImage(selectedImage);
  //   }
  // };

  // const handleOnClearButtonClick = () => {
  //   setCoverImage(null);
  //   setCoverImageInput('');
  // };

  function handleOnClearButtonClick() {
    setNewCoverImage(null);
    setNewCoverImageInput('');
  }

  async function updateCoverImage() {
    try {
      setUpdatingCoverImage(true);
      const updatedPost = await PostAPI.updatePost(postId, {
        cover_image: newCoverImage,
      });
      setCurrentCoverImage(newCoverImage);
      setUpdatedCoverImage(true);
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingCoverImage(false);
    }
  }

  return (
    <Modal
      className={styles.coverImageModal}
      title={
        <h2 style={{ fontSize: '30px', fontWeight: 'bold' }}>
          Change cover image
        </h2>
      }
      size={'auto'}
      opened={opened}
      onClose={onClose}
      centered
    >
      <div className={styles.editContent}>
        <h3>Current Cover Image</h3>
        <div className={styles.imageContainer}>
          <img
            src={currentCoverImage ? currentCoverImage : '/images/no-image.jpg'}
            alt=''
          />
        </div>
        <h3>New Cover Image</h3>
        <div className={styles.selectCoverImage}>
          <p>
            Select new cover image (provide a valid external link to an image)
          </p>
          <div className={styles.inputAndClearButton}>
            <input
              type='text'
              value={newCoverImageInput}
              onChange={(e) => {
                setUpdatedCoverImage(false);
                setNewCoverImageInput(e.target.value);
                handleImageUpload(e.target.value);
              }}
            />
            <button
              className={styles.clearInputButton}
              onClick={handleOnClearButtonClick}
            >
              Clear input
            </button>
          </div>
          {!isValidImageInput && (
            <span className={styles.invalidImageMsg}>Invalid image url!</span>
          )}
        </div>
        <div className={styles.imageContainer}>
          <img
            src={newCoverImage ? newCoverImage : '/images/no-image.jpg'}
            alt=''
          />
        </div>
        <div className={styles.updateButtonContainer}>
          {updatingCoverImage && <p>Saving cover image...</p>}
          {!updatingCoverImage && updatedCoverImage && <p>Saved!</p>}
          <button
            className={`${styles.updateButton}`}
            onClick={
              !updatingCoverImage && isValidImageInput && updateCoverImage
            }
          >
            Update
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default CoverImageModal;
