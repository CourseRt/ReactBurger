import React from 'react';
import styles from './order-details.module.css';
import doneImage from '../../images/done.png';
import { useAppSelector } from '../../services/hooks';
import { RootState } from '../../services/store';

const OrderDetails = () => {
   const { orderNumber, isLoading, hasError } = useAppSelector((state) => state.order);

    if (isLoading) {
    return (
      <div className={styles.container}>
        <p className="text text_type_main-medium mt-30 mb-30">
          Оформление заказа...
        </p>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className={styles.container}>
        <p className="text text_type_main-medium mt-30 mb-30 text_color_error">
          Ошибка при оформлении заказа. Попробуйте еще раз.
        </p>
      </div>
    );
  }

  return (
    <div className={`${styles.container} pb-30`}>
      <h2 className="text text_type_digits-large mt-30 mb-8">{orderNumber}</h2>
      <p className="text text_type_main-medium mb-15">идентификатор заказа</p>
      
      <img src={doneImage} alt="Заказ принят" className="mb-15" />
      
      <p className="text text_type_main-default mb-2">Ваш заказ начали готовить</p>
      <p className="text text_type_main-default text_color_inactive">
        Дождитесь готовности на орбитальной станции
      </p>
    </div>
  );
};

export default OrderDetails;
