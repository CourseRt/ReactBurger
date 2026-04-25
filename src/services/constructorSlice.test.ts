import constructorReducer, { 
  addIngredient, 
  removeIngredient, 
  clearConstructor, 
  moveIngredient,
  initialState
} from './constructorSlice';
import { TIngredient } from '../utils/types';

describe('constructor reducer', () => {

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
     __v: 0,
  };

  const mockBun: TIngredient = { ...mockIngredient, type: 'bun', name: 'Булка', _id: '2' };

  it('should return the initial state when passed an empty action', () => {
    expect(constructorReducer(undefined, { type: '' })).toEqual(initialState);
  });

  it('should handle adding a bun', () => {
    const action = { type: addIngredient.type, payload: { ...mockBun, key: 'test-key' } };
    const state = constructorReducer(initialState, action);
    expect(state.bun).toEqual({ ...mockBun, key: 'test-key' });
  });

  it('should handle adding an ingredient', () => {
    const state = constructorReducer(initialState, addIngredient(mockIngredient));
    expect(state.ingredients).toHaveLength(1);
    expect(state.ingredients[0]).toMatchObject(mockIngredient);
    expect(state.ingredients[0]).toHaveProperty('key'); 
  });

  it('should handle removing an ingredient', () => {
    const stateWithItem = {
      bun: null,
      ingredients: [{ ...mockIngredient, key: '123' }],
    };
    const state = constructorReducer(stateWithItem, removeIngredient('123'));
    expect(state.ingredients).toHaveLength(0);
  });

  it('should handle moving ingredients', () => {
    const stateWithItems = {
      bun: null,
      ingredients: [
        { ...mockIngredient, key: '1', name: 'Первый' },
        { ...mockIngredient, key: '2', name: 'Второй' },
      ],
    };
    const state = constructorReducer(stateWithItems, moveIngredient({ dragIndex: 0, hoverIndex: 1 }));
    
    expect(state.ingredients[0].name).toBe('Второй');
    expect(state.ingredients[1].name).toBe('Первый');
  });

  it('should handle clearConstructor', () => {
    const fullState = {
      bun: mockBun,
      ingredients: [{ ...mockIngredient, key: '1' }],
    };
    const state = constructorReducer(fullState, clearConstructor());
    expect(state).toEqual(initialState);
  });
});
