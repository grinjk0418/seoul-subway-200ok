import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const subwayStationIndex = createAsyncThunk(
  "subwayStationListSlice/subwayStationIndex",
  async () => {
    const base = "http://openapi.seoul.go.kr:8088/5a766a6b4f64646f3130364978634561/json/SearchSTNBySubwayLineInfo";
    const tasks = [];
    for (let i = 1; i <= 9; i++) {
      const line = `${String(i).padStart(2, "0")}호선`; // ✅ "02호선" 형식 맞추기
      const url = `${base}/1/999/%20/%20/${encodeURIComponent(line)}`; // ✅ %20/%20 유지
      tasks.push(axios.get(url));
    }
    const results = await Promise.all(tasks);
    const merged = [];
    for (const r of results) {
      const rows = r?.data?.SearchSTNBySubwayLineInfo?.row || [];
      merged.push(...rows);
    }
    return merged;
  }
);
