import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

{/*Проверка типизации, чтоб не создавать prop-types в конце файла
   интерфейс будет контролировать данные, приходящие в компонент(9 пункт курсовой)*/}
export interface TIngredient {
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

export const fetchIngredients = createAsyncThunk(
  'ingredients/fetchIngredients',
  async () => {
    const res = await fetch('https://norma.education-services.ru/api/ingredients');
    const data = await res.json();
    return data.data;
  }
);

const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState: { 
    items: [] as TIngredient[], 
    isLoading: false, 
    error: null as string | null 
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, (state) => { 
        state.isLoading = true; 
        state.error = null;
      })
      .addCase(fetchIngredients.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(fetchIngredients.rejected, (state) => { 
        state.isLoading = false;
        state.error = 'Ошибка при загрузке';
      });
  }
});

export default ingredientsSlice.reducer;
