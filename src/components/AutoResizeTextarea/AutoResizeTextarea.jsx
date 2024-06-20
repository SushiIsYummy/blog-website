import { useEffect, useRef } from 'react';
import './AutoResizeTextarea.module.css';
import PropTypes from 'prop-types';

const AutoResizeTextarea = ({
  externalTextareaRef,
  onTextChange,
  content,
  placeholder = '',
  initialRows = 1,
  allowLineBreak = true,
  style,
  onClick,
  onFocus,
}) => {
  const internalTextareaRef = useRef(null);
  const textareaRef = externalTextareaRef || internalTextareaRef;

  // make sure textarea is resized when the input is changed
  // via user typing or programmatically
  useEffect(() => {
    handleResize(textareaRef);
  }, [content, textareaRef]);

  function handleOnEnterDown(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  }

  function handleOnChange(e) {
    if (textareaRef.current) {
      handleResize(textareaRef);
    }
    onTextChange && onTextChange(e.target.value);
  }

  return (
    <textarea
      ref={textareaRef}
      rows={initialRows}
      placeholder={placeholder}
      onKeyDown={!allowLineBreak ? handleOnEnterDown : undefined}
      onChange={handleOnChange}
      onClick={onClick ? onClick : undefined}
      onFocus={onFocus ? onFocus : undefined}
      style={style}
      value={content}
    />
  );
};

AutoResizeTextarea.propTypes = {
  content: PropTypes.string,
  onTextChange: PropTypes.func,
  placeholder: PropTypes.string,
  initialRows: PropTypes.number,
  allowLineBreak: PropTypes.bool,
  style: PropTypes.object,
  onClick: PropTypes.func,
  onFocus: PropTypes.func,
};

function handleResize(textAreaRef) {
  const textArea = textAreaRef.current;
  if (textArea) {
    textArea.style.height = 'auto';
    textArea.style.height = textArea.scrollHeight + 'px';
  }
}

export default AutoResizeTextarea;
