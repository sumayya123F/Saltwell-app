const grid = document.getElementById("grid");
const modal = document.getElementById("modal");

function el(tag, cls, text) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text) e.textContent = text;
  return e;
}

RECIPES.forEach((r) => {
  const card = el("button", "card");
  const img = el("img");
  img.src = r.cover;
  img.alt = r.title;
  img.loading = "lazy";
  const body = el("div", "card-body");
  body.append(el("h2", "", r.title), el("p", "meta", `${r.time} · Serves ${r.serves}`));
  card.append(img, body);
  card.addEventListener("click", () => openRecipe(r));
  grid.append(card);
});

function openRecipe(r) {
  modal.replaceChildren();
  const img = el("img", "cover");
  img.src = r.cover;
  img.alt = r.title;
  const wrap = el("div", "detail");
  const close = el("button", "close", "×");
  close.setAttribute("aria-label", "Close");
  close.addEventListener("click", () => modal.close());
  const ing = el("ul");
  r.ingredients.forEach((i) => ing.append(el("li", "", i)));
  const steps = el("ol");
  r.steps.forEach((s) => steps.append(el("li", "", s)));
  wrap.append(el("h2", "", r.title), el("p", "meta", `${r.time} · Serves ${r.serves}`),
    el("h3", "", "Ingredients"), ing, el("h3", "", "Method"), steps);
  modal.append(close, img, wrap);
  modal.showModal();
}

modal.addEventListener("click", (e) => { if (e.target === modal) modal.close(); });
