import { createSlice } from "@reduxjs/toolkit";
import { differenceInDays, addDays } from "date-fns";

const rentalSlice = createSlice({
  name: "rental",
  initialState: { selectedRange: { from: null, to: null }, price: 0 },
  reducers: {
    setRentalPeriod: (state, action) => {
      const { from, to } = action.payload;
      const adjustedTo =
        to && differenceInDays(to, from) > 31 ? addDays(from, 31) : to;
      state.selectedRange = { from, to: adjustedTo };
      state.price =
        from && adjustedTo ? 500 * (differenceInDays(adjustedTo, from) + 1) : 0;
    },
  },
});

export const { setRentalPeriod } = rentalSlice.actions;
export default rentalSlice.reducer;
