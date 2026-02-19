import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import styles from './app.module.css';
import AppHeader from './components/app-header/app-header';
import Modal from './components/modal/modal';
import IngredientDetails from './components/ingredient-details/ingredient-details';
import OrderDetails from './components/order-details/order-details';

import { clearIngredientDetails } from './services/ingredientDetailsSlice';
import { clearOrder } from './services/orderSlice';
import { fetchIngredients } from './services/ingredientsSlice';
import { getUser } from './services/userSlice';
import { AppDispatch, RootState } from './services/store';

import { 
  HomePage, 
  LoginPage, 
  ForgotPasswordPage, 
  IngredientPage, 
  NotFound404, 
  ProfilePage, 
  RegisterPage, 
  ResetPasswordPage 
} from './pages';
import { ProtectedRouteElement } from './components/protectedRouteElement/protectedRouteElement';
import { getCookie } from './utils/cookie';

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

function App() {
  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();
  const navigate = useNavigate();
  const background = location.state && location.state.background;

  const { isLoading, error } = useSelector((state: RootState) => state.ingredients);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState<boolean>(false);

 useEffect(() => {
  dispatch(fetchIngredients());
  if (getCookie('accessToken')) {
      dispatch(getUser());
  }
}, [dispatch]);

  const handleModalClose = () => {
    navigate(-1);
    dispatch(clearIngredientDetails());
  };

  const handleOpenOrderModal = () => {
    setIsOrderModalOpen(true);
  };

  const handleCloseOrderModal = () => {
    dispatch(clearOrder());
    setIsOrderModalOpen(false);
  };

  return (
    <div className={styles.app}>
      <AppHeader />
      
      <main className={styles.main}>        
          <Routes location={background || location}>
            <Route 
              path="/" 
              element={<HomePage handleOpenOrderModal={handleOpenOrderModal} />} 
            />
            <Route path="/login" element={<ProtectedRouteElement onlyUnAuth component={<LoginPage />} />} />
            <Route path="/register" element={<ProtectedRouteElement onlyUnAuth component={<RegisterPage />} />} />
            <Route path="/forgot-password" element={<ProtectedRouteElement onlyUnAuth component={<ForgotPasswordPage />} />} />
            <Route path="/reset-password" element={<ProtectedRouteElement onlyUnAuth component={<ResetPasswordPage />} />} />
            
            <Route path="/profile" element={<ProtectedRouteElement component={<ProfilePage />} />} />
            <Route path="/profile/orders" element={<ProtectedRouteElement component={<ProfilePage />} />} />
            
            <Route path="/ingredients/:id" element={<IngredientPage />} />
            
            <Route path="*" element={<NotFound404 />} />
          </Routes>
      </main>

      {background && (
        <Routes>
          <Route 
            path="/ingredients/:id" 
            element={
              <Modal title="Детали ингредиента" onClose={handleModalClose}>
                <IngredientDetails />
              </Modal>
            } 
          />
        </Routes>
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
