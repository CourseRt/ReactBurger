import React, { useMemo } from 'react';
import { ConstructorElement, Button, CurrencyIcon, DragIcon } from '@ya.praktikum/react-developer-burger-ui-components';
import styles from './burger-constructor.module.css';
import { useAppDispatch, useAppSelector } from '../../services/hooks';
import { postOrder } from '../../services/orderSlice';
import { addIngredient, clearConstructor, removeIngredient } from '../../services/constructorSlice';
import { useDrop } from 'react-dnd';
import { ConstructorIngredient } from './constructor-ingredient';
import { useLocation, useNavigate } from 'react-router-dom';
import { TIngredient } from '../../utils/types';

{/*Проверка типизации, чтоб не создавать prop-types в конце файла
   интерфейс будет контролировать данные, приходящие в компонент(9 пункт курсовой)*/}
interface IBurgerConstructorProps {
  onOrderClick: () => void;
}

const BurgerConstructor: React.FC<IBurgerConstructorProps> = ({ onOrderClick }) => {
  const dispatch = useAppDispatch();
  const { bun, ingredients } = useAppSelector((state) => state.burgerConstructor);
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAppSelector((state) => state.user.user);

  const [{ isHover }, dropTarget] = useDrop<TIngredient, void, { isHover: boolean }>({
    accept: 'ingredient',
    drop(item) {
      dispatch(addIngredient(item));
    },
    collect: (monitor) => ({
      isHover: monitor.isOver(),
    }),
  });

const handleOrderSubmit = () => {
  if (!bun) return;
  if (!user) {
    navigate('/login', { state: { from: location } });
    return;
  }
  const orderIds = [bun._id, ...ingredients.map(item => item._id), bun._id];

  dispatch(postOrder(orderIds))
    .unwrap()
    .then(() => {
      dispatch(clearConstructor());
      onOrderClick();
    })
    .catch((error) => {
      console.error("Ошибка при оформлении заказа:", error);
    });
};

  const totalPrice = useMemo(() => {
    const bunPrice = bun ? bun.price * 2 : 0;
    const ingredientsPrice = ingredients.reduce((acc, item) => acc + item.price, 0);
    return bunPrice + ingredientsPrice;
  }, [bun, ingredients]);

  const borderStyle = isHover ? '2px solid #4C4CFF' : '2px solid transparent';

  return (
    <section 
      ref={(node) => { dropTarget(node); }}
      className={`${styles.constructor} mt-25`}
      style={{ border: borderStyle, borderRadius: '40px', transition: '0.3s' }}
    >
      <div className={styles.elementsContainer}>
        {bun ? (
          <div className="ml-8 mb-4">
            <ConstructorElement
              type="top"
              isLocked={true}
              text={`${bun.name} (верх)`}
              price={bun.price}
              thumbnail={bun.image}
            />
          </div>
        ) : (
          <div className="ml-8 mb-4">
            <p className="text text_type_main-medium">Перетащите сюда булку</p>
          </div>
        )}

        <ul className={`${styles.scrollArea} custom-scroll`}>
          {ingredients.length > 0 ? (
            ingredients.map((item, index) => (
              <ConstructorIngredient 
                key={item.key} 
                item={item} 
                index={index} 
              />
            ))
          ) : (
            <p className="text text_type_main-default ml-8">Добавьте начинку</p>
          )}
        </ul>

        {bun && (
          <div className="ml-8 mt-4">
            <ConstructorElement
              type="bottom"
              isLocked={true}
              text={`${bun.name} (низ)`}
              price={bun.price}
              thumbnail={bun.image}
            />
          </div>
        )}
      </div>

      <div className={`${styles.footer} mt-10 mr-4`}>
        <div className={`${styles.total} mr-10`}>
          <span className="text text_type_digits-medium">{totalPrice}</span>
          <CurrencyIcon type="primary" />
        </div>
        <Button 
          htmlType="button" 
          type="primary" 
          size="large" 
          onClick={handleOrderSubmit}
          disabled={!bun}
        >
          Оформить заказ
        </Button>
      </div>
    </section>
  );
};

export default BurgerConstructor;
