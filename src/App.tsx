import React, { useState, useEffect } from 'react';
import styles from './app.module.css';
import AppHeader from './components/app-header/app-header';
import BurgerIngredients from './components/burger-ingredients/burger-ingredients';
import BurgerConstructor from './components/burger-constructor/burger-constructor';
import Modal from './components/modal/modal';
import IngredientDetails from './components/ingredient-details/ingredient-details';
import OrderDetails from './components/order-details/order-details';

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
  const [ingredients, setIngredients] = useState<IIngredient[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasError, setHasError] = useState<boolean>(false);
  const [selectedIngredient, setSelectedIngredient] = useState<IIngredient | null>(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState<boolean>(false);

  useEffect(() => {
    const fetchIngredients = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error('Ошибка сети');
        const result = await res.json();
        setIngredients(result.data);
      } catch (e) {
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    };
    fetchIngredients();
  }, []);

  const handleOpenIngredientModal = (ingredient: IIngredient): void => {
    setSelectedIngredient(ingredient);
  };

  const handleCloseIngredientModal = (): void => {
    setSelectedIngredient(null);
  };

  const handleOpenOrderModal = (): void => {
    setIsOrderModalOpen(true);
  };

  const handleCloseOrderModal = (): void => {
    setIsOrderModalOpen(false);
  };

  return (
    <div className={styles.app}>
      <AppHeader />
      
      <main className={styles.main}>
        {isLoading && <p className="text text_type_main-medium mt-10">Загрузка космических данных...</p>}
        {hasError && <p className="text text_type_main-medium mt-10">Произошла ошибка. Связь с Марсом прервана.</p>}
        
        {!isLoading && !hasError && (
          <div className={styles.container}>
            <BurgerIngredients 
              data={ingredients} 
              onIngredientClick={handleOpenIngredientModal} 
            />
            <BurgerConstructor 
              data={ingredients} 
              onOrderClick={handleOpenOrderModal} 
            />
          </div>
        )}
      </main>

      {selectedIngredient && (
        <Modal title="Детали ингредиента" onClose={handleCloseIngredientModal}>
          <IngredientDetails ingredient={selectedIngredient} />
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
