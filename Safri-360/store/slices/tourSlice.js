import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    tour: {
        id: null,
        name: null,
        fare: null,
        origin: null,
        destination: null,
        departure: null,
        startDate: null,
        isBooked: false,
        companyName: null,
    },
};

const tourSlice = createSlice({
    name: "tour",
    initialState,
    reducers: {
        setTour: (state, action) => {
            state.tour = { ...state.tour, ...action.payload };
        },
        resetTour: (state) => {
            state.tour = initialState.tour;
        },
    },
});

export const { setTour, resetTour } = tourSlice.actions;

export const selectTour = (state) => state.tour.tour;

export default tourSlice.reducer;
