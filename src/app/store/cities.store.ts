import { inject } from "@angular/core";
import {
  signalStore,
  patchState,
  withComputed,
  withMethods,
  withState,
  withHooks,
} from "@ngrx/signals";
import { withEntities } from "@ngrx/signals/entities";
import { City } from "../shared/models/city.model";
import { CityService } from "../shared/services/city.service";
import { firstValueFrom } from "rxjs";

type State = { cities: City[]; isLoading: boolean; selectedCity: City };
const initialState: State = {
  cities: [],
  isLoading: true,
  selectedCity: {
    city_code: "",
    city_desc: "",
    latitude: "",
    longitude: "",
    image: "",
    timezone: "",
  },
};
export const CitiesStore = signalStore(
  { providedIn: "root" },
  withEntities<City>(),
  withState(initialState),
  withComputed(({ cities }) => ({
    // doubleCount: computed(() => cities().toLocaleString()),
    // TO DO
  })),

  withMethods((state, cityService = inject(CityService)) => {
    return {
      async load() {
        const cities = await firstValueFrom(cityService.getCities());
        patchState(state, { cities: cities, isLoading: false });
      },
      getTimeZone() {
        let temp: any = state.cities().find(
          (i) => i.city_code === state.selectedCity().city_code
        );
        return temp ? temp.timezone : "";
      },
      exist(city_code: string) {
        if(!city_code) return
        return !!state.cities().find((i) => city_code === i.city_code);
      },
      getCityByCode(city_code: string){
        return state.cities().find((i) => city_code === i.city_code);
      },
      getLatitudeLongitude(city_code: string) {
        let city = state.cities().find((i) => city_code === i.city_code);
        return city ? {latitude: city.latitude, longitude: city.longitude}:  {latitude: "0", longitude: "0"} 
      },
      selectCity(city_code: string): City | undefined {
        let city = state.cities().find((i) => city_code === i.city_code);
        return city;
      }
    };
  }),
  withHooks({
    onInit(store) {
      console.log("++++++++++++++++++++++++++++++++");
      console.log("onInit: CitiesStore");
      console.log("++++++++++++++++++++++++++++++++");
    },
    onDestroy() {
      console.log("++++++++++++++++++++++++++++++++");
      console.log("onDestroy: CitiesStore");
      console.log("++++++++++++++++++++++++++++++++");
    },
  })
);