import { useEffect, useRef, useState } from 'react';
import styles from './Modal.module.css';
import PropTypes from 'prop-types';

const Modal = ({
  isOpen,
  onClose,
  children,
  closeOnOverlayClick,
  className,
}) => {
  const showHideClassName = isOpen ? styles.open : '';
  const modalOverlayRef = useRef(null);

  useEffect(() => {
    function handleOverlayClick(e) {
      if (e.target === modalOverlayRef.current) {
        onClose();
      }
    }

    if (closeOnOverlayClick) {
      document.addEventListener('click', handleOverlayClick);
    }

    return () => {
      if (closeOnOverlayClick) {
        document.removeEventListener('click', handleOverlayClick);
      }
    };
  }, [closeOnOverlayClick, isOpen, onClose]);

  function handleClose() {
    onClose && onClose();
  }

  return (
    <div
      ref={modalOverlayRef}
      className={`${styles.modal} ${showHideClassName} ${className ?? ''}`}
    >
      <div className={styles.modalContent}>
        <div className={styles.closeButtonContainer}>
          <button className={styles.closeButton} onClick={handleClose}>
            &times;
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

Modal.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  children: PropTypes.node,
  closeOnOverlayClick: PropTypes.bool,
};

export default Modal;
