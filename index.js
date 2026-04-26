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

// 엔터 실행
document.getElementById("q").addEventListener("keypress", function(e) {
  if (e.key === "Enter") search();
});

// 자동완성 (안정 버전)
async function getAutoKeywords(seed) {
  try {
    const res = await fetch(`https://api.datamuse.com/words?ml=${seed}`);
    const data = await res.json();
    return data.slice(0, 5).map(d => d.word);
  } catch {
    return [];
  }
}

// 점수
function makeResult(k) {
  let score = 0;

  if (k.includes("증상")) score += 4;
  if (k.includes("초기")) score += 3;
  if (k.includes("이유")) score += 4;
  if (k.includes("방법")) score += 3;
  if (k.includes("위험")) score += 4;

  if (k.length >= 12) score += 2;

  let tag = "일반 키워드";
  if (score >= 8) tag = "🟡🔥 황금 키워드";
  else if (score >= 5) tag = "🟢 홈판 키워드";

  return { keyword: k, score, tag };
}

// 기본 키워드
function generateKeywords(seed) {
  return [
    `${seed} 증상`,
    `${seed} 원인`,
    `${seed} 치료 방법`,
    `${seed} 방치하면 위험`
  ].map(makeResult);
}

async function generatePost(keyword) {
  const apiKey = "여기에_API_KEY_넣기";

  const prompt = `
  블로그 글 작성

  주제: ${keyword}

  조건:
  - 40~60대 대상
  - 네이버 블로그 스타일
  - 제목 3개
  - 소제목 4개
  - 본문 1500자
  - 쉽게 설명
  - 마지막에 행동 유도 문장 포함
  `;

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + apiKey
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }]
    })
  });

  const data = await res.json();
  return data.choices[0].message.content;
}


// 실행
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

// 복사
window.copyText = function (text) {
  navigator.clipboard.writeText(text);
};

// 전체 복사
window.copyAll = function () {
  const items = document.querySelectorAll("#result b");
  let text = "";
  items.forEach(i => text += i.innerText + "\n");
  navigator.clipboard.writeText(text);
};
