import React from 'react';
import styles from './modal-overlay.module.css';

interface IOverlayProps {
  onClick: () => void;
}

const ModalOverlay: React.FC<IOverlayProps> = ({ onClick }) => {
  return (
    <div className={styles.overlay} onClick={onClick} />
  );
};

export default ModalOverlay;