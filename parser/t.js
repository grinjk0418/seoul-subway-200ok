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