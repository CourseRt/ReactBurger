import React, { useState, FormEvent } from 'react';
import { PasswordInput, Input, Button } from '@ya.praktikum/react-developer-burger-ui-components';
import { Link, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { BASE_URL } from '../utils/constants';
import styles from './styles/login.module.css';

export const ResetPasswordPage = () => {
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  if (!location.state?.fromForgotPassword) {
    return <Navigate to="/forgot-password" replace />;
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    fetch(`${BASE_URL}/password-reset/reset`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password, token })
    })
      .then(res => res.ok ? res.json() : Promise.reject(res))
      .then(json => {
        if (json.success) {
          alert('Пароль изменен!');
          navigate('/login');
        }
      })
      .catch(() => alert('Ошибка при сбросе пароля'));
  };

  return (
    <div className={styles.wrapper}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h1 className="text text_type_main-medium mb-6">Восстановление пароля</h1>
        <div className="mb-6">
          <PasswordInput onChange={e => setPassword(e.target.value)} value={password} name="password" placeholder="Введите новый пароль" />
        </div>
        <div className="mb-6">
          {/* @ts-ignore */}
          <Input type="text" placeholder="Введите код из письма" onChange={e => setToken(e.target.value)} value={token} name="token" />
        </div>
        <div className="mb-20">
          <Button htmlType="submit" type="primary" size="large">Сохранить</Button>
        </div>
        <p className="text text_type_main-default text_color_inactive">
          Вспомнили пароль? <Link to="/login" className={styles.link}>Войти</Link>
        </p>
      </form>
    </div>
  );
};
