import { useParams } from 'react-router-dom';
import './SubwayStationDetail.css';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { setSubwayInfo } from '../../store/slices/subwayStationDetailSlice';
import { subwayStationIndex } from '../../store/thunks/SubwayStationListThunk';

function SubwayStationDetail() {

  const { stationId } = useParams();
  const dispatch = useDispatch();
  const subwayList = useSelector(state => state.subwayStation.subwayList);
  const subwayInfo = useSelector(state => state.subwayStationDetail.subwayInfo);


// 1) 리스트가 비어 있으면 로드
  useEffect(() => {
    if (!subwayList?.length) {
      dispatch(subwayStationIndex());
    }
  }, [subwayList?.length, dispatch]);

  // 2) 리스트(혹은 stationId)가 준비되면 해당 역 찾기
  useEffect(() => {
    if (!subwayList?.length || !stationId) return;
    const item = subwayList.find(item => item.STATION_CD === stationId);
    dispatch(setSubwayInfo(item ?? {})); // 못 찾으면 안전하게 빈 객체, (?? 는 널 병합 연산자,왼쪽값이 null이나 undefined면 오른쪽값을 쓰겠다)
  }, [stationId, subwayList, dispatch]);

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