// SubwayStationDetail.jsx
import { useParams } from 'react-router-dom';
import './SubwayStationDetail.css';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useMemo } from 'react';
import { setSubwayInfo } from '../../store/slices/subwayStationDetailSlice';
import { subwayStationIndex } from '../../store/thunks/subwayStationListThunk';
import { realtimeArrivalsIndex } from '../../store/thunks/subwayStationDetailThunk';

function SubwayStationDetail() {
  const { stationId } = useParams();
  const dispatch = useDispatch();

  // 전역 상태
  const subwayList = useSelector(state => state.subwayStation.subwayList);
  const subwayInfo = useSelector(state => state.subwayStationDetail.subwayInfo);
  const arrivalList  = useSelector(state => state.subwayStationDetail.realtimeArrivalList);

  // 1) 역 리스트 없으면 불러오기
  useEffect(() => {
    if (!subwayList?.length) {
      dispatch(subwayStationIndex());
    }
  }, [subwayList?.length, dispatch]);

  // 2) 리스트와 stationId가 준비되면 현재 역 정보 설정
  useEffect(() => {
    if (!subwayList?.length || !stationId) {
      return;
    }
    const item = subwayList.find(it => it.STATION_CD === stationId);
    dispatch(setSubwayInfo(item ?? {})); // 못 찾으면 안전하게 빈 객체
  }, [stationId, subwayList, dispatch]);

  // 3) 현재 역 이름으로 실시간 도착 정보 요청
  useEffect(() => {
    const name = subwayInfo?.STATION_NM;
    if (!name) return;
    dispatch(realtimeArrivalsIndex(name));
  }, [dispatch, subwayInfo?.STATION_NM]);

  /* --------------------------------------------------------------------------- */

  return (
    <div className="detail-root" style={{ '--bottom-inset': '150px' }}>


      {/* 상단 타이틀 */}
      <div className="detail-titlebox">
        <div className="detail-colorbar" />
        <div className="detail-titlestack">
          <h1 className="detail-title-name">{subwayInfo?.STATION_NM || "역 불러오는 중..."}</h1>
          {subwayInfo?.LINE_NUM && <div className="detail-linechip">{subwayInfo?.LINE_NUM.replace(/^0+/,'')}</div>}
        </div>
        <div className="detail-colorbar" />
      </div>

      {/* 상/하행 섹션 */}
      <div className="detail-sections">
        {/* 상행 */}
        <section className="detail-section">
          <div className="detail-divider">
            <span className="detail-line" />
            <div className="detail-direction-badge">{`상행 -행 -방면`}</div>
            <span className="detail-line none" />
          </div>

          <div className="detail-card">
            <div className="detail-row">
              <h3>상행</h3>
              <p><span className="detail-eta">{`몇분 몇초 후`}</span> 도착</p>
            </div>
            <div className="detail-row"><h4>첫차</h4><p>{`몇시 몇분`}</p></div>
            <div className="detail-row"><h4>막차</h4><p>{`몇시 몇분`}</p></div>
          </div>
        </section>

        {/* 하행 */}
        <section className="detail-section">
          <div className="detail-divider">
            <span className="detail-line none" />
            <div className="detail-direction-badge">{`하행 -행 -방면`}</div>
            <span className="detail-line" />
          </div>

          <div className="detail-card">
            <div className="detail-row">
              <h3>하행</h3>
              <p><span className="detail-eta">{`몇분 몇초 후`}</span> 도착</p>
            </div>
            <div className="detail-row"><h4>첫차</h4><p>{`몇시 몇분`}</p></div>
            <div className="detail-row"><h4>막차</h4><p>{`몇시 몇분`}</p></div>
          </div>
        </section>

    
      </div>

    </div>
  );
}

export default SubwayStationDetail;
