import React, { useState, FormEvent, ChangeEvent } from 'react';
import { EmailInput, Button } from '@ya.praktikum/react-developer-burger-ui-components';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../services/store';
import styles from './styles/login.module.css';
import { BASE_URL, checkResponse } from '../utils/constants';

export const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();
  
  const { user, isAuthChecked } = useSelector((state: RootState) => state.user);

  if (!isAuthChecked) return null;
  if (user) {
    return <Navigate to="/" replace />;
  }

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    fetch(`${BASE_URL}/password-reset`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    })
      .then(checkResponse)
      .then(json => {
        if (json.success) {
          navigate('/reset-password', { state: { fromForgotPassword: true } });
        } else {
          alert('Ошибка при восстановлении пароля');
        }
      })
      .catch(err => console.error('Ошибка:', err));
  };

  return (
    <div className={styles.wrapper}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h1 className="text text_type_main-medium mb-6">Восстановление пароля</h1>
        
        <div className="mb-6">
          <EmailInput
            onChange={onChange}
            value={email}
            name={'email'}
            placeholder="Укажите e-mail"
            isIcon={false}
          />
        </div>

        <div className="mb-20">
          <Button htmlType="submit" type="primary" size="large">
            Восстановить
          </Button>
        </div>

        <p className="text text_type_main-default text_color_inactive">
          Вспомнили пароль? <Link to="/login" className={styles.link}>Войти</Link>
        </p>
      </form>
    </div>
  );
};
