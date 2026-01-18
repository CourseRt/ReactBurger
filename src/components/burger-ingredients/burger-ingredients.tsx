import React, { useState, useMemo } from 'react';
import { Tab, Counter, CurrencyIcon } from '@ya.praktikum/react-developer-burger-ui-components';
import styles from './burger-ingredients.module.css';
import { IIngredient } from '../../App';

interface IBurgerIngredientsProps {
  data: IIngredient[];
  onIngredientClick: (ingredient: IIngredient) => void;
}

const BurgerIngredients: React.FC<IBurgerIngredientsProps> = ({ data, onIngredientClick }) => {
  const [current, setCurrent] = useState<string>('bun');
  const buns = useMemo(() => data.filter((item) => item.type === 'bun'), [data]);
  const sauces = useMemo(() => data.filter((item) => item.type === 'sauce'), [data]);
  const mains = useMemo(() => data.filter((item) => item.type === 'main'), [data]);

  return (
    <section className={styles.ingredients}>
      <h1 className="text text_type_main-large mt-10 mb-5">Соберите бургер</h1>
      
      <div className={styles.tabs}>
        <Tab value="bun" active={current === 'bun'} onClick={setCurrent}>Булки</Tab>
        <Tab value="sauce" active={current === 'sauce'} onClick={setCurrent}>Соусы</Tab>
        <Tab value="main" active={current === 'main'} onClick={setCurrent}>Начинки</Tab>
      </div>

      <div className={`${styles.scrollArea} custom-scroll mt-10`}>
        <IngredientSection title="Булки" items={buns} onIngredientClick={onIngredientClick} />
        <IngredientSection title="Соусы" items={sauces} onIngredientClick={onIngredientClick} />
        <IngredientSection title="Начинки" items={mains} onIngredientClick={onIngredientClick} />
      </div>
    </section>
  );
};

interface ISectionProps {
  title: string;
  items: IIngredient[];
  onIngredientClick: (ingredient: IIngredient) => void;
}

const IngredientSection: React.FC<ISectionProps> = ({ title, items, onIngredientClick }) => (
  <div className="mb-10">
    <h2 className="text text_type_main-medium mb-6">{title}</h2>
    <ul className={styles.grid}>
      {items.map((item) => (
        <li 
          key={item._id} 
          className={styles.card} 
          onClick={() => onIngredientClick(item)}
        >
          <Counter count={1} size="default" />
          <img src={item.image} alt={item.name} className="ml-4 mr-4" />
          <div className={`${styles.price} mt-1 mb-1`}>
            <span className="text text_type_digits-default">{item.price}</span>
            <CurrencyIcon type="primary" />
          </div>
          <p className={`${styles.name} text text_type_main-default`}>{item.name}</p>
        </li>
      ))}
    </ul>
  </div>
);

export default BurgerIngredients;
