import ingredientsReducer, { fetchIngredients } from './ingredientsSlice';
import { TIngredient } from '../utils/types';

describe('ingredients reducer', () => {
  const initialState = {
    items: [],
    isLoading: false,
    error: null,
  };

  const mockIngredients: TIngredient[] = [
    {
      _id: '1',
      name: 'Булка',
      type: 'bun',
      proteins: 10,
      fat: 10,
      carbohydrates: 10,
      calories: 100,
      price: 100,
      image: 'url',
      image_mobile: 'url',
      image_large: 'url',
      __v: 0,
    },
  ];

  it('should return the initial state', () => {
    expect(ingredientsReducer(undefined, { type: '' })).toEqual(initialState);
  });

  it('should set isLoading to true when fetchIngredients is pending', () => {
    const action = { type: fetchIngredients.pending.type };
    const state = ingredientsReducer(initialState, action);
    
    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('should update items and set isLoading to false when fetchIngredients is fulfilled', () => {
    const action = { 
      type: fetchIngredients.fulfilled.type, 
      payload: mockIngredients 
    };
    const state = ingredientsReducer(initialState, action);
    
    expect(state.isLoading).toBe(false);
    expect(state.items).toEqual(mockIngredients);
  });

  it('should set error and isLoading to false when fetchIngredients is rejected', () => {
    const errorMessage = 'Failed to fetch';
    const action = { 
      type: fetchIngredients.rejected.type, 
      error: { message: errorMessage } 
    };
    const state = ingredientsReducer(initialState, action);
    
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe(errorMessage);
  });
});
