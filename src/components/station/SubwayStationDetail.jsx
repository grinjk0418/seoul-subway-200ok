// src/pages/SubwayStationDetail.jsx
import { useParams } from 'react-router-dom';
import './SubwayStationDetail.css';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useMemo, useState } from 'react';
import { setSubwayInfo } from '../../store/slices/subwayStationDetailSlice';
import { subwayStationIndex } from '../../store/thunks/subwayStationListThunk';
import { realtimeArrivalsIndex } from '../../store/thunks/subwayStationDetailThunk';

// 역ID → 역명 사전 [{ statnId, statnNm }]
import stationCatalog from '../../data/stationNameDict';

/* ====================== 헬퍼 ====================== */

// statnId → 역명
const nameById = (id) =>
  stationCatalog.find(x => String(x.statnId) === String(id))?.statnNm || '';

// "청량리행 - 세마방면" → "청량리행"
const toDest = (s) => {
  const m = (s || '').match(/^(.+?)행/);
  return m ? `${m[1]}행` : '-행';
};

// "[5]번째 전역 (명학)" → "전역 (명학)"
const cleanMsg = (m) => (m || '').replace(/^\s*\[\d+\]\s*번째\s*/,'').trim();

// 도착 코드 라벨
const cdLabel = (cd) => ({
  '0':'진입','1':'도착','2':'출발','3':'전역출발','4':'전역진입','5':'전역도착','99':'운행중'
}[String(cd)] || '');

// 방향 매칭(전 노선 커버: 상/하행, 내/외선, 내/외선순환, 상/하선)
const matchesDir = (value, want) => {
  const v = String(value || '');
  const upAliases   = ['상행', '내선', '내선순환', '상선'];
  const downAliases = ['하행', '외선', '외선순환', '하선'];
  if (want === '상행') return upAliases.some(k => v.includes(k));
  if (want === '하행') return downAliases.some(k => v.includes(k));
  return v.includes(want);
};

// 내/외선(또는 상/하행) 예쁘게 라벨링
const loopLabel = (v='') => {
  if (v.includes('내선')) return '내선';
  if (v.includes('외선')) return '외선';
  if (v.includes('상행') || v.includes('상선')) return '상행';
  if (v.includes('하행') || v.includes('하선')) return '하행';
  return '';
};

// 방향별 가장 가까운 2대 선정 (barvlDt 숫자 우선 오름차순 → 비숫자)
const pickTop2 = (list, wantDir) => {
  const arr = (list || []).filter(a => matchesDir(a?.updnLine, wantDir));
  const withNum = arr.map(a => ({ a, n: Number(a?.barvlDt) }));
  const num = withNum
    .filter(x => Number.isFinite(x.n))
    .sort((x,y)=>x.n-y.n)
    .map(x=>x.a);
  const non = withNum.filter(x => !Number.isFinite(x.n)).map(x=>x.a);
  return [...num, ...non].slice(0,2);
};

// 초 → "X분 Y초 후"
const eta = (sec) => {
  if (sec == null) return null;
  const s = Math.max(0, Math.round(sec));
  if (s <= 0) return '도착';
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m ? `${m}분 ` : ''}${r}초 후`;
};

// [추가] 메시지에서 상태 키워드 추출
const labelFromMsg = (m='') => {
  const s = cleanMsg(m);
  if (!s) return '';
  if (s.includes('전역출발')) return '전역출발';
  if (s.includes('전역진입')) return '전역진입';
  if (s.includes('전역도착')) return '전역도착';
  if (s.includes('진입'))     return '진입';
  if (s.includes('도착'))     return '도착';
  if (s.includes('출발'))     return '출발';
  return '';
};

// [추가] 운행중(99)일 때의 휴리스틱
const textWhenRunning = (a, sec) => {
  // 1) 남은 초가 있으면 그걸 최대한 신뢰
  if (Number.isFinite(sec)) {
    if (sec <= 0)  return '도착';
    if (sec <= 10) return '진입 임박';
    if (sec <= 30) return '접근중';
    return eta(sec); // 30초 초과는 그냥 남은 시간
  }
  // 2) 초가 없으면 메시지에서 추정
  const msgLabel = labelFromMsg(a?.arvlMsg2 || a?.arvlMsg3);
  if (msgLabel) return msgLabel;
  // 3) 그래도 없으면 기본 '운행중'
  return '운행중';
};

// 1줄 표시: 운행중(99)일 때도 sec/메시지로 추정해 보여주기
// [변경] arvlCd 99 개선
const lineText = (a, sec) => {
  if (!a) return '도착 정보 없음';

  // 99(운행중) 특수 처리
  if (String(a.arvlCd) === '99') {
    return textWhenRunning(a, sec);
  }

  // 그 외: 남은 시간이 있으면 우선 시간 표시
  if (Number.isFinite(sec) && sec > 0) {
    return eta(sec);
  }

  // 라벨(코드)이 있으면 라벨
  const label = cdLabel(a.arvlCd);
  if (label) return label;

  // 없으면 메시지로 폴백
  return cleanMsg(a?.arvlMsg2) || '도착 정보 없음';
};

/* ====================== 컴포넌트 ====================== */

function SubwayStationDetail() {
  const { stationId } = useParams();
  const dispatch = useDispatch();

  const subwayList  = useSelector(s => s.subwayStation.subwayList);
  const subwayInfo  = useSelector(s => s.subwayStationDetail.subwayInfo);
  const arrivalList = useSelector(s => s.subwayStationDetail.realtimeArrivalList);

  // 최초: 역목록 로드 → 현재역 찾기 → 실시간 도착 조회
  useEffect(() => {
    if (!subwayList?.length) { dispatch(subwayStationIndex()); return; }
    const item = subwayList.find(it => it.STATION_CD == stationId);
    dispatch(setSubwayInfo(item || {}));
    if (item?.STATION_NM) dispatch(realtimeArrivalsIndex(item.STATION_NM));
  }, [dispatch, stationId, subwayList]);

  // 20초마다 재조회
  useEffect(() => {
    if (!subwayInfo?.STATION_NM) return;
    const t = setInterval(() => dispatch(realtimeArrivalsIndex(subwayInfo.STATION_NM)), 20000);
    return () => clearInterval(t);
  }, [dispatch, subwayInfo?.STATION_NM]);

  // 방향별 2대 (상/하행 alias 대응)
  const upArr   = useMemo(() => pickTop2(arrivalList, '상행'), [arrivalList]);
  const downArr = useMemo(() => pickTop2(arrivalList, '하행'), [arrivalList]);
  const [up1, up2]       = upArr;
  const [down1, down2]   = downArr;

  // 방면(첫번째 열차의 다음역 → 없으면 이전역)
  const upDirName   = up1   ? (nameById(up1.statnTid)   || nameById(up1.statnFid))   : '';
  const downDirName = down1 ? (nameById(down1.statnTid) || nameById(down1.statnFid)) : '';

  // 카운트다운(초) 상태 (목록 바뀌면 초기화)
  const [upSecs, setUpSecs]     = useState([null, null]);
  const [downSecs, setDownSecs] = useState([null, null]);

  useEffect(() => {
    setUpSecs([
      Number.isFinite(+up1?.barvlDt)   ? +up1.barvlDt   : null,
      Number.isFinite(+up2?.barvlDt)   ? +up2.barvlDt   : null
    ]);
    setDownSecs([
      Number.isFinite(+down1?.barvlDt) ? +down1.barvlDt : null,
      Number.isFinite(+down2?.barvlDt) ? +down2.barvlDt : null
    ]);
  }, [up1?.barvlDt, up2?.barvlDt, down1?.barvlDt, down2?.barvlDt]);

  // 1초마다 -1
  useEffect(() => {
    const t = setInterval(() => {
      setUpSecs(([a,b])   => [a==null?null:Math.max(0,a-1),   b==null?null:Math.max(0,b-1)]);
      setDownSecs(([a,b]) => [a==null?null:Math.max(0,a-1),   b==null?null:Math.max(0,b-1)]);
    }, 1000);
    return () => clearInterval(t);
  }, []);

  // 컴포넌트들
  const DirChip = ({ dirName, align }) => (
    <div className={`chip-row ${align==='right' ? 'chip-row-right' : 'chip-row-left'}`}>
      <div className="chip">
        <span className="chip-text">
          {dirName ? `${dirName} 방면` : '방면 정보 없음'}
        </span>
      </div>
    </div>
  );

  const TrainRow = ({ a, sec }) => (
    <div className="detail-row">
      <h4>
        {toDest(a?.trainLineNm)}
        {a?.updnLine ? (
          <span style={{ opacity: 0.65, marginLeft: 6, fontSize: '.9em' }}>
            · {loopLabel(a.updnLine)}
          </span>
        ) : null}
      </h4>
      <p><span className="detail-eta">{lineText(a, sec)}</span></p>
      {/* [선택] 아래 한 줄 더 보여주고 싶으면 주석 해제
      {a?.arvlMsg2 && <p style={{opacity:.7, fontSize:'.9em'}}>{cleanMsg(a.arvlMsg2)}</p>}
      */}
    </div>
  );

  // UI
  return (
    <div className="subway-station-detail-scope">
      <div className="detail-stage">
        <div className="detail-root">
          {/* 현재역 헤더 */}
          <div className="detail-switch">
            <div className="detail-switch-center">
              {subwayInfo?.LINE_NUM && (
                <span className="detail-switch-linebadge">
                  {String(subwayInfo.LINE_NUM).replace(/^0+/, '')}
                </span>
              )}
              <span className="detail-switch-current">
                {subwayInfo?.STATION_NM || '역 이름 불러오는 중…'}
              </span>
            </div>
          </div>

          {/* 좌/우 카드 */}
          <div className="detail-two-col">
            {/* 상행 */}
            <section className="detail-section">
              <DirChip dirName={upDirName} />
              <div className="detail-card">
                <TrainRow a={up1}   sec={upSecs[0]} />
                {up2 && <TrainRow a={up2} sec={upSecs[1]} />}
                <div className="detail-row"><h4>첫차</h4><p>몇시 몇분</p></div>
                <div className="detail-row"><h4>막차</h4><p>몇시 몇분</p></div>
              </div>
            </section>

            {/* 하행 */}
            <section className="detail-section">
              <DirChip dirName={downDirName} align="right" />
              <div className="detail-card">
                <TrainRow a={down1}   sec={downSecs[0]} />
                {down2 && <TrainRow a={down2} sec={downSecs[1]} />}
                <div className="detail-row"><h4>첫차</h4><p>몇시 몇분</p></div>
                <div className="detail-row"><h4>막차</h4><p>몇시 몇분</p></div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SubwayStationDetail;
