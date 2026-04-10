import React, { useMemo } from 'react';
import styles from './orderCard.module.css';
import { CurrencyIcon, FormattedDate } from '@ya.praktikum/react-developer-burger-ui-components';

interface TIngredient {
  _id: string;
  name: string;
  price: number;
  image_mobile: string;
  [key: string]: any;
}

interface IOrderCardProps {
  order: {
    number: number;
    name: string;
    ingredients: string[];
    createdAt: string;
    status: string;
  };
  allIngredients: TIngredient[];
  isHistory?: boolean;
}

export const OrderCard: React.FC<IOrderCardProps> = ({ order, allIngredients, isHistory }) => {
const orderIngredients = useMemo(() => {
  return order.ingredients
    .map((id) => {
      return allIngredients.find(
        (item) => item._id.toLowerCase().trim() === id.toLowerCase().trim()
      );
    })
    .filter((item): item is TIngredient => !!item);
}, [order.ingredients, allIngredients]);

  const totalPrice = useMemo(() => {
    return orderIngredients.reduce((acc, item) => acc + (item.price || 0), 0);
  }, [orderIngredients]);

  const maxDisplayed = 6;
  const iconsToShow = orderIngredients.slice(0, maxDisplayed);
  const remainedCount = orderIngredients.length - maxDisplayed;

  const getStatusText = (status: string) => {
    if (status === 'done') return 'Выполнен';
    if (status === 'pending') return 'Готовится';
    if (status === 'created') return 'Создан';
    return status;
  };

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <span className="text text_type_digits-default">#{order.number}</span>
        <span className="text text_type_main-default text_color_inactive">
          <FormattedDate date={new Date(order.createdAt)} />
        </span>
      </div>

      <h2 className={`${styles.title} text text_type_main-medium mt-6`}>
        {order.name}
      </h2>

      {isHistory && (
        <p className={`text text_type_main-default mt-2 ${order.status === 'done' ? styles.statusDone : ''}`}>
          {getStatusText(order.status)}
        </p>
      )}

      <div className={`${styles.footer} mt-6`}>
        <ul className={styles.ingredients}>
          {iconsToShow.map((ing, index) => (
            <li 
              key={index} 
              className={styles.ingredientWrapper} 
              style={{ zIndex: maxDisplayed - index }}
            >
              <img className={styles.image} src={ing.image_mobile} alt={ing.name} />
              
              {index === maxDisplayed - 1 && remainedCount > 0 && (
                <span className={`${styles.remained} text text_type_digits-default`}>
                  +{remainedCount}
                </span>
              )}
            </li>
          ))}
        </ul>
        
        <div className={styles.price}>
          <span className="text text_type_digits-default mr-2">{totalPrice}</span>
          <CurrencyIcon type="primary" />
        </div>
      </div>
    </div>
  );
};
