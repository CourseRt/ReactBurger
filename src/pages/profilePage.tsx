import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import { useAppSelector, useAppDispatch } from '../services/hooks';
import { NavLink, useNavigate, Outlet, useLocation } from 'react-router-dom';
import { Input, EmailInput, PasswordInput, Button } from '@ya.praktikum/react-developer-burger-ui-components';
import { updateUser, logoutUser } from '../services/userSlice';
import styles from './styles/profile.module.css';

interface IFormState {
  name: string;
  email: string;
  password: string;
}

export const ProfilePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  
  const { user } = useAppSelector((state) => state.user);

  const [formValue, setFormValue] = useState<IFormState>({
    name: '',
    email: '',
    password: ''
  });

  const isFormChanged = 
    formValue.name !== (user?.name || '') || 
    formValue.email !== (user?.email || '') || 
    formValue.password !== '';

  useEffect(() => {
    if (user) {
      setFormValue({
        name: user.name || '',
        email: user.email || '',
        password: ''
      });
    }
  }, [user]);

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormValue({ ...formValue, [e.target.name]: e.target.value });
  };

  const onCancel = () => {
    if (user) {
      setFormValue({
        name: user.name || '',
        email: user.email || '',
        password: ''
      });
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    dispatch(updateUser(formValue));
  };

  const handleLogout = () => {
    dispatch(logoutUser())
      .unwrap()
      .then(() => {
        navigate('/login', { replace: true });
      })
      .catch((err: unknown) => alert(err || 'Ошибка при выходе'));
  };

  const isProfileRoot = pathname === '/profile';

  return (
    <div className={styles.wrapper}>
      <nav className={styles.menu}>
        <NavLink 
          to="/profile" 
          end 
          className={({ isActive }) => isActive ? styles.linkActive : styles.link}
        >
          <span className="text text_type_main-medium">Профиль</span>
        </NavLink>
        
        <NavLink 
          to="/profile/orders" 
          className={({ isActive }) => (isActive || pathname.includes('/profile/orders')) ? styles.linkActive : styles.link}
        >
          <span className="text text_type_main-medium">История заказов</span>
        </NavLink>
        
        <button 
          className={styles.buttonExit} 
          type="button" 
          onClick={handleLogout}
        >
          <span className="text text_type_main-medium">Выход</span>
        </button>
        
        <p className={`${styles.caption} text text_type_main-default mt-20`}>
          {isProfileRoot 
            ? 'В этом разделе вы можете изменить свои персональные данные'
            : 'В этом разделе вы можете просмотреть свою историю заказов'}
        </p>
      </nav>

      {isProfileRoot ? (
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className="mb-6">
            {/*@ts-ignore */}
            <Input
              type={'text'}
              placeholder={'Имя'}
              onChange={onChange}
              value={formValue.name}
              name={'name'}
              icon={'EditIcon'}
              errorText={'Ошибка'}
            />
          </div>
          <div className="mb-6">
            <EmailInput
              onChange={onChange}
              value={formValue.email}
              name={'email'}
              placeholder="Логин"
              isIcon={true}
            />
          </div>
          <div className="mb-6">
            <PasswordInput
              onChange={onChange}
              value={formValue.password}
              name={'password'}
              icon={'EditIcon'}
            />
          </div>

          {isFormChanged && (
            <div className={styles.buttons}>
              <Button htmlType="button" type="secondary" size="medium" onClick={onCancel}>
                Отмена
              </Button>
              <Button htmlType="submit" type="primary" size="medium">
                Сохранить
              </Button>
            </div>
          )}
        </form>
      ) : (
        <Outlet />
      )}
    </div>
  );
};
