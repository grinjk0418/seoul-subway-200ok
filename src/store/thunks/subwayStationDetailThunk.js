//subwayStationDetailThunk.js 파일
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { thunk } from "redux-thunk";

const realtimeArrivalsIndex = createAsyncThunk(
  'subwayStationDetailSlice/realtimeArrivalsIndex',
  async (statnNm) => {
      const url = `http://swopenapi.seoul.go.kr/api/subway/${import.meta.env.VITE_SEOUL_OPEN_API_KEY}/json/realtimeStationArrival/0/999/${statnNm}`

      const { data } = await axios.get(url);
      
      return data?.realtimeArrivalList;
  }
);

// const firstLastTimesIndex = createAsyncThunk(
//   'subwayStationDetailSlice/firstLastTimesIndex'
//   async (arg, thunkAPI) => {
//     const state = thunkAPI.getState();

//     const lineNum = 
//     const updnLine = 
//     const day = 
//     const stationCd = 

//     const url = `http://openapi.seoul.go.kr:8088/${import.meta.env.VITE_SEOUL_OPEN_API_KEY}/json/SearchFirstAndLastTrainbyLineServiceNew/1/1/${'4호선'}/${'상/하행'}/${'요일'}/${'전철역코드'}`

//     return
//   }
// );

export { realtimeArrivalsIndex }