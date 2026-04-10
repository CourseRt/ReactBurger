export const BASE_URL = 'https://new-stellarburgers.education-services.ru/api';

export const checkResponse = (res: Response) => {
  return res.ok 
    ? res.json() 
    : res.json().then((err) => Promise.reject(err));
};