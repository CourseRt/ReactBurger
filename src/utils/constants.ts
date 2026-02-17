export const BASE_URL = 'https://norma.education-services.ru/api';

export const checkResponse = (res: Response) => {
  return res.ok 
    ? res.json() 
    : res.json().then((err) => Promise.reject(err));
};