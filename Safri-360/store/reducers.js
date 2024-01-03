import AsyncStorage from "@react-native-async-storage/async-storage";
import { persistCombineReducers } from "redux-persist";

import userReducer from "./slices/userSlice";
import locationReducer from "./slices/locationSlice";
import navigationReducer from "./slices/navigationSlice";
import rideReducer from "./slices/rideSlice";
import tourReducer from "./slices/tourSlice";
import freightReducer from "./slices/freightSlice";

const persistConfig = {
    key: "rootReducer",
    storage: AsyncStorage,
    whitelist: ["user", "location", "navigation", "ride", "tour", "freight"],
    blacklist: [],
    timeout: 7000,
};

const rootReducer = persistCombineReducers(persistConfig, {
    user: userReducer,
    location: locationReducer,
    navigation: navigationReducer,
    ride: rideReducer,
    tour: tourReducer,
    freight: freightReducer,
});

export default rootReducer;
