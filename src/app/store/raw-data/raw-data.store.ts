import {
  signalStore,
  withState,
  withHooks,
} from "@ngrx/signals";
import { withEntities } from "@ngrx/signals/entities";
import { withRawDataMethods } from "./raw-data.methods";
import { RawDataStateModel, initialState } from "./raw-data.model";

export const RawDataStore = signalStore(
  { providedIn: "root" },
  withEntities<RawDataStateModel>(),
  withState(initialState),
  withRawDataMethods(),
  withHooks({
    onInit() {

    },
    onDestroy() {
      console.log("++++++++++++++++++++++++++++++++");
      console.log("onDestroy: RawDataStore");
      console.log("++++++++++++++++++++++++++++++++");
    },
  })
);
