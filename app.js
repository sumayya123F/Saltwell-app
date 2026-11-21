const KEY = "pantree-recipes";
const $ = (id) => document.getElementById(id);
let recipes = [];
let editingId = null;
let viewingId = null;

try { recipes = JSON.parse(localStorage.getItem(KEY)) || []; } catch { recipes = []; }
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(recipes)); } catch {} };
const lines = (s) => s.split("\n").map((x) => x.trim()).filter(Boolean);
const esc = (s) => s.replace(/[&<>"']/g, (c) => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;" }[c]));

function render() {
  const q = $("search").value.trim().toLowerCase();
  const shown = recipes.filter((r) =>
    !q || r.name.toLowerCase().includes(q) || r.ingredients.some((i) => i.toLowerCase().includes(q)));
  $("empty").hidden = recipes.length > 0;
  $("list").innerHTML = shown.map((r) =>
    `<li data-id="${r.id}"><h3>${esc(r.name)}</h3><p>${r.ingredients.length} ingredients · ${r.steps.length} steps</p></li>`).join("");
}

function openForm(recipe) {
  editingId = recipe ? recipe.id : null;
  $("form-title").textContent = recipe ? "Edit recipe" : "New recipe";
  $("f-name").value = recipe ? recipe.name : "";
  $("f-ingredients").value = recipe ? recipe.ingredients.join("\n") : "";
  $("f-steps").value = recipe ? recipe.steps.join("\n") : "";
  $("form-dialog").showModal();
}

function openView(id) {
  const r = recipes.find((x) => x.id === id);
  if (!r) return;
  viewingId = id;
  $("view").innerHTML =
    `<h2>${esc(r.name)}</h2><h3>Ingredients</h3><ul>${r.ingredients.map((i) => `<li>${esc(i)}</li>`).join("")}</ul>` +
    `<h3>Steps</h3><ol>${r.steps.map((s) => `<li>${esc(s)}</li>`).join("")}</ol>`;
  $("view-dialog").showModal();
}

$("add").onclick = () => openForm(null);
$("cancel").onclick = () => $("form-dialog").close();
$("close").onclick = () => $("view-dialog").close();
$("search").oninput = render;
$("list").onclick = (e) => { const li = e.target.closest("li"); if (li) openView(li.dataset.id); };
$("edit").onclick = () => { const r = recipes.find((x) => x.id === viewingId); $("view-dialog").close(); openForm(r); };
$("delete").onclick = () => {
  if (!confirm("Delete this recipe?")) return;
  recipes = recipes.filter((x) => x.id !== viewingId);
  save(); render(); $("view-dialog").close();
};
$("form").onsubmit = () => {
  const data = { name: $("f-name").value.trim(), ingredients: lines($("f-ingredients").value), steps: lines($("f-steps").value) };
  if (editingId) recipes = recipes.map((r) => (r.id === editingId ? { ...r, ...data } : r));
  else recipes.unshift({ id: String(Date.now()), ...data });
  save(); render();
};

render();
if ("serviceWorker" in navigator) navigator.serviceWorker.register("sw.js").catch(() => {});
