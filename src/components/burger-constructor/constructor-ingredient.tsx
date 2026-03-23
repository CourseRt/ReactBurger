import React, { useRef } from 'react';
import { useAppDispatch } from '../../services/hooks';
import { useDrag, useDrop } from 'react-dnd';
import { ConstructorElement, DragIcon } from '@ya.praktikum/react-developer-burger-ui-components';
import { removeIngredient, moveIngredient, TConstructorIngredient } from '../../services/constructorSlice';
import styles from './burger-constructor.module.css';

interface IConstructorIngredientProps {
  item: TConstructorIngredient;
  index: number;
}

interface IDragItem {
  index: number;
  id: string;
}

export const ConstructorIngredient: React.FC<IConstructorIngredientProps> = ({ item, index }) => {
  const dispatch = useAppDispatch();
  const ref = useRef<HTMLLIElement>(null);

  const [, drop] = useDrop<IDragItem, void, { handlerId: string | symbol | null }>({
    accept: 'sort_ingredient',
    hover: (draggedItem: IDragItem, monitor) => {
      if (!ref.current) return;
      const dragIndex = draggedItem.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) return;

      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      if (!clientOffset) return;
      const hoverClientY = (clientOffset?.y || 0) - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;

      dispatch(moveIngredient({ dragIndex, hoverIndex }));
      draggedItem.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: 'sort_ingredient',
    item: (): IDragItem => ({ id: item.key, index }),
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const opacity = isDragging ? 0 : 1;

  drag(drop(ref));

  return (
    <li 
      ref={ref} 
      className={`${styles.listItem} mb-4`} 
      style={{ opacity }}
    >
      <DragIcon type="primary" />
      <ConstructorElement
        text={item.name}
        price={item.price}
        thumbnail={item.image}
        handleClose={() => dispatch(removeIngredient(item.key))}
      />
    </li>
  );
};
