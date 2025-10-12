import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const realtimeArrivalsIndex = createAsyncThunk(
  'subwayStationDetailSlice/realtimeArrivalsIndex',
  async (statnNm, { rejectWithValue }) => {
    try {
      if (!statnNm) return rejectWithValue('역 이름이 비어있어요.');
      const encoded = encodeURIComponent(statnNm);
      const url = `http://swopenapi.seoul.go.kr/api/subway/5a766a6b4f64646f3130364978634561/json/realtimeStationArrival/0/999/${encoded}`
      const { data } = await axios.get(url);
      return data?.realtimeArrivalList ?? [];
    } catch (err) {
      return rejectWithValue(err?.message ?? '실시간 도착정보 호출 실패');
    }
  }
);

export { realtimeArrivalsIndex }