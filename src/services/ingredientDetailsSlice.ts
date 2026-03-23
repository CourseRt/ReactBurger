// src/services/ingredientDetailsSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TIngredient } from '../utils/types';

const ingredientDetailsSlice = createSlice({
  name: 'ingredientDetails',
  initialState: { ingredient: null as TIngredient | null },
  reducers: {
    setIngredientDetails: (state, action: PayloadAction<TIngredient>) => {
      state.ingredient = action.payload;
    },
    clearIngredientDetails: (state) => {
      state.ingredient = null;
    },
  },
});

export const { setIngredientDetails, clearIngredientDetails } = ingredientDetailsSlice.actions;
export default ingredientDetailsSlice.reducer;
