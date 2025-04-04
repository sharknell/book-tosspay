import { createSlice } from "@reduxjs/toolkit";
import { differenceInDays, addDays } from "date-fns";

const rentalSlice = createSlice({
  name: "rental",
  initialState: { selectedRange: { from: null, to: null }, price: 10000 },
  reducers: {
    setRentalPeriod: (state, action) => {
      const { from, to } = action.payload;
      const adjustedTo =
        to && differenceInDays(to, from) > 14 ? addDays(from, 14) : to;
      state.selectedRange = { from, to: adjustedTo };
      state.price =
        from && adjustedTo
          ? 500 * (differenceInDays(adjustedTo, from) + 1)
          : 10000;
    },
  },
});

export const { setRentalPeriod } = rentalSlice.actions;
export default rentalSlice.reducer;
