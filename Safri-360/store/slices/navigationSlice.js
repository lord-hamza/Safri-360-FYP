import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    origin: null,
    destination: null,
    travelRouteInformation: null, //distance and duration
};

const navigationSlice = createSlice({
    name: "navigation",
    initialState,
    reducers: {
        setOrigin: (state, action) => {
            state.origin = action.payload;
        },
        setDestination: (state, action) => {
            state.destination = action.payload;
        },
        setTravelRouteInformation: (state, action) => {
            state.travelRouteInformation = action.payload;
        },
    },
});

// exporting actions
export const { setOrigin, setDestination, setTravelRouteInformation } = navigationSlice.actions;

// exporting selectors
export const selectOrigin = (state) => state.navigation.origin;
export const selectDestination = (state) => state.navigation.destination;
export const selectTravelRouteInformation = (state) => state.navigation.travelRouteInformation;

// exporting reducer
export default navigationSlice.reducer;
