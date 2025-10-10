import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const subwayStationIndex = createAsyncThunk(
  "subwayStationListSlice/subwayStationIndex",
  async () => {
    const base = "http://openapi.seoul.go.kr:8088/5a766a6b4f64646f3130364978634561/json/SearchSTNBySubwayLineInfo";
    const tasks = [];
    for (let i = 1; i <= 9; i++) {
      const url = `${base}/1/999/%20/%20/${i}`;
      tasks.push(axios.get(url));
    }
    const results = await Promise.all(tasks);
    const merged = [];
    for (const r of results) {
      const rows = r.data.SearchSTNBySubwayLineInfo.row || [];
      merged.push(...rows);
    }
    return merged;
  }
);


// const subwayStationIndex = createAsyncThunk(
//   'subwayStationListSlice/subwayStationIndex',
//   async () => {
//     const url = `http://openapi.seoul.go.kr:8088/5a766a6b4f64646f3130364978634561/json/SearchSTNBySubwayLineInfo/1/799/%20/%20/9`
//     const response = await axios.get(url);

//     return response.data.SearchSTNBySubwayLineInfo.row;
//   }
// );

// export { subwayStationIndex };