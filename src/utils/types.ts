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

export interface TConstructorIngredient extends TIngredient {
  id: string;
}

export interface IOrder {
  _id: string;
  ingredients: string[];
  status: 'created' | 'pending' | 'done';
  name: string;
  createdAt: string;
  updatedAt: string;
  number: number;
}

export interface IOrderProps {
  order: IOrder;
  showStatus?: boolean;
}