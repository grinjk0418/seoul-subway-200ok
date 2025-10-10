import { useDispatch, useSelector } from 'react-redux';
import './SubwayStationList.css';
import { useEffect } from 'react';
import { subwayStationIndex } from '../../store/thunks/SubwayStationListThunk';
import { useNavigate } from 'react-router-dom';

function SubwayStationList() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const subwayList = useSelector(state => state.subwayStation.subwayList);

  useEffect(() => {
    dispatch(subwayStationIndex());
  }, [dispatch]);

  return (
    <>
      <div className="subway-station-list__title">
        <h1>지하철역 리스트</h1>
      </div>

      <div className="subway-station-list__searchbar">
        {/* 검색 컴포넌트 넣어.. */}
      </div>

      <div className="subway-station-list">
        {
          subwayList.map(item => {
            return(
              <div className="subway-station-list__item" key={item.STATION_CD} onClick={() => { navigate(`/stations/${item.STATION_CD}`) }}>
                <div className="subway-station-list__icon">
                  <img src="/mainnavsubway.png" alt="지하철 사진" />
                </div>
                <p>{`${item.LINE_NUM.replace(/^0+/,'')} ${item.STATION_NM}`}</p>
              </div>
            );
          })
        }
      </div>
    </>
  )
}

export default SubwayStationList;