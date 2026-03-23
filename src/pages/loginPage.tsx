import React, { useState, FormEvent } from 'react';
import { EmailInput, PasswordInput, Button } from '@ya.praktikum/react-developer-burger-ui-components';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../services/hooks';
import { loginUser } from '../services/userSlice';
import styles from './styles/login.module.css';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isLoading, error } = useAppSelector((state) => state.user);
  const location = useLocation();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    dispatch(loginUser({ email, password }))
      .unwrap()
      .then(() => {
        const from = location.state?.from || { pathname: '/' };
        navigate(from, { replace: true });
      })
      .catch((err) => {
        console.error("Login error:", err);
      });
  };

  return (
    <div className={styles.wrapper}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h1 className="text text_type_main-medium mb-6">Вход</h1>
        <div className="mb-6">
          <EmailInput 
            onChange={e => setEmail(e.target.value)} 
            value={email} 
            name={'email'} 
          />
        </div>
        <div className="mb-6">
          <PasswordInput 
            onChange={e => setPassword(e.target.value)} 
            value={password} 
            name={'password'} 
          />
        </div>
        {error && (
          <p className="text text_type_main-default mb-4" style={{ color: '#e52b1a' }}>
            {error}
          </p>
        )}

        <div className="mb-20">
          <Button 
            htmlType="submit" 
            type="primary" 
            size="large"
            disabled={isLoading}
          >
            {isLoading ? 'Вход...' : 'Войти'}
          </Button>
        </div>
        
        <p className="text text_type_main-default text_color_inactive mb-4">
          Вы — новый пользователь? <Link to="/register" className={styles.link}>Зарегистрироваться</Link>
        </p>
        <p className="text text_type_main-default text_color_inactive">
          Забыли пароль? <Link to="/forgot-password" className={styles.link}>Восстановить пароль</Link>
        </p>
      </form>
    </div>
  );
};
