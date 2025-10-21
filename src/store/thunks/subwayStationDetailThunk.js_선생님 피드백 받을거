//subwayStationDetailThunk.js 파일
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const realtimeArrivalsIndex = createAsyncThunk(
  'subwayStationDetailSlice/realtimeArrivalsIndex',
  async (statnNm) => {
      const url = `http://swopenapi.seoul.go.kr/api/subway/${import.meta.env.VITE_SEOUL_OPEN_API_KEY}/json/realtimeStationArrival/0/999/${statnNm}`;

      const { data } = await axios.get(url);
      
      return data.realtimeArrivalList;
  }
);

const firstLastTimesIndex = createAsyncThunk(
  'subwayStationDetailSlice/firstLastTimesIndex',
  async (arg, thunkAPI) => {
  const state = thunkAPI.getState();

  const line =  state.subwayStationDetail.subwayInfo.LINE_NUM;
  const stCd = state.subwayStationDetail.subwayInfo?.STATION_CD;

  const url = `http://openapi.seoul.go.kr:8088/${import.meta.env.VITE_SEOUL_OPEN_API_KEY}/json/SearchFirstAndLastTrainbyLineServiceNew/1/1/${line}/${'상/하행'}/${'요일'}/${stCd}`;

  const { data } = await axios.get(url);
      
    return data.SearchFirstAndLastTrainbyLineServiceNew.row;
  }
);

export { realtimeArrivalsIndex, firstLastTimesIndex }