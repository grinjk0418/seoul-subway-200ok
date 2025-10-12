import fs from 'fs';
import readline from 'readline';
import path from 'path';

const dirPath = path.resolve('parser');
const filePath = path.resolve('parser/20251002.txt');
const stream = fs.createReadStream(filePath);
const reader = readline.createInterface({
  input: stream,
  crlfDelay: Infinity
});

test(reader)
.then(result => {
  const resultFilePath = `${dirPath}/test.js`;
  fs.writeFileSync(resultFilePath, 'export default ');
  fs.appendFileSync(`${dirPath}/test.js`, JSON.stringify(result, null, 2));
});

async function test(reader) {
  const result = [];
  for await(const line of reader) {
    const trimLine = line.trim();
    if(!trimLine) {
      continue;
    }

    const [subwayId, statnId, statnNm, lineKoran] = trimLine.split('\t');
    result.push({
      subwayId: subwayId,
      statnId: statnId,
      statnNm: statnNm,
      lineKoran: lineKoran
    });
  }

  return result;
}

//엑셀파일을 메모장(확장자: .txt , 인코딩: UTF-8)으로 변경 (한글 제목X)

//터미널에서 칠 실행코드 : node parser/t.js 
//치면 제이슨 파일 생김
//제이슨 파일을 '컨트롤+쉬프트+L' 단축키로 프로퍼티의 "" 제거해서 객체 형태로 다시 변경