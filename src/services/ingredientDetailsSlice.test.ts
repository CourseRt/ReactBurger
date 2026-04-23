import ingredientDetailsReducer, { 
  setIngredientDetails, 
  clearIngredientDetails 
} from './ingredientDetailsSlice';
import { TIngredient } from '../utils/types';

describe('ingredientDetails reducer', () => {
  const initialState = { ingredient: null };

  const mockIngredient: TIngredient = {
    _id: '1',
    name: 'Начинка',
    type: 'main',
    proteins: 10,
    fat: 10,
    carbohydrates: 10,
    calories: 100,
    price: 100,
    image: 'url',
    image_mobile: 'url',
    image_large: 'url',
    __v: 0
  };

  it('should return the initial state', () => {
    expect(ingredientDetailsReducer(undefined, { type: '' })).toEqual(initialState);
  });

  it('should handle setIngredientDetails', () => {
    const state = ingredientDetailsReducer(initialState, setIngredientDetails(mockIngredient));
    expect(state.ingredient).toEqual(mockIngredient);
  });

  it('should handle clearIngredientDetails', () => {
    const stateWithData = { ingredient: mockIngredient };
    const state = ingredientDetailsReducer(stateWithData, clearIngredientDetails());
    expect(state.ingredient).toBeNull();
  });
});
