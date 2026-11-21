const KEY = "pantree-recipes";
const $ = (id) => document.getElementById(id);
let recipes = [];
let editingId = null;
let viewingId = null;

const SAMPLES = [
  { id: "s1", name: "Fluffy Pancakes",
    ingredients: ["1 1/2 cups flour", "3 1/2 tsp baking powder", "1 tbsp sugar", "1 1/4 cups milk", "1 egg", "3 tbsp melted butter"],
    steps: ["Mix the flour, baking powder and sugar.", "Whisk in the milk, egg and butter until just combined.", "Cook 1/4 cup of batter at a time on a hot, lightly oiled pan.", "Flip when bubbles form, and cook until golden."] },
  { id: "s2", name: "Spaghetti Aglio e Olio",
    ingredients: ["200 g spaghetti", "4 cloves garlic, sliced", "1/3 cup olive oil", "1/2 tsp chilli flakes", "Fresh parsley", "Salt"],
    steps: ["Boil the spaghetti in salted water until al dente.", "Gently fry the garlic in olive oil until pale golden.", "Add the chilli flakes, then the drained pasta and a splash of pasta water.", "Toss well and finish with parsley."] },
  { id: "s3", name: "Simple Guacamole",
    ingredients: ["2 ripe avocados", "1/2 small onion, finely chopped", "1 lime, juiced", "1 tomato, diced", "Handful of coriander", "Salt"],
    steps: ["Mash the avocados in a bowl.", "Stir in the onion, tomato, coriander and lime juice.", "Season with salt and serve right away."] },
  { id: "s4", name: "Creamy Tomato Soup",
    ingredients: ["1 onion, chopped", "2 cloves garlic", "800 g canned tomatoes", "2 cups vegetable stock", "1/2 cup cream", "Basil, salt and pepper"],
    steps: ["Soften the onion and garlic in a little oil.", "Add the tomatoes and stock, and simmer for 20 minutes.", "Blend until smooth.", "Stir in the cream and basil, and season to taste."] }
];

let stored = null, seeded = null;
try { stored = localStorage.getItem(KEY); seeded = localStorage.getItem(KEY + "-seeded"); } catch {}
try { recipes = JSON.parse(stored) || []; } catch { recipes = []; }
if (!seeded) {
  const have = new Set(recipes.map((r) => r.id));
  recipes = [...recipes, ...SAMPLES.filter((s) => !have.has(s.id))];
  try { localStorage.setItem(KEY, JSON.stringify(recipes)); localStorage.setItem(KEY + "-seeded", "1"); } catch {}
}
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(recipes)); } catch {} };
function addLine(container, value) {
  const div = document.createElement("div");
  div.className = "line";
  const input = document.createElement("input");
  input.value = value || "";
  const x = document.createElement("button");
  x.type = "button"; x.className = "x"; x.textContent = "✕"; x.setAttribute("aria-label", "Remove");
  x.onclick = () => div.remove();
  div.append(input, x);
  container.append(div);
  return input;
}
const fill = (container, items) => { container.innerHTML = ""; (items.length ? items : [""]).forEach((v) => addLine(container, v)); };
const lines = (container) => [...container.querySelectorAll("input")].map((i) => i.value.trim()).filter(Boolean);
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
  fill($("f-ingredients"), recipe ? recipe.ingredients : []);
  fill($("f-steps"), recipe ? recipe.steps : []);
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
$("add-ingredient").onclick = () => addLine($("f-ingredients")).focus();
$("add-step").onclick = () => addLine($("f-steps")).focus();
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
  const data = { name: $("f-name").value.trim(), ingredients: lines($("f-ingredients")), steps: lines($("f-steps")) };
  if (!data.ingredients.length || !data.steps.length) { alert("Add at least one ingredient and one step."); return false; }
  if (editingId) recipes = recipes.map((r) => (r.id === editingId ? { ...r, ...data } : r));
  else recipes.unshift({ id: String(Date.now()), ...data });
  save(); render();
};

render();
if ("serviceWorker" in navigator) navigator.serviceWorker.register("sw.js").catch(() => {});
