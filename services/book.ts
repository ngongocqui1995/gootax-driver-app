import AsyncStorage from "@react-native-async-storage/async-storage";
import API from "../utils/request";

export const getBookCar = (id: string) => {
  return API.get(`book-cars?join=driver&join=type_car`, {
    params: {
      sort: "createdAt,DESC",
      filter: `driver.id||$eq||${id}`,
    },
  });
};

export const getOneBookCar = (id: string) => {
  return API.get(`book-cars`, {
    params: {
      sort: "createdAt,DESC",
      filter: `id||$eq||${id}`,
    },
  });
};

export const cancelBookCar = async (id: string) => {
  return API.get(`driver-cancel/book-cancel/${id}`, {
    headers: {
      Authorization: `Bearer ${await AsyncStorage.getItem("token")}`,
    },
  });
};

export const updateStatusBookCar = (id: string, status: string) => {
  return API.put(`book-cars/status/${id}`, { status });
};
