import { createSlice, PayloadAction, nanoid } from '@reduxjs/toolkit';
import { TIngredient } from '../utils/types';

export type TConstructorIngredient = TIngredient & { key: string };

interface TConstructorState {
  bun: TIngredient | null;
  ingredients: TConstructorIngredient[];
}

const initialState: TConstructorState = {
  bun: null,
  ingredients: [],
};

export const constructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    addIngredient: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        if (action.payload.type === 'bun') {
          state.bun = action.payload;
        } else {
          state.ingredients.push(action.payload);
        }
      },
      prepare: (ingredient: TIngredient) => {
        const key = nanoid();
        return { payload: { ...ingredient, key } };
      },
    },
    removeIngredient: (state, action: PayloadAction<string>) => {
      state.ingredients = state.ingredients.filter(
        (item) => item.key !== action.payload
      );
    },
    clearConstructor: (state) => {
      state.bun = null;
      state.ingredients = [];
    },
    moveIngredient: (state, action: PayloadAction<{ dragIndex: number; hoverIndex: number }>) => {
      const { dragIndex, hoverIndex } = action.payload;
      const draggedIngredient = state.ingredients[dragIndex];

      state.ingredients.splice(dragIndex, 1);
      state.ingredients.splice(hoverIndex, 0, draggedIngredient);
    },
  },
});

export const { addIngredient, removeIngredient, clearConstructor, moveIngredient } = constructorSlice.actions;
export default constructorSlice.reducer;
