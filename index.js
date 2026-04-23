document.body.innerHTML = `
  <div style="font-family:sans-serif; max-width:600px; margin:auto; padding:20px;">
    <h2>?? 키워드 생성기</h2>

    <input id="q" placeholder="예: 소변" style="padding:10px; width:70%;" />
    <button onclick="search()" style="padding:10px;">분석</button>

    <div id="result" style="margin-top:20px;"></div>
  </div>
`;

// ?? 공통 점수 함수

function makeResult(k) {
  let score = 0;

  // ?? 정보형 핵심 키워드
  if (k.includes("증상")) score += 4;
  if (k.includes("초기")) score += 3;
  if (k.includes("수치")) score += 3;
  if (k.includes("식단")) score += 3;
  if (k.includes("관리")) score += 2;

  // ?? 클릭 유도 키워드
  if (k.includes("이유") || k.includes("문제")) score += 4;
  if (k.includes("자주") || k.includes("갑자기") || k.includes("밤"))
    score += 3;
  if (k.includes("위험") || k.includes("병")) score += 4;
  if (k.includes("갈증") || k.includes("피로") || k.includes("체중"))
    score += 3;
  // ?? 길이 보너스
  if (k.length >= 12) score += 2;

  let tag = "일반 키워드";
  if (score >= 8) tag = "???? 황금 키워드";
  else if (score >= 5) tag = "?? 홈판 키워드";

  return { keyword: k, score, tag };
}
// ?? 키워드 생성 (여기가 핵심)
function generateKeywords(seed) {
  if (seed.includes("당뇨")) {
    return [
      "당뇨 초기 증상",
      "당뇨 증상 자주 소변",
      "당뇨 갈증 심한 이유",
      "당뇨 방치하면 위험한 이유",
      "당뇨 수치 낮추는 방법",
      "당뇨 식단 관리 방법",
    ].map(makeResult);
  }

  if (seed.includes("혈압")) {
    return [
      "고혈압 증상",
      "혈압 갑자기 올라가는 이유",
      "혈압 낮추는 방법",
      "혈압 높을 때 증상",
      "혈압 약 먹어야 하는 기준",
    ].map(makeResult);
  }

  // 기본 패턴
  const patterns = [
    `${seed} 자주 마려운 이유`,
    `${seed} 계속 마려운 이유`,
    `${seed} 갑자기 많아지는 이유`,
    `밤에 ${seed} 자주 보는 이유`,
    `${seed} 너무 자주 보면 병인가`,
    `${seed} 방치하면 생기는 문제`,
  ];

  return patterns.map(makeResult);
}

// ?? 실행 함수
window.search = function () {
  const q = document.getElementById("q").value;
  const keywords = generateKeywords(q);

  let html = "";

  keywords.forEach((k) => {
    html += `<div style="border:1px solid #ddd; padding:10px; margin:10px 0;">
      <b>${k.keyword}</b><br/>
      ?? ${k.tag}<br/>
      점수: ${k.score}
    </div>`;
  });

  document.getElementById("result").innerHTML = html;
};
