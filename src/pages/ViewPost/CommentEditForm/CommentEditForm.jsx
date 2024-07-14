import styles from './CommentEditForm.module.css';
import AutoResizeTextarea from '../../../components/AutoResizeTextarea/AutoResizeTextarea';
import { useEffect, useState } from 'react';

function CommentEditForm({
  textareaRef,
  initialText,
  onActionButtonClick,
  onCancelButtonClick,
  actionButtonName,
  isActionButtonEnabled,
}) {
  const [currentText, setCurrentText] = useState(initialText);

  async function handleActionButtonClick() {
    if (onActionButtonClick) {
      await onActionButtonClick(currentText);
    }
  }

  async function handleCancelButtonClick() {
    if (onCancelButtonClick) {
      await onCancelButtonClick();
    }
  }

  function isActionButtonEnabledWithRequiredChecks() {
    const textIsNotEmpty = currentText.trim().length <= 0;
    if (textIsNotEmpty) {
      return false;
    }
    if (isActionButtonEnabled) {
      return isActionButtonEnabled(currentText);
    }
  }

  useEffect(() => {
    if (textareaRef && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.setSelectionRange(
        textareaRef.current.value.length,
        textareaRef.current.value.length,
      );
    }
  }, [textareaRef]);

  return (
    <div className={styles.commentEditForm}>
      <AutoResizeTextarea
        externalTextareaRef={textareaRef}
        className={styles.textarea}
        content={currentText}
        allowLineBreak={true}
        onTextChange={setCurrentText}
        placeholder='Add a comment...'
      />
      <div className={styles.actionButtons}>
        <button
          className={styles.cancelButton}
          onClick={handleCancelButtonClick}
        >
          Cancel
        </button>
        <button
          disabled={!isActionButtonEnabledWithRequiredChecks(currentText)}
          className={styles.actionButton}
          onClick={handleActionButtonClick}
        >
          {actionButtonName ? actionButtonName : 'Submit'}
        </button>
      </div>
    </div>
  );
}

export default CommentEditForm;
