import React, { useState, FormEvent } from 'react';
import { Input, EmailInput, PasswordInput, Button } from '@ya.praktikum/react-developer-burger-ui-components';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { registerUser } from '../services/userSlice';
import { AppDispatch } from '../services/store';
import styles from './styles/login.module.css';

export const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    dispatch(registerUser({ name, email, password }))
      .unwrap()
      .then(() => navigate('/'))
      .catch((err) => alert(err || 'Ошибка регистрации'));
  };

  return (
    <div className={styles.wrapper}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h1 className="text text_type_main-medium mb-6">Регистрация</h1>
        <div className="mb-6">
          {/* @ts-ignore */}
          <Input type="text" placeholder="Имя" onChange={e => setName(e.target.value)} value={name} name="name" />
        </div>
        <div className="mb-6">
          <EmailInput onChange={e => setEmail(e.target.value)} value={email} name="email" />
        </div>
        <div className="mb-6">
          <PasswordInput onChange={e => setPassword(e.target.value)} value={password} name="password" />
        </div>
        <div className="mb-20">
          <Button htmlType="submit" type="primary" size="large">Зарегистрироваться</Button>
        </div>
        <p className="text text_type_main-default text_color_inactive">
          Уже зарегистрированы? <Link to="/login" className={styles.link}>Войти</Link>
        </p>
      </form>
    </div>
  );
};
