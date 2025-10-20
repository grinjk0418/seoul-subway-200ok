// src/store/slices/subwayStationDetailSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { realtimeArrivalsIndex, firstLastTimesIndex } from "../thunks/subwayStationDetailThunk";

const subwayStationDetailSlice = createSlice({
  name: 'subwayStationDetailSlice',
  initialState: {
    subwayInfo: {},
    realtimeArrivalList: [],
    firstLastTimes: [],
  },
  reducers: {
    setSubwayInfo(state, action) {
      state.subwayInfo = action.payload;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(realtimeArrivalsIndex.fulfilled, (state, action) => {
        state.realtimeArrivalList = action.payload || [];
      })
      .addCase(firstLastTimesIndex.fulfilled, (state, action) => {
        state.firstLastTimes = action.payload || [];
      })
      .addMatcher(
        action => action.type.startsWith('subwayStationDetailSlice') && action.type.endsWith('/rejected'),
        (state, action) => {
          console.error('에러에러.', action.error);
        }
      );
  }
});

export const { setSubwayInfo } = subwayStationDetailSlice.actions;
export default subwayStationDetailSlice.reducer;
