import API from './api';

export const getFoods = async (lang: string) => {

  const response = await API.get(
    `/foods?lang=${lang}`
  );

  return response.data;

};