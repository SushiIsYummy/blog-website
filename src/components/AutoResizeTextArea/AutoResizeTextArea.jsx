import { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import './AutoResizeTextArea.module.css';
import PropTypes from 'prop-types';

const AutoResizeTextArea = ({
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
  const internalTextAreaRef = useRef(null);
  const textAreaRef = externalTextareaRef || internalTextAreaRef;
  
  // make sure textarea is resized when the input is changed
  // via user typing or programmatically
  useEffect(() => {
    handleResize(textAreaRef);
  }, [content, textAreaRef]);

  function handleOnEnterDown(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  }

  function handleOnChange(e) {
    if (textAreaRef.current) {
      handleResize(textAreaRef);
    }
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

function handleResize(textAreaRef) {
  const textArea = textAreaRef.current;
  if (textArea) {
    textArea.style.height = 'auto';
    textArea.style.height = textArea.scrollHeight + 'px';
  }
}

export default AutoResizeTextArea;
