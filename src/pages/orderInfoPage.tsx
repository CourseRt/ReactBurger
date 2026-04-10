import React, { useEffect, useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { CurrencyIcon, FormattedDate } from '@ya.praktikum/react-developer-burger-ui-components';
import { useAppDispatch, useAppSelector } from '../services/hooks';
import { TIngredient, IOrder } from '../utils/types';
import { getOrderRequest } from '../utils/api'; 
import styles from './styles/orderInfoPage.module.css';
import { wsConnect } from '../services/feedSlice';

interface IOrderResponse {
  success: boolean;
  orders: IOrder[];
}

export const OrderInfoPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  
  const allIngredients = useAppSelector((state) => state.ingredients.items);
  const testIngredients = useAppSelector((state) => state.ingredients.items);  
  const feedOrders = useAppSelector((state) => state.feed.orders);
  const profileOrders = useAppSelector((state) => state.profileOrders?.orders || []);

  const [order, setOrder] = useState<IOrder | null>(null);

useEffect(() => {
  const allOrders = [...feedOrders, ...profileOrders];
  const foundOrder = allOrders.find((o) => String(o.number) === String(id));

  if (foundOrder) {
    setOrder(foundOrder);
  } else {
    dispatch(wsConnect('wss://new-stellarburgers.education-services.ru/orders/all'));
  }
}, [id, feedOrders, profileOrders, dispatch]);




const info = useMemo(() => {
  if (!order || !allIngredients || allIngredients.length === 0) return null;

  type TIngredientWithCount = TIngredient & { count: number };

  const ingredientsWithCount = order.ingredients.reduce<Record<string, TIngredientWithCount>>((acc, ingredientId) => {
    const item = allIngredients.find(
      (ing) => ing._id.toLowerCase().trim() === ingredientId.toLowerCase().trim()
    );
    
    if (item) {
      if (!acc[item._id]) {
        acc[item._id] = { ...item, count: 1 };
      } else {
        acc[item._id].count++;
      }
    }
    return acc;
  }, {});

  const list = Object.values(ingredientsWithCount);
  const total = list.reduce((sum, item) => sum + item.price * item.count, 0);

  return list.length > 0 ? { list, total } : null;
}, [order, allIngredients]);

  if (!order || !info) {
    return (
      <div className={styles.loader}>
        <p className="text text_type_main-medium">Загрузка данных заказа...</p>
      </div>
    );
  }
  
  return (
    <div className={styles.container}>
      <span className={`${styles.number} text text_type_digits-default mb-10`}>
        #{order.number}
      </span>
      
      <h2 className="text text_type_main-medium mb-3">{order.name}</h2>
      
      <span className={`${order.status === 'done' ? styles.statusDone : ''} text text_type_main-default mb-15`}>
        {order.status === 'done' ? 'Выполнен' : order.status === 'pending' ? 'Готовится' : 'Создан'}
      </span>
      
      <p className="text text_type_main-medium mb-6">Состав:</p>
      
      <ul className={`${styles.ingredientsList} custom-scroll`}>
        {info.list.map((item, index) => (
          <li key={index} className={styles.item}>
            <div className={styles.row}>
              <div className={styles.imageWrapper}>
                <img src={item.image_mobile} alt={item.name} className={styles.image} />
              </div>
              <span className="text text_type_main-default ml-4">{item.name}</span>
            </div>
            <div className={styles.priceInfo}>
              <span className="text text_type_digits-default">
                {item.count} x {item.price}
              </span>
              <CurrencyIcon type="primary" />
            </div>
          </li>
        ))}
      </ul>

      <div className={`${styles.footer} mt-10`}>
        <span className="text text_type_main-default text_color_inactive">
          <FormattedDate date={new Date(order.createdAt)} />
        </span>
        <div className={styles.total}>
          <span className="text text_type_digits-default mr-2">{info.total}</span>
          <CurrencyIcon type="primary" />
        </div>
      </div>
    </div>
  );
};
