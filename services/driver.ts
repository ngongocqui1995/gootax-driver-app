import API from "../utils/request";

export const createDrivers = (body: any) => {
  return API.post(`drivers`, body);
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
