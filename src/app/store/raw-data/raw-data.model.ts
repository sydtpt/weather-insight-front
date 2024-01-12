import { City } from "../../shared/models/city.model";
import { ForecastResponse, forecastInit } from "../../shared/models/forecast-response.model";
import { RawDataResponse, datasetInit } from "../../shared/models/http-generic-response.model";

export interface RawDataStateModel {
  date: Date;
  values: RawDataResponse;
  isLoading: boolean;
  city: City;
  forecast: ForecastResponse;
};
export const initialState: RawDataStateModel = {
  date: new Date(),
  forecast: forecastInit,
  values: datasetInit,
  isLoading: true,
  city: {
    city_code: "",
    city_desc: "",
    latitude: "",
    longitude: "",
    image: "",
    timezone: "",
  },
};
