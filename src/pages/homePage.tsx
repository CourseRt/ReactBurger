import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import BurgerIngredients from '../components/burger-ingredients/burger-ingredients';
import BurgerConstructor from '../components/burger-constructor/burger-constructor';
import styles from './styles/home.module.css';

interface IHomePageProps {
  handleOpenOrderModal: () => void;
}

export const HomePage: React.FC<IHomePageProps> = ({  
  handleOpenOrderModal 
}) => {
  return (
    <DndProvider backend={HTML5Backend}>
      <div className={styles.container}>
        <BurgerIngredients /> 
        <BurgerConstructor onOrderClick={handleOpenOrderModal} />
      </div>
    </DndProvider>
  );
};
