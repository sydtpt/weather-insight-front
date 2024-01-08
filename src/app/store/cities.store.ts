import { computed, inject } from "@angular/core";
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

type State = { cities: City[]; isLoading: boolean; selectedCity: string };
const initialState: State = {
  cities: [],
  isLoading: true,
  selectedCity: "",
};

export const CitiesStore = signalStore(
  { providedIn: "root" },
  withEntities<City>(),
  withState(initialState),
  withComputed(({ cities }) => ({
    // doubleCount: computed(() => cities().toLocaleString()),
    // TO DO
  })),

  withMethods((store, cityService = inject(CityService)) => {
    return {
      async load() {
        const cities = await firstValueFrom(cityService.getCities());
        patchState(store, { cities: cities, isLoading: false });
      },
      getTimeZone() {
        debugger
        let temp: any = store.cities().find(
          (i) => i.city_code === store.selectedCity()
        );
        return temp ? temp.timezone : "";
      },
      exist(city_code: string) {
        return !!store.cities().find((i) => city_code === i.city_code);
      },
      getLatitudeLongitude(city_code: string) {
        let city = store.cities().find((i) => city_code === i.city_code);
        return city ? {latitude: city.latitude, longitude: city.longitude}:  {latitude: "0", longitude: "0"} 
      },
    };
  }),
  withHooks({
    onInit(store) {
      console.log("++++++++++++++++++++++++++++++++");
      console.log("onInit: CitiesStore");
      console.log("++++++++++++++++++++++++++++++++");
      patchState(store, { isLoading: true });
      store.load();
    },
    onDestroy() {
      console.log("++++++++++++++++++++++++++++++++");
      console.log("onDestroy: CitiesStore");
      console.log("++++++++++++++++++++++++++++++++");
    },
  })
);
