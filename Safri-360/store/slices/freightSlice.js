import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    freight: {
        id: null,
        riderID: null,
        origin: null,
        destination: null,
        customerID: null,
        vehicle: null,
        weight: null,
        fare: 0,
        status: null,
        createdAt: null,
    },
};

const freightSlice = createSlice({
    name: "freight",
    initialState,
    reducers: {
        setFreight: (state, action) => {
            state.freight = { ...state.freight, ...action.payload };
        },
        resetFreight: (state) => {
            state.freight = initialState.freight;
        },
    },
});

export const { setFreight, resetFreight } = freightSlice.actions;

export const selectFreight = (state) => state.freight.freight;

export default freightSlice.reducer;
