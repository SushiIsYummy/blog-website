import { useRef } from 'react';
import styles from './Modal.module.css';
import PropTypes from 'prop-types';

function Modal({
  isOpen,
  onClose,
  children,
  closeOnOverlayClick = false,
  className,
  includeCloseIcon = true,
}) {
  const showHideClassName = isOpen ? styles.open : '';
  const modalOverlayRef = useRef(null);
  const overlayClicked = useRef(false);

  function handleClose() {
    onClose && onClose();
  }

  function handleOverlayMouseDown(e) {
    if (e.target === modalOverlayRef.current) {
      overlayClicked.current = true;
    }
  }

  function handleOverlayMouseUp(e) {
    if (e.target === modalOverlayRef.current && overlayClicked.current) {
      handleClose();
    }
    overlayClicked.current = false;
  }

  return (
    <div
      ref={modalOverlayRef}
      className={`${styles.modalOverlay} ${showHideClassName} ${className ?? ''}`}
      onMouseDown={closeOnOverlayClick ? handleOverlayMouseDown : undefined}
      onMouseUp={closeOnOverlayClick ? handleOverlayMouseUp : undefined}
    >
      <div className={styles.modalContent}>
        {includeCloseIcon && (
          <div className={styles.closeButtonContainer}>
            <button className={styles.closeButton} onClick={handleClose}>
              &times;
            </button>
          </div>
        )}
        {children}
      </div>
    </div>
  );
}

Modal.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  children: PropTypes.node,
  closeOnOverlayClick: PropTypes.bool,
  includeCloseIcon: PropTypes.bool,
};

export default Modal;
