document.body.innerHTML = `
  <div style="font-family:sans-serif; max-width:600px; margin:auto; padding:20px;">
    <h2>💰 키워드 생성기</h2>

    <input id="q" placeholder="예: 치매" style="padding:10px; width:70%;" />
    <button onclick="search()" style="padding:10px;">분석</button>

    <div id="result" style="margin-top:20px;"></div>
  </div>
`;

// 🔥 점수 계산 함수
function makeResult(k) {
  let score = 0;

  if (k.includes("증상")) score += 4;
  if (k.includes("초기")) score += 3;
  if (k.includes("수치")) score += 3;
  if (k.includes("식단")) score += 3;
  if (k.includes("관리")) score += 2;

  if (k.includes("이유") || k.includes("문제")) score += 4;
  if (k.includes("자주") || k.includes("갑자기") || k.includes("밤")) score += 3;
  if (k.includes("위험") || k.includes("병")) score += 4;

  if (k.includes("갈증") || k.includes("피로") || k.includes("체중")) score += 3;

  if (k.length >= 12) score += 2;

  let tag = "일반 키워드";
  if (score >= 8) tag = "🟡🔥 황금 키워드";
  else if (score >= 5) tag = "🟢 홈판 키워드";

  return { keyword: k, score, tag };
}

// 🔥 키워드 생성
function generateKeywords(seed) {

  if (seed.includes("치매")) {
    return [
      "치매 초기 증상",
      "치매 진행 속도 무서운 이유",
      "치매 예방 방법",
      "치매 검사 비용",
      "치매 환자 행동 변화"
    ].map(makeResult);
  }

  if (seed.includes("당뇨")) {
    return [
      "당뇨 초기 증상",
      "당뇨 갈증 심한 이유",
      "당뇨 방치하면 위험한 이유",
      "당뇨 수치 낮추는 방법",
      "당뇨 식단 관리 방법"
    ].map(makeResult);
  }

  if (seed.includes("혈압")) {
    return [
      "고혈압 증상",
      "혈압 갑자기 올라가는 이유",
      "혈압 낮추는 방법",
      "혈압 높을 때 증상"
    ].map(makeResult);
  }

  // 기본
  const patterns = [
    `${seed} 자주 마려운 이유`,
    `${seed} 계속 마려운 이유`,
    `${seed} 방치하면 생기는 문제`
  ];

  return patterns.map(makeResult);
}

// 🔥 실행 함수
window.search = function () {
  const q = document.getElementById("q").value;
  const keywords = generateKeywords(q);

  let hot = "";
  let normal = "";

  keywords.forEach(k => {
    const item = `<div style="border:1px solid #ddd; padding:10px; margin:10px 0;">
      <b>${k.keyword}</b><br/>
      👉 ${k.tag}<br/>
      점수: ${k.score}
    </div>`;

    if (k.score >= 8) {
      hot += item;
    } else {
      normal += item;
    }
  });

  document.getElementById("result").innerHTML =
    "<h3>🔥 바로 써야 할 키워드</h3>" + hot +
    "<h3>📌 참고 키워드</h3>" + normal;
};
