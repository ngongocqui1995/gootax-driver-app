import API from "../utils/request";

export const queryCars = (params?: any) => {
  return API.get(
    `cars?join=company&join=car_style&join=vehicle&join=type_car`,
    {
      params,
    }
  );
};

export const getTypeCars = () => {
  return API.get(`type-cars`, {
    headers: { "x-custom-lang": "vi" },
  });
};
