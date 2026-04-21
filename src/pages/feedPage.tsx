import React, { useEffect, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../services/hooks';
import { wsConnect, wsDisconnect } from '../services/feedSlice';
import { OrderCard } from '../components/order-card/orderCard';
import styles from './styles/feedPage.module.css';
import { Link, useLocation } from 'react-router-dom';

export const FeedPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();

  const { orders, total, totalToday } = useAppSelector((state) => state.feed);
  const allIngredients = useAppSelector((state) => state.ingredients.items);

  useEffect(() => {
    dispatch(wsConnect('wss://new-stellarburgers.education-services.ru/orders/all'));
    
    return () => {
      dispatch(wsDisconnect());
    };
  }, [dispatch]);

  const doneOrders = useMemo(() => 
    orders.filter(o => o.status === 'done').slice(0, 20), 
  [orders]);

  const pendingOrders = useMemo(() => 
    orders.filter(o => o.status === 'pending').slice(0, 20), 
  [orders]);

  const renderStatusBoard = (ordersList: typeof orders, isSuccess: boolean = false) => {
    const firstColumn = ordersList.slice(0, 10);
    const secondColumn = ordersList.slice(10, 20);

    return (
      <div className={styles.statusColumns}>
        <ul className={styles.orderList}>
          {firstColumn.map(o => (
            <li 
              key={o._id} 
              className={`text text_type_digits-default mb-2 ${isSuccess ? 'text_color_success' : ''}`}
            >
              {o.number}
            </li>
          ))}
        </ul>
        {secondColumn.length > 0 && (
          <ul className={styles.orderList}>
            {secondColumn.map(o => (
              <li 
                key={o._id} 
                className={`text text_type_digits-default mb-2 ${isSuccess ? 'text_color_success' : ''}`}
              >
                {o.number}
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  };

  return (
    <main className={styles.container}>
      <h1 className="text text_type_main-large mt-10 mb-5">Лента заказов</h1>
      
      <div className={styles.content}>
        <section className={`${styles.ordersList} custom-scroll`}>
          {orders.map((order) => (
            <Link
              key={order._id}
              to={`/feed/${order.number}`}
              state={{ background: location }}
              className={styles.link}
            >
              <OrderCard 
                order={order} 
                allIngredients={allIngredients} 
              />
            </Link>
          ))}
        </section>

        <section className={styles.stats}>
          <div className={styles.board}>
            <div className={styles.column}>
              <h3 className="text text_type_main-medium mb-6">Готовы:</h3>
              {renderStatusBoard(doneOrders, true)}
            </div>

            <div className={styles.column}>
              <h3 className="text text_type_main-medium mb-6">В работе:</h3>
              {renderStatusBoard(pendingOrders)}
            </div>
          </div>

          <div className="mt-15">
            <h3 className="text text_type_main-medium">Выполнено за все время:</h3>
            <p className={`${styles.digitsShadow} text text_type_digits-large`}>
              {total.toLocaleString()}
            </p>
          </div>

          <div className="mt-15">
            <h3 className="text text_type_main-medium">Выполнено за сегодня:</h3>
            <p className={`${styles.digitsShadow} text text_type_digits-large`}>
              {totalToday.toLocaleString()}
            </p>
          </div>
        </section>
      </div>
    </main>
  );
};
