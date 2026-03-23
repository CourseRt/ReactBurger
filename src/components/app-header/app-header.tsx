import React from 'react';
import { Logo, BurgerIcon, ListIcon, ProfileIcon } from '@ya.praktikum/react-developer-burger-ui-components';
import styles from './app-header.module.css';
import { NavLink } from 'react-router-dom';

const AppHeader = () => {
  return (
    <header className={`${styles.header} pt-4 pb-4`}>
      <nav className={styles.container}>
        <div className={styles.navGroup}>
          <NavLink 
            to="/" 
            className={({ isActive }) => 
              `${styles.link} ${!isActive ? styles.link_secondary : ''} pl-5 pr-5 pt-4 pb-4`}
          >
            {({ isActive }) => (
              <>
                <BurgerIcon type={isActive ? 'primary' : 'secondary'} />
                <span className="text text_type_main-default ml-2">Конструктор</span>
              </>
            )}
          </NavLink>

          <NavLink 
            to="/feed" 
            className={({ isActive }) => 
              `${styles.link} ${!isActive ? styles.link_secondary : ''} pl-5 pr-5 pt-4 pb-4`}
          >
            {({ isActive }) => (
              <>
                <ListIcon type={isActive ? 'primary' : 'secondary'} />
                <span className="text text_type_main-default ml-2">Лента заказов</span>
              </>
            )}
          </NavLink>
        </div>

        <div className={styles.logo}>
          <Logo />
        </div>

        <div className={styles.loginBlock}>
          <NavLink 
            to="/profile" 
            className={({ isActive }) => 
              `${styles.link} ${!isActive ? styles.link_secondary : ''} pl-5 pr-5 pt-4 pb-4`}
          >
            {({ isActive }) => (
              <>
                <ProfileIcon type={isActive ? 'primary' : 'secondary'} />
                <span className="text text_type_main-default ml-2">Личный кабинет</span>
              </>
            )}
          </NavLink>
        </div>
      </nav>
    </header>
  );
};

export default AppHeader;
