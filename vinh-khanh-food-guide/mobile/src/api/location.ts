import API from './api';
import { Location } from '../types/Location';

const BASE_URL = "http://192.168.2.23:8080/api";


// =============================
// GET ALL LOCATIONS (WITH LANG)
// =============================
export const getLocations = async (lang: string): Promise<Location[]> => {

  const response = await API.get<Location[]>(
    `/locations?lang=${lang}`
  );

  return response.data;

};


// =============================
// GET LOCATION BY ID
// =============================
export const getLocationById = async (id: number): Promise<Location> => {

  const response = await API.get<Location>(
    `/locations/${id}`
  );

  return response.data;

};


// =============================
// CREATE LOCATION
// =============================
export const createLocation = async (data: Location): Promise<Location> => {

  const response = await API.post<Location>(
    `/locations`,
    data
  );

  return response.data;

};


// =============================
// UPDATE LOCATION
// =============================
export const updateLocation = async (
  id: number,
  data: Location
): Promise<Location> => {

  const response = await API.put<Location>(
    `/locations/${id}`,
    data
  );

  return response.data;

};


// =============================
// DELETE LOCATION
// =============================
export const deleteLocation = async (id: number): Promise<void> => {

  await API.delete(
    `/locations/${id}`
  );

};