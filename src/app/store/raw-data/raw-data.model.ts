import { City } from "../../shared/models/city.model";
import { ForecastResponse } from "../../shared/models/forecast-response.model";
import { RawDataResponse } from "../../shared/models/http-generic-response.model";

export interface RawDataStateModel {
  date: Date;
  values: RawDataResponse;
  isLoading: boolean;
  city: City;
  forecast: ForecastResponse;
};
export const initialState: RawDataStateModel = {
  date: new Date(),
  forecast: new ForecastResponse(),
  values: new RawDataResponse(),
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
