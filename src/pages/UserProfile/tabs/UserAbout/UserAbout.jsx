import { Form, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import styles from './UserAbout.module.css';
import TinyMCEEdit from '../../../../components/TinyMCE/TinyMCEEdit';
import TinyMCEView from '../../../../components/TinyMCE/TinyMCEView';
import UserAPI from '../../../../api/UserAPI';

function UserAbout({
  editAboutContent,
  setEditAboutContent,
  savedAboutContent,
  setSavedAboutContent,
}) {
  const { userId } = useParams();
  const [editMode, setEditMode] = useState(false);

  // Possible feature: keep edit mode open if it is open before
  // switching tabs

  // Set the edit content back to previous saved content
  // when switching tabs.
  useEffect(() => {
    return () => {
      setEditAboutContent(savedAboutContent);
    };
  }, []);

  const handleContentChange = (newContent, editor) => {
    setEditAboutContent(newContent);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await UserAPI.updateUserAbout(userId, {
        about: editAboutContent,
      });
      setSavedAboutContent(editAboutContent);
      setEditMode(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      {editMode && (
        <div className={styles.aboutContentContainer}>
          <div className={styles.aboutContentView}>
            <Form className={styles.aboutForm} onSubmit={handleSubmit}>
              <TinyMCEEdit
                initialValue={editAboutContent}
                onChange={handleContentChange}
              />
              <div className={styles.cancelAndSaveButtons}>
                <button
                  type='button'
                  className={styles.cancelButton}
                  onClick={() => {
                    setEditMode(false);
                    setEditAboutContent(savedAboutContent);
                  }}
                >
                  Cancel
                </button>
                <button type='submit' className={styles.saveButton}>
                  Save
                </button>
              </div>
            </Form>
          </div>
        </div>
      )}
      {!editMode && (
        <div className={styles.aboutContentContainer}>
          <div className={styles.aboutContentEdit}>
            <TinyMCEView content={savedAboutContent}></TinyMCEView>
            <button
              className={styles.editButton}
              onClick={() => setEditMode(true)}
            >
              Edit
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserAbout;
