const savedKey = "ai-radar-saved";

function formatDate(value) {
  return new Intl.DateTimeFormat("ko-KR", { dateStyle: "full" }).format(new Date(value));
}

function savedIds() {
  return new Set(JSON.parse(localStorage.getItem(savedKey) || "[]"));
}

function setSaved(ids) {
  localStorage.setItem(savedKey, JSON.stringify([...ids]));
}

function render(briefing) {
  document.querySelector("#date").textContent = `${formatDate(briefing.date)} · ${briefing.edition}`;
  document.querySelector("#focus-title").textContent = briefing.focus.title;
  document.querySelector("#focus-summary").textContent = briefing.focus.summary;
  document.querySelector("#read-count").textContent = `${briefing.items.length}개 · ${briefing.totalMinutes}분`;
  document.querySelector("#next-action").textContent = briefing.action;

  const container = document.querySelector("#briefs");
  const template = document.querySelector("#brief-template");
  const saved = savedIds();
  briefing.items.forEach((item) => {
    const node = template.content.cloneNode(true);
    node.querySelector(".tag").textContent = item.tag;
    node.querySelector(".minutes").textContent = `${item.minutes}분`;
    node.querySelector("h3").textContent = item.title;
    node.querySelector(".why").textContent = item.why;
    const link = node.querySelector(".source");
    link.href = item.url;
    link.firstChild.textContent = `${item.source} 원문 보기 `;
    const button = node.querySelector(".save");
    button.setAttribute("aria-pressed", String(saved.has(item.id)));
    button.textContent = saved.has(item.id) ? "저장됨" : "나중에 보기";
    button.addEventListener("click", () => {
      saved.has(item.id) ? saved.delete(item.id) : saved.add(item.id);
      setSaved(saved);
      button.setAttribute("aria-pressed", String(saved.has(item.id)));
      button.textContent = saved.has(item.id) ? "저장됨" : "나중에 보기";
    });
    container.append(node);
  });
}

fetch("./briefs.json").then((response) => response.json()).then(render).catch(() => {
  document.querySelector("#date").textContent = "브리핑을 불러오지 못했습니다. 잠시 후 다시 열어주세요.";
});
