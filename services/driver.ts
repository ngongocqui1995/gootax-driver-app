import AsyncStorage from "@react-native-async-storage/async-storage";
import API from "../utils/request";

export const createDrivers = (body: any) => {
  return API.post(`drivers`, body);
};

export const changeLocation = async (body: any) => {
  return API.put(`drivers/update/change-location`, body, {
    headers: {
      Authorization: `Bearer ${await AsyncStorage.getItem("token")}`,
    },
  });
};

export const receiveOrder = async (id: string) => {
  return API.get(`drivers/receive-order/${id}`, {
    headers: {
      Authorization: `Bearer ${await AsyncStorage.getItem("token")}`,
    },
  });
};

export const loginDriver = (body: any) => {
  return API.post(`auth/driver-login`, body, {
    headers: { "x-custom-lang": "vi" },
  });
};

export const getProfile = (token: string) => {
  return API.get(`auth/driver-profile`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
