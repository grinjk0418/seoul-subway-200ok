import { useParams } from 'react-router-dom';
import './SubwayStationDetail.css';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { setSubwayInfo } from '../../store/slices/subwayStationDetailSlice';

function SubwayStationDetail() {

  const params = useParams();
  const dispatch = useDispatch();
  const subwayList = useSelector(state => state.subwayStation.subwayList);
  const subwayInfo = useSelector(state => state.subwayStationDetail.subwayInfo);

  useEffect(() => {
    const item = subwayList.find((item) => params.stationId === item.STATION_CD);
    dispatch(setSubwayInfo(item));
  }, []);

  return (
    <>
      { subwayInfo.STATION_NM &&
      <div className="subway-detail__title">
        <div className="subway-detail__line-chip"></div>
          <h1>{subwayInfo.STATION_NM}</h1>
        <div className="subway-detail__line-chip"></div>
      </div>
      }

      <div className="subway-detail__line-badges">
        <div className="subway-detail__line-badge">1호선</div>
        <div className="subway-detail__line-badge">2호선</div>
        <div className="subway-detail__line-badge">3호선</div>
        <div className="subway-detail__line-badge">4호선</div>
      </div>

      <div className="subway-detail__content">
        <div className="subway-detail__info">
          <div><h3>상행</h3><p><span>6분 30초 후</span> 도착</p></div>
          <div><h4>첫차</h4><p>23시 5분</p></div>
          <div><h4>막차</h4><p>23시 5분</p></div>
        </div>
        <div className="subway-detail__info">
          <div><h3>하행</h3><p><span>6분 30초 후</span> 도착</p></div>
          <div><h4>첫차</h4><p>23시 5분</p></div>
          <div><h4>막차</h4><p>23시 5분</p></div>
        </div>
      </div>
    </>
  )
}

export default SubwayStationDetail;