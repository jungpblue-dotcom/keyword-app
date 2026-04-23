document.body.innerHTML = `
  <div style="font-family:sans-serif; max-width:700px; margin:auto; padding:20px;">
    <h2>💰 키워드 생성기</h2>

    <input id="q" placeholder="예: 치매" style="padding:10px; width:60%;" />
    <button onclick="search()" style="padding:10px;">분석</button>
    <button onclick="copyAll()" style="padding:10px;">전체 복사</button>

    <div style="margin-top:10px;">
      <label>
        <input type="checkbox" id="sortCheck" /> 점수 높은 순 정렬
      </label>
    </div>

    <div id="result" style="margin-top:20px;"></div>
  </div>
`;

// 점수 계산
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

  if (k.length >= 12) score += 2;

  let tag = "일반 키워드";
  if (score >= 8) tag = "🟡🔥 황금 키워드";
  else if (score >= 5) tag = "🟢 홈판 키워드";

  return { keyword: k, score, tag };
}

// 키워드 생성
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

 return [
  `${seed} 자주 보는 이유`,
  `${seed} 자주 마려운 이유`,
  `${seed} 계속 마려운 이유`,
  `${seed} 방치하면 생기는 위험`,
  `${seed} 증상과 원인`
].map(makeResult);
}
if (seed.includes("전립선")) {
  return [
    "전립선 비대증 증상",
    "전립선 자주 소변 보는 이유",
    "전립선 비대증 치료 방법",
    "전립선 방치하면 생기는 문제",
    "전립선 초기 증상"
  ].map(makeResult);
}
// 검색 실행
window.search = function () {
  const q = document.getElementById("q").value;
  let keywords = generateKeywords(q);
document.getElementById("q").addEventListener("keypress", function(e) {
  if (e.key === "Enter") {
    search();
  }
});
  // 정렬
  if (document.getElementById("sortCheck").checked) {
    keywords.sort((a, b) => b.score - a.score);
  }

  let html = "";

  keywords.forEach(k => {
    html += `
      <div style="border:1px solid #ddd; padding:10px; margin:10px 0; border-radius:8px;">
        <b>${k.keyword}</b><br/>
        👉 ${k.tag} (점수: ${k.score})
        <button onclick="copyText('${k.keyword}')" style="float:right;">복사</button>
      </div>
    `;
  });

  document.getElementById("result").innerHTML = html;
};

// 개별 복사
window.copyText = function (text) {
  navigator.clipboard.writeText(text);
  alert("복사됨: " + text);
};

// 전체 복사
window.copyAll = function () {
  const items = document.querySelectorAll("#result b");
  let text = "";

  items.forEach(i => {
    text += i.innerText + "\n";
  });

  navigator.clipboard.writeText(text);
  alert("전체 복사 완료");
};
