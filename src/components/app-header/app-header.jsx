import React from 'react';
import { Logo, BurgerIcon, ListIcon, ProfileIcon } from '@ya.praktikum/react-developer-burger-ui-components';
import styles from './app-header.module.css';

const AppHeader = () => {
  return (
    <header className={`${styles.header} pt-4 pb-4`}>
      <nav className={styles.container}>
        <div className={styles.navGroup}>
          <a href="#" className={`${styles.link} pl-5 pr-5 pt-4 pb-4`}>
            <BurgerIcon type="primary" />
            <span className="text text_type_main-default ml-2">Конструктор</span>
          </a>
          <a href="#" className={`${styles.link} ${styles.link_secondary} pl-5 pr-5 pt-4 pb-4`}>
            <ListIcon type="secondary" />
            <span className="text text_type_main-default ml-2">Лента заказов</span>
          </a>
        </div>

        <div className={styles.logo}>
          <Logo />
        </div>

        <div className={styles.loginBlock}>
          <a href="#" className={`${styles.link} ${styles.link_secondary} pl-5 pr-5 pt-4 pb-4`}>
            <ProfileIcon type="secondary" />
            <span className="text text_type_main-default ml-2">Личный кабинет</span>
          </a>
        </div>
      </nav>
    </header>
  );
};

export default AppHeader;
