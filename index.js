document.body.innerHTML = `
  <div style="font-family:sans-serif; max-width:700px; margin:auto; padding:20px;">
    <h2>💰 키워드 생성기</h2>

    <input id="q" placeholder="예: 치매 초기 증상" style="padding:10px; width:60%;" />
    <button onclick="search()" style="padding:10px;">분석</button>
    <button onclick="makePost()" style="padding:10px;">글 생성</button>
    <button onclick="copyAll()" style="padding:10px;">전체 복사</button>

    <div style="margin-top:10px;">
      <label>
        <input type="checkbox" id="sortCheck" /> 점수 높은 순 정렬
      </label>
    </div>

    <div id="result" style="margin-top:20px;"></div>
  </div>
`;

// 엔터 실행
document.getElementById("q").addEventListener("keypress", function(e) {
  if (e.key === "Enter") search();
});

// 자동완성
async function getAutoKeywords(seed) {
  try {
    const res = await fetch(`https://api.datamuse.com/words?ml=${seed}`);
    const data = await res.json();
    return data.slice(0, 5).map(d => d.word);
  } catch {
    return [];
  }
}

// 점수 시스템
function makeResult(k) {
  let score = 0;

  if (k.includes("초기")) score += 5;
  if (k.includes("증상")) score += 4;
  if (k.includes("원인")) score += 4;
  if (k.includes("이유")) score += 4;

  if (k.includes("방법")) score += 4;
  if (k.includes("치료")) score += 4;
  if (k.includes("해결")) score += 4;

  if (k.includes("위험")) score += 5;
  if (k.includes("방치")) score += 5;

  if (k.length >= 10) score += 2;

  let tag = "일반 키워드";
  if (score >= 9) tag = "🟡🔥 황금 키워드";
  else if (score >= 6) tag = "🟢 홈판 키워드";

  return { keyword: k, score, tag };
}

// 키워드 생성 (중복 제거 포함)
function generateKeywords(seed) {
  let results = [];

  if (!seed.includes("증상")) results.push(`${seed} 증상`);
  if (!seed.includes("원인")) results.push(`${seed} 원인`);
  if (!seed.includes("치료")) results.push(`${seed} 치료 방법`);
  if (!seed.includes("위험")) results.push(`${seed} 방치하면 위험`);

  return results.map(makeResult);
}

// 🔥 글 생성 (안정 버전)
async function generatePost(keyword) {
  return `
[제목 후보]
1. ${keyword} 꼭 알아야 할 핵심 정보
2. ${keyword} 지금 확인해야 하는 이유
3. ${keyword} 방치하면 위험한 이유

[소제목]
1. ${keyword}이란 무엇인가
2. 주요 원인
3. 대표 증상
4. 관리 및 예방 방법

[본문]
${keyword}은 많은 분들이 가볍게 넘기기 쉬운 문제지만, 실제로는 조기에 관리하지 않으면 큰 위험으로 이어질 수 있습니다.

특히 중장년층에서는 초기 신호를 놓치기 쉽기 때문에 평소와 다른 변화가 있다면 반드시 체크해야 합니다.

대표적인 특징으로는 일상생활에서의 작은 불편함부터 시작됩니다. 이러한 증상은 시간이 지날수록 점점 심해질 수 있기 때문에 초기 대응이 매우 중요합니다.

관리 방법으로는 생활 습관 개선과 정기적인 건강 체크가 필수입니다. 또한 무리한 자기 판단보다는 전문가 상담을 병행하는 것이 안전합니다.

지금 바로 자신의 상태를 점검해 보시고, 작은 이상이라도 느껴진다면 미루지 말고 관리 시작해 보세요.
`;
}

// 검색 실행
window.search = async function () {
  const q = document.getElementById("q").value;

  let base = generateKeywords(q);
  let auto = await getAutoKeywords(q);
  let autoResults = auto.map(makeResult);

  let keywords = [...base, ...autoResults];

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

// 키워드 복사
window.copyText = function (text) {
  navigator.clipboard.writeText(text);
};

// 전체 키워드 복사
window.copyAll = function () {
  const items = document.querySelectorAll("#result b");
  let text = "";
  items.forEach(i => text += i.innerText + "\n");
  navigator.clipboard.writeText(text);
};

// 글 생성 실행
window.makePost = async function () {
  const q = document.getElementById("q").value;

  document.getElementById("result").innerHTML = "글 생성 중...";

  const post = await generatePost(q);

  document.getElementById("result").innerHTML = `
    <textarea style="width:100%; height:400px; padding:10px;">${post}</textarea>
    <br/><br/>
    <button onclick="copyPost()">전체 복사</button>
  `;
};

// 글 복사
window.copyPost = function () {
  const text = document.querySelector("textarea").value;
  navigator.clipboard.writeText(text);
  alert("글 복사 완료!");
};
