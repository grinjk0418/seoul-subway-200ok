import { createSlice } from "@reduxjs/toolkit";

const subwayStationDetailSlice = createSlice({
  name: 'subwayStationDetailSlice',
  initialState: {
    subwayInfo: {},
  },
  reducers: {
    setSubwayInfo(state, action) {
      state.subwayInfo = action.payload;
    },
  }
});

export const {
  setSubwayInfo
} = subwayStationDetailSlice.actions;

export default subwayStationDetailSlice.reducer;