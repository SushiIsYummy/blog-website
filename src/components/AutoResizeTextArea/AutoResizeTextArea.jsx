import { useEffect, useRef } from 'react';
import './AutoResizeTextArea.module.css';
import PropTypes from 'prop-types';

const AutoResizeTextArea = ({
  onTextChange,
  content,
  placeholder = '',
  initialRows = 1,
  allowLineBreak = true,
  style,
  onClick,
  onFocus,
}) => {
  const textAreaRef = useRef(null);

  // make sure textarea is resized when the input is changed
  // via user typing or programmatically
  useEffect(() => {
    handleResize();
  }, [content]);

  function handleResize() {
    const textArea = textAreaRef.current;
    if (textArea) {
      textArea.style.height = 'auto';
      textArea.style.height = textArea.scrollHeight + 'px';
    }
  }

  function handleOnEnterDown(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  }

  function handleOnChange(e) {
    handleResize();
    onTextChange && onTextChange(e.target.value);
  }

  return (
    <textarea
      ref={textAreaRef}
      rows={initialRows}
      placeholder={placeholder}
      onKeyDown={!allowLineBreak ? handleOnEnterDown : undefined}
      onChange={handleOnChange}
      onClick={onClick ? onClick : undefined}
      onFocus={onFocus ? onFocus : undefined}
      style={style}
      value={content}
    ></textarea>
  );
};

AutoResizeTextArea.propTypes = {
  content: PropTypes.string,
  onTextChange: PropTypes.func,
  placeholder: PropTypes.string,
  initialRows: PropTypes.number,
  allowLineBreak: PropTypes.bool,
  style: PropTypes.object,
  onClick: PropTypes.func,
  onFocus: PropTypes.func,
};

export default AutoResizeTextArea;
