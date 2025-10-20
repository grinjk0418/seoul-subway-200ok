//subwayStationDetailSlice.js 파일
import { createSlice } from "@reduxjs/toolkit";
import { realtimeArrivalsIndex } from "../thunks/subwayStationDetailThunk";

const subwayStationDetailSlice = createSlice({
  name: 'subwayStationDetailSlice',
  initialState: {
    subwayInfo: {},
    realtimeArrivalList: [],
  },
  reducers: {
    setSubwayInfo(state, action) {
      state.subwayInfo = action.payload;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(realtimeArrivalsIndex.fulfilled, (state, action) => {
        state.realtimeArrivalList = action.payload;
      })
  }
});

export const {
  setSubwayInfo
} = subwayStationDetailSlice.actions;

export default subwayStationDetailSlice.reducer;