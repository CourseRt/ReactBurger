import React, { useState, useMemo, useRef } from 'react';
import { Tab, Counter, CurrencyIcon } from '@ya.praktikum/react-developer-burger-ui-components';
import { useDrag } from 'react-dnd';
import { useDispatch, useSelector } from 'react-redux';
import styles from './burger-ingredients.module.css';
import { IIngredient } from '../../App';
import { setIngredientDetails } from '../../services/ingredientDetailsSlice';
import { RootState } from '../../services/store';
import { Link, useLocation } from 'react-router-dom';

const DraggableIngredient: React.FC<{ 
  item: IIngredient; 
  count: number;
}> = ({ item, count }) => {
  const [{ isDragging }, dragRef] = useDrag({
    type: 'ingredient',
    item: item,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <li 
      ref={(node) => { dragRef(node); }}
      className={styles.card} 
      style={{ opacity: isDragging ? 0.4 : 1, cursor: 'grab' }}
    >
      {count > 0 && <Counter count={count} size="default" />}
      
      <img src={item.image} alt={item.name} className="ml-4 mr-4" draggable={false} />
      <div className={`${styles.price} mt-1 mb-1`}>
        <span className="text text_type_digits-default">{item.price}</span>
        <CurrencyIcon type="primary" />
      </div>
      <p className={`${styles.name} text text_type_main-default`}>{item.name}</p>
    </li>
  );
};

interface IBurgerIngredientsProps {
  onIngredientClick: (ingredient: IIngredient) => void;
}

const BurgerIngredients: React.FC<IBurgerIngredientsProps> = ({ onIngredientClick }) => {
  const dispatch = useDispatch();
  const [current, setCurrent] = useState<string>('bun');
  const { items } = useSelector((state: RootState) => state.ingredients);
  const { bun, ingredients: constructorIngredients } = useSelector((state: RootState) => state.burgerConstructor);

  const containerRef = useRef<HTMLDivElement>(null);
  const bunRef = useRef<HTMLHeadingElement>(null);
  const sauceRef = useRef<HTMLHeadingElement>(null);
  const mainRef = useRef<HTMLHeadingElement>(null);

  const buns = useMemo(() => items.filter((item) => item.type === 'bun'), [items]);
  const sauces = useMemo(() => items.filter((item) => item.type === 'sauce'), [items]);
  const mains = useMemo(() => items.filter((item) => item.type === 'main'), [items]);

  const getIngredientCount = (ingredient: IIngredient) => {
    if (ingredient.type === 'bun') {
      return bun?._id === ingredient._id ? 2 : 0;
    }
    return constructorIngredients.filter(item => item._id === ingredient._id).length;
  };

  const handleScroll = () => {
    if (!containerRef.current || !bunRef.current || !sauceRef.current || !mainRef.current) return;
    const containerTop = containerRef.current.getBoundingClientRect().top;
    const bunDelta = Math.abs(containerTop - bunRef.current.getBoundingClientRect().top);
    const sauceDelta = Math.abs(containerTop - sauceRef.current.getBoundingClientRect().top);
    const mainDelta = Math.abs(containerTop - mainRef.current.getBoundingClientRect().top);

    if (bunDelta < sauceDelta && bunDelta < mainDelta) setCurrent('bun');
    else if (sauceDelta < bunDelta && sauceDelta < mainDelta) setCurrent('sauce');
    else setCurrent('main');
  };

  const handleIngredientClick = (ingredient: IIngredient) => {
    dispatch(setIngredientDetails(ingredient));
    onIngredientClick(ingredient);
  };

  const location = useLocation();

 return (
  <section className={styles.ingredients}>
    <h1 className="text text_type_main-large mt-10 mb-5">Соберите бургер</h1>
    
    <div className={styles.tabs} style={{ display: 'flex' }}>
      <Tab value="bun" active={current === 'bun'} onClick={() => setCurrent('bun')}>Булки</Tab>
      <Tab value="sauce" active={current === 'sauce'} onClick={() => setCurrent('sauce')}>Соусы</Tab>
      <Tab value="main" active={current === 'main'} onClick={() => setCurrent('main')}>Начинки</Tab>
    </div>

    <div 
      className={`${styles.scrollArea} custom-scroll mt-10`} 
      ref={containerRef} 
      onScroll={handleScroll}
    >
      <h2 ref={bunRef} className="text text_type_main-medium mb-6">Булки</h2>
      <ul className={styles.grid}>
        {buns.map(item => (
          <Link
            key={item._id}
            to={`/ingredients/${item._id}`}
            state={{ background: location }}
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <DraggableIngredient 
              item={item} 
              count={getIngredientCount(item)} 
            />
          </Link>
        ))}
      </ul>
      
      <h2 ref={sauceRef} className="text text_type_main-medium mb-6 mt-10">Соусы</h2>
      <ul className={styles.grid}>
        {sauces.map(item => (
          <Link
            key={item._id}
            to={`/ingredients/${item._id}`}
            state={{ background: location }}
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <DraggableIngredient 
              item={item} 
              count={getIngredientCount(item)} 
            />
          </Link>
        ))}
      </ul>
      
      <h2 ref={mainRef} className="text text_type_main-medium mb-6 mt-10">Начинки</h2>
      <ul className={styles.grid}>
        {mains.map(item => (
          <Link
            key={item._id}
            to={`/ingredients/${item._id}`}
            state={{ background: location }}
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <DraggableIngredient 
              item={item} 
              count={getIngredientCount(item)} 
            />
          </Link>
        ))}
      </ul>
    </div>
  </section>
);

};

export default BurgerIngredients;
