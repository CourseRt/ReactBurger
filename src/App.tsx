import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from './services/hooks';

import styles from './app.module.css';
import AppHeader from './components/app-header/app-header';
import Modal from './components/modal/modal';
import IngredientDetails from './components/ingredient-details/ingredient-details';
import OrderDetails from './components/order-details/order-details';

import { clearIngredientDetails } from './services/ingredientDetailsSlice';
import { clearOrder } from './services/orderSlice';
import { fetchIngredients } from './services/ingredientsSlice';
import { getUser } from './services/userSlice';

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

function App() {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const background = (location.state as { background?: Location })?.background;
  const { isAuthChecked } = useAppSelector((state) => state.user);

  const { isLoading, error } = useAppSelector((state) => state.ingredients);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState<boolean>(false);

useEffect(() => {
  dispatch(fetchIngredients());
  dispatch(getUser()); 
}, [dispatch]);

  if (!isAuthChecked) {
    return null;
  }

  const handleModalClose = () => {
    navigate(-1);
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
