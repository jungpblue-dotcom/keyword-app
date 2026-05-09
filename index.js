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

function cleanKeyword(k) {
  return k
    .replace("방치하면 위험", "")
    .replace("위험", "")
    .trim();
}







// 🔥 글 생성 (안정 버전)


async function generatePost(keyword) {

  const clean = cleanKeyword(keyword);

  return `
${clean}… 그냥 넘기셨나요?

이 증상, 시간이 지나면 더 큰 문제로 이어질 수 있습니다.

특히 40~60대라면 지금부터 꼭 확인하셔야 합니다.

---

📌 ${clean}, 왜 생기는 걸까?

대부분의 사람들은 단순 피로 또는 나이 때문이라고 생각합니다.  
하지만 실제로는 생활 습관이나 몸의 변화에서 시작되는 경우가 많습니다.

---

⚠️ 이런 증상이 있다면 이미 시작된 겁니다

✔ 평소보다 자주 느껴지는 불편함  
✔ 일상에서 반복되는 작은 변화  
✔ 시간이 갈수록 심해지는 패턴  

이 중 하나라도 해당된다면 그냥 넘기시면 안 됩니다.

---

🚨 방치하면 이렇게 됩니다

처음에는 가볍게 느껴지지만, 점점 일상에 영향을 주기 시작합니다.  
결국 병원 치료까지 이어지는 경우도 많습니다.

👉 많은 분들이 “그때 관리할 걸…” 하고 후회합니다.

---

💡 지금부터 이렇게 관리하세요

✔ 생활 습관 점검  
✔ 무리하지 않는 몸 관리  
✔ 증상 기록하기  

작은 실천이 가장 큰 차이를 만듭니다.

---

👉 지금 이 글을 보고 있다면 이미 신호를 느끼신 겁니다.

오늘부터라도 꼭 체크해 보세요.
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
