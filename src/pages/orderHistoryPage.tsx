import React, { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../services/hooks';
import { OrderCard } from '../components/order-card/orderCard';
import { wsConnect, wsDisconnect } from '../services/profileOrdersSlice'; 
import { getCookie } from '../utils/cookie';
import styles from './styles/orderHistoryPage.module.css';
import { Link, useLocation } from 'react-router-dom';

export const OrderHistoryPage: React.FC = () => {
  const location = useLocation();
  const dispatch = useAppDispatch();

  const allIngredients = useAppSelector((state) => state.ingredients.items);
  const { orders } = useAppSelector((state) => state.profileOrders); 

  useEffect(() => {
    const token = getCookie('accessToken');
    const cleanToken = token?.replace('Bearer ', '');
    
    if (cleanToken) {
      dispatch(wsConnect(`wss://new-stellarburgers.education-services.ru/orders?token=${cleanToken}`));
    }

    return () => {
      dispatch(wsDisconnect());
    };
  }, [dispatch]);

  const reversedOrders = [...orders].reverse();

  if (orders.length === 0) {
    return (
      <div className={styles.container}>
        <p className="text text_type_main-medium mt-20">У вас пока нет заказов</p>
      </div>
    );
  }

  return (
    <section className={`${styles.container} custom-scroll`}>
      {reversedOrders.map((order) => (
        <Link
          key={order._id}
          to={`/profile/orders/${order.number}`}
          state={{ background: location }}
          style={{ textDecoration: 'none', color: 'inherit' }}
        >
          <OrderCard 
            order={order} 
            allIngredients={allIngredients} 
            isHistory={true} 
          />
        </Link>
      ))}
    </section>
  );
};
