import React, { useState, useEffect } from 'react';
import styles from './app.module.css';
import AppHeader from './components/app-header/app-header';
import BurgerIngredients from './components/burger-ingredients/burger-ingredients';
import BurgerConstructor from './components/burger-constructor/burger-constructor';
import Modal from './components/modal/modal';
import IngredientDetails from './components/ingredient-details/ingredient-details';
import OrderDetails from './components/order-details/order-details';
import { useDispatch, useSelector } from 'react-redux';
import { clearIngredientDetails, setIngredientDetails } from './services/ingredientDetailsSlice';
import { clearOrder } from './services/orderSlice';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { fetchIngredients } from './services/ingredientsSlice';
import { AppDispatch, RootState } from './services/store';

export interface IIngredient {
  _id: string;
  name: string;
  type: string;
  proteins: number;
  fat: number;
  carbohydrates: number;
  calories: number;
  price: number;
  image: string;
  image_mobile: string;
  image_large: string;
  __v: number;
}

const API_URL = 'https://norma.education-services.ru/api/ingredients';

function App() {
  const { items, isLoading, error } = useSelector((state: RootState) => state.ingredients);
  const { ingredient } = useSelector((state: RootState) => state.ingredientDetails);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState<boolean>(false);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchIngredients());
  }, [dispatch]);

  const handleOpenIngredientModal = (ingredient: IIngredient): void => {
    dispatch(setIngredientDetails(ingredient));
  };

  const handleCloseIngredientModal = (): void => {
    dispatch(clearIngredientDetails());
  };

  const handleOpenOrderModal = (): void => {
    setIsOrderModalOpen(true);
  };

  const handleCloseOrderModal = (): void => {
    dispatch(clearOrder());
    setIsOrderModalOpen(false);
  };

  return (
    <div className={styles.app}>
      <AppHeader />
      
      <main className={styles.main}>
        {isLoading && <p className="text text_type_main-medium mt-10">Загрузка космических данных...</p>}
        {error && <p className="text text_type_main-medium mt-10">Произошла ошибка. Связь с Марсом прервана.</p>}
        
        {!isLoading && !error && (
          <DndProvider backend={HTML5Backend}>
          <div className={styles.container}>
            <BurgerIngredients 
              onIngredientClick={handleOpenIngredientModal} 
            />
            <BurgerConstructor
              onOrderClick={handleOpenOrderModal} 
            />
          </div>
       </DndProvider>
        )}
      </main>

      {ingredient && (
        <Modal title="Детали ингредиента" onClose={handleCloseIngredientModal}>
          <IngredientDetails />
        </Modal>
      )}

      {isOrderModalOpen && (
        <Modal onClose={handleCloseOrderModal}>
          <OrderDetails />
        </Modal>
      )}
    </div>
  );
}

export default App;
