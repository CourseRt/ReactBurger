import React from 'react';
import { useParams } from 'react-router-dom';
import { useAppSelector } from '../services/hooks';
import IngredientDetails from '../components/ingredient-details/ingredient-details';
import styles from './styles/ingredient-page.module.css';

export const IngredientPage = () => {
  const { id } = useParams<{ id: string }>();
  const ingredients = useAppSelector((state) => state.ingredients.items);
  const ingredientData = ingredients.find(item => item._id === id);

  if (!ingredientData) {
    return null; 
  }

  return (
    <div className={styles.wrapper}>
      <h1 className="text text_type_main-large mt-30">Детали ингредиента</h1>
      <IngredientDetails ingredient={ingredientData} />
    </div>
  );
};
