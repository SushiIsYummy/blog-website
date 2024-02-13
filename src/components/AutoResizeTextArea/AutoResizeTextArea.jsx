import { useState } from 'react';
import styles from './AutoResizeTextArea.module.css';

const AutoResizeTextArea = ({
  onTextChange,
  content,
  placeholder = '',
  initialRows = '1',
  style,
}) => {
  function handleOnInput(e) {
    const textArea = e.target;
    textArea.style.height = 'auto';
    textArea.style.height = textArea.scrollHeight + 'px';
  }

  function handleOnKeyDown(e) {
    // Prevent default behavior of pressing Enter key
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  }

  return (
    <div className={styles.textAreaContainer}>
      <textarea
        rows={initialRows}
        placeholder={placeholder}
        onInput={handleOnInput}
        onKeyDown={handleOnKeyDown}
        onChange={(e) => onTextChange(e.target.value)}
        style={style}
      >
        {content}
      </textarea>
    </div>
  );
};

export default AutoResizeTextArea;
