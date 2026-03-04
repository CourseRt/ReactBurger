import React from 'react';
import styles from './ingredient-details.module.css';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom'; // Импорт для получения ID из URL
import { RootState } from '../../services/store';
import { TIngredient } from '../../services/ingredientsSlice';

interface IIngredientDetailsProps {
  ingredient?: TIngredient;
}

const IngredientDetails: React.FC<IIngredientDetailsProps> = ({ ingredient: ingredientFromProps }) => {
  const { id } = useParams<{ id: string }>();
  const { items } = useSelector((state: RootState) => state.ingredients);
  const ingredient = ingredientFromProps || items.find((item) => item._id === id);
  
  if (!ingredient) {
    return (
      <div className={styles.container}>
        <p className="text text_type_main-large">Загрузка данных...</p>
      </div>
    );
  }

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
