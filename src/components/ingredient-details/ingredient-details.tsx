import React from 'react';
import styles from './ingredient-details.module.css';
import { useSelector } from 'react-redux';
import { RootState } from '../../services/store';

const IngredientDetails: React.FC = () => {
  const { ingredient } = useSelector((state: RootState) => state.ingredientDetails);
  if (!ingredient) return null;

  return (
    <div className={styles.container}>
      <img 
        src={ingredient.image_large} 
        alt={ingredient.name} 
        className={styles.image} 
      />
      <h3 className="text text_type_main-medium mt-4 mb-8">
        {ingredient.name}
      </h3>
      
      <ul className={styles.nutritionList}>
        <NutritionItem label="Калории, ккал" value={ingredient.calories} />
        <NutritionItem label="Белки, г" value={ingredient.proteins} />
        <NutritionItem label="Жиры, г" value={ingredient.fat} />
        <NutritionItem label="Углеводы, г" value={ingredient.carbohydrates} />
      </ul>
    </div>
  );
};

const NutritionItem = ({ label, value }: { label: string; value: number }) => (
  <li className={styles.nutritionItem}>
    <span className="text text_type_main-default text_color_inactive">
      {label}
    </span>
    <span className="text text_type_digits-default text_color_inactive mt-2">
      {value}
    </span>
  </li>
);

export default IngredientDetails;