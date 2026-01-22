import React, { useMemo } from 'react';
import { ConstructorElement, Button, CurrencyIcon, DragIcon } from '@ya.praktikum/react-developer-burger-ui-components';
import styles from './burger-constructor.module.css';
import { IIngredient } from '../../App';

interface IBurgerConstructorProps {
  data: IIngredient[];
  onOrderClick: () => void;
}

const BurgerConstructor: React.FC<IBurgerConstructorProps> = ({ data, onOrderClick }) => {
  const bun = useMemo(() => data.find((item) => item.type === 'bun'), [data]);
  const ingredients = useMemo(() => data.filter((item) => item.type !== 'bun'), [data]);

  const totalPrice = useMemo(() => {
    const bunPrice = bun ? bun.price * 2 : 0;
    const ingredientsPrice = ingredients.reduce((acc, item) => acc + item.price, 0);
    return bunPrice + ingredientsPrice;
  }, [bun, ingredients]);

  return (
    <section className={`${styles.constructor} mt-25`}>
      <div className={styles.elementsContainer}>
        {bun && (
          <div className="ml-8 mb-4">
            <ConstructorElement
              type="top"
              isLocked={true}
              text={`${bun.name} (верх)`}
              price={bun.price}
              thumbnail={bun.image}
            />
          </div>
        )}

        <ul className={`${styles.scrollArea} custom-scroll`}>
          {ingredients.map((item) => (
            <li key={item._id} className={`${styles.listItem} mb-4`}>
              <DragIcon type="primary" />
              <ConstructorElement
                text={item.name}
                price={item.price}
                thumbnail={item.image}
              />
            </li>
          ))}
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
          onClick={onOrderClick}
        >
          Оформить заказ
        </Button>
      </div>
    </section>
  );
};

export default BurgerConstructor;
