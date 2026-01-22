import React, { useEffect, ReactNode } from 'react';
import { CloseIcon } from '@ya.praktikum/react-developer-burger-ui-components';
import ModalOverlay from '../modal-overlay/modal-overlay';
import styles from './modal.module.css';

interface IModalProps {
  title?: string;
  onClose: () => void;
  children: ReactNode;
}

const Modal: React.FC<IModalProps> = ({ title, onClose, children }) => {
  
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <div className={styles.modal_wrapper}>
      <ModalOverlay onClick={onClose} />
      <div className={styles.modal_container}>
        <div className={`${styles.header} mt-10 ml-10 mr-10`}>
          <h3 className="text text_type_main-large">{title}</h3>
          <button className={styles.close_button} onClick={onClose}>
            <CloseIcon type="primary" />
          </button>
        </div>
        <div className={styles.content}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
