// SubwayStationDetail.jsx
import { useParams } from 'react-router-dom';
import './SubwayStationDetail.css';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useMemo } from 'react';
import { setSubwayInfo } from '../../store/slices/subwayStationDetailSlice';
import { subwayStationIndex } from '../../store/thunks/subwayStationListThunk';
import { realtimeArrivalsIndex } from '../../store/thunks/subwayStationDetailThunk';

/* ----------------------- 작은 함수 2개 (컴포넌트 바깥) ----------------------- */
// LINE_NUM("01호선","9호선" 등) → subwayId(1001~1009)로 변환
function toSubwayId(lineNum) {
  if (!lineNum) {
    return null;
  }
  const n = parseInt(String(lineNum).replace(/\D/g, ''), 10); // 숫자만 뽑기
  if (!Number.isFinite(n) || n < 1 || n > 9) {
    return null;     // 1~9호선만
  }
  return 1000 + n;                                            // 1001~1009
}

// 남은 시간(barvlDt: 초) → "X분 Y초 후"
function formatEta(barvlDt) {
  const sec = Number(barvlDt);
  if (!Number.isFinite(sec)) {
    return '예상 없음';
  }
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}분 ${s}초 후`;
}
/* --------------------------------------------------------------------------- */

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

  /* ----------------------- 도착 데이터 가공 (아주 간단) ----------------------- */
  // 현재 역 호선 → subwayId(1001~1009)
  const subwayId = useMemo(
    () => toSubwayId(subwayInfo?.LINE_NUM),
    [subwayInfo?.LINE_NUM]
  );
  
  //  const subwayId = toSubwayId(subwayInfo?.LINE_NUM);

  // 이 역의 "해당 호선" 도착 정보만 남기기
  const arrivalsForLine = useMemo(() => {
    if (!subwayId || !Array.isArray(arrivalList)) return [];
    return arrivalList.filter(a => Number(a.subwayId) === subwayId);
  }, [arrivalList, subwayId]);

  // 상행/하행 분리
  const upArrivals = useMemo(
    () => arrivalsForLine.filter(a => a.updnLine?.includes('상행')),
    [arrivalsForLine]
  );
  const downArrivals = useMemo(
    () => arrivalsForLine.filter(a => a.updnLine?.includes('하행')),
    [arrivalsForLine]
  );

  // 가장 임박한 1건만 보여주고 싶을 때(간단 출력용)
  const firstUp = upArrivals[0];
  const firstDown = downArrivals[0];
  /* --------------------------------------------------------------------------- */

  return (
    <>
      {/* 타이틀 */}
      {subwayInfo?.STATION_NM && (
        <div className="subway-detail__title">
          <div className="subway-detail__line-chip"></div>
          <h1>{subwayInfo.STATION_NM}</h1>
          <div className="subway-detail__line-chip"></div>
        </div>
      )}

      {/* 노선 뱃지 (01호선 → 1호선으로 표시) */}
      {subwayInfo?.LINE_NUM && (
        <div className="subway-detail__line-badges">
          <div className="subway-detail__line-badge">
            {String(subwayInfo.LINE_NUM).replace(/^0+/, '')}
          </div>
        </div>
      )}

      {/* 상행/하행 간단 출력 (각 1건씩) */}
      {(firstUp || firstDown) && (
        <div className="subway-detail__content">
          {/* 상행 */}
          <div className="subway-detail__info">
            <h3>상행</h3>
            {firstUp ? (
              <p>
                <strong>{firstUp.trainLineNm}</strong>
                {typeof firstUp.barvlDt !== 'undefined' && ` · ${formatEta(firstUp.barvlDt)}`}
              </p>
            ) : (
              <p>상행 정보 없음</p>
            )}
          </div>

          {/* 하행 */}
          <div className="subway-detail__info">
            <h3>하행</h3>
            {firstDown ? (
              <p>
                <strong>{firstDown.trainLineNm}</strong>
                {typeof firstDown.barvlDt !== 'undefined' && ` · ${formatEta(firstDown.barvlDt)}`}
              </p>
            ) : (
              <p>하행 정보 없음</p>
            )}
          </div>
        </div>
      )}

      {/* 여러 건 모두 목록으로 보고 싶으면 위 블록 대신 아래 주석 해제해서 사용 */}
      {/*
      {(upArrivals.length > 0 || downArrivals.length > 0) && (
        <div className="subway-detail__content">
          <div className="subway-detail__info">
            <h3>상행</h3>
            {upArrivals.length ? (
              <ul>
                {upArrivals.map((a, i) => (
                  <li key={`up-${i}`}>
                    <strong>{a.trainLineNm}</strong>
                    {typeof a.barvlDt !== 'undefined' && ` · ${formatEta(a.barvlDt)}`}
                  </li>
                ))}
              </ul>
            ) : (
              <p>상행 정보 없음</p>
            )}
          </div>

          <div className="subway-detail__info">
            <h3>하행</h3>
            {downArrivals.length ? (
              <ul>
                {downArrivals.map((a, i) => (
                  <li key={`down-${i}`}>
                    <strong>{a.trainLineNm}</strong>
                    {typeof a.barvlDt !== 'undefined' && ` · ${formatEta(a.barvlDt)}`}
                  </li>
                ))}
              </ul>
            ) : (
              <p>하행 정보 없음</p>
            )}
          </div>
        </div>
      )}
      */}
    </>
  );
}

export default SubwayStationDetail;
