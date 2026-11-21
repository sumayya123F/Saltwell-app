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

// Recipes brought over from the old Saltwell app.
const SALTWELL = [
  {
    "id": "sw-chicken-tikka-masala",
    "name": "Chicken Tikka Masala",
    "ingredients": [
      "600g Chicken thigh, cubed",
      "150g Yogurt",
      "2 tbsp Tikka masala spice",
      "1 Onion, diced",
      "3 Garlic cloves",
      "400g Crushed tomatoes",
      "100ml Cream",
      "Basmati rice & naan (to serve)"
    ],
    "steps": [
      "Marinate chicken in yogurt and half the spice for 30 min.",
      "Grill or pan-sear chicken until charred; set aside.",
      "Fry onion and garlic, add remaining spice and tomatoes; simmer 15 min.",
      "Stir in cream and chicken; simmer 5 min. Garnish with coriander."
    ]
  },
  {
    "id": "sw-lasagne",
    "name": "Classic Beef Lasagne",
    "ingredients": [
      "500g Minced beef",
      "1 Onion",
      "2 Garlic cloves",
      "700g Passata",
      "250g Lasagne sheets",
      "500ml Béchamel",
      "200g Mozzarella",
      "Parmesan & fresh basil (to top)"
    ],
    "steps": [
      "Brown beef with onion and garlic; add passata and simmer 20 min.",
      "Layer sauce, pasta and béchamel in a baking dish.",
      "Top with mozzarella and parmesan.",
      "Bake at 180°C for 40 min until golden. Rest 10 min."
    ]
  },
  {
    "id": "sw-grilled-salmon",
    "name": "Grilled Salmon with Asparagus",
    "ingredients": [
      "2 Salmon fillets",
      "1 bunch Asparagus",
      "2 tbsp Olive oil",
      "1 tsp Paprika",
      "1 Lemon",
      "Mixed salad, cherry tomatoes, red onion (to serve)",
      "Parsley, salt & pepper (to taste)"
    ],
    "steps": [
      "Rub salmon with oil, paprika, salt and pepper.",
      "Grill 4–5 min per side.",
      "Roast or grill asparagus for 6–8 min.",
      "Serve with salad, lemon wedges and parsley."
    ]
  },
  {
    "id": "sw-fish-tacos",
    "name": "Blackened Fish Tacos",
    "ingredients": [
      "500g White fish fillets",
      "2 tbsp Blackening spice",
      "8 Small corn tortillas",
      "Red cabbage slaw",
      "1 Avocado, diced",
      "Tomato salsa",
      "Lime-yogurt crema",
      "Coriander & lime (to serve)"
    ],
    "steps": [
      "Coat fish in spice and sear 3 min per side.",
      "Warm tortillas in a dry pan.",
      "Fill with slaw, flaked fish, avocado and salsa.",
      "Drizzle with crema and serve with lime."
    ]
  },
  {
    "id": "sw-spaghetti-carbonara",
    "name": "Spaghetti Carbonara",
    "ingredients": [
      "400g Spaghetti",
      "150g Pancetta, diced",
      "3 Eggs + 2 yolks",
      "80g Pecorino or parmesan",
      "Black pepper",
      "Parsley"
    ],
    "steps": [
      "Crisp pancetta in a dry pan.",
      "Boil spaghetti; reserve a cup of pasta water.",
      "Whisk eggs, cheese and plenty of pepper.",
      "Off the heat, toss pasta with pancetta and egg mix, loosening with pasta water until creamy."
    ]
  },
  {
    "id": "sw-vegetable-stir-fry",
    "name": "Vegetable Stir Fry",
    "ingredients": [
      "1 head Broccoli",
      "2 Carrot",
      "1 Bell pepper",
      "3 tbsp Soy sauce",
      "1 thumb Ginger",
      "1 tsp Sesame oil"
    ],
    "steps": [
      "Cut vegetables into even, bite-size pieces.",
      "Stir fry ginger in a very hot wok for 15 seconds.",
      "Add carrots and broccoli first, then pepper; cook 4 to 5 minutes.",
      "Season with soy sauce and finish with sesame oil."
    ]
  },
  {
    "id": "sw-mushroom-risotto",
    "name": "Mushroom Risotto",
    "ingredients": [
      "300 g Arborio rice",
      "300 g Mushrooms",
      "1 L Vegetable stock",
      "100 ml White wine",
      "50 g Parmesan"
    ],
    "steps": [
      "Keep the stock hot in a pan beside the stove.",
      "Brown the mushrooms; set aside.",
      "Toast rice with onion, add wine, then stock a ladle at a time, stirring.",
      "After about 18 minutes fold in mushrooms and parmesan."
    ]
  },
  {
    "id": "sw-lemon-roast-chicken",
    "name": "Lemon Roast Chicken",
    "ingredients": [
      "1.6 kg Whole chicken",
      "1 Lemon",
      "50 g Butter",
      "6 sprigs Thyme",
      "800 g Potatoes"
    ],
    "steps": [
      "Rub the chicken with butter and season generously.",
      "Stuff the cavity with lemon and thyme.",
      "Roast at 200°C for 1 hour 15 minutes with potatoes underneath.",
      "Rest 15 minutes before carving."
    ]
  }
];
SAMPLES.push(...SALTWELL);

const ADMIN_KEY = "pantree-admin-code";
let admin = false;
let adminCode = "";
try { adminCode = sessionStorage.getItem(ADMIN_KEY) || localStorage.getItem(ADMIN_KEY) || ""; } catch {}

const CACHE_KEY = "pantree-last-list";
recipes = SAMPLES.slice();   // built-in recipes until the shared list loads
try { const c = JSON.parse(localStorage.getItem(CACHE_KEY)); if (Array.isArray(c)) recipes = c; } catch {}  // last list seen, so it works offline

async function load() {
  try {
    const r = await fetch("/api/recipes", { cache: "no-store" });
    const j = await r.json();
    if (Array.isArray(j.recipes)) {
      recipes = j.recipes;
      try { localStorage.setItem(CACHE_KEY, JSON.stringify(recipes)); } catch {}
    }
  } catch {}
  if (adminCode) await checkAdmin(adminCode, true);
  render();
}

async function api(body) {
  const r = await fetch("/api/recipes", {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-admin-code": adminCode },
    body: JSON.stringify(body),
  });
  return r.ok;
}

async function checkAdmin(code, quiet) {
  const prev = adminCode;
  adminCode = code;
  let ok = false;
  try { ok = await api({ action: "check" }); } catch {}
  admin = ok;
  if (ok) { try { localStorage.setItem(ADMIN_KEY, code); } catch {} }
  else { adminCode = quiet ? "" : prev; try { localStorage.removeItem(ADMIN_KEY); } catch {} if (!quiet) alert("Wrong code."); }
  return ok;
}

async function save() {
  let ok = false;
  try { ok = await api({ recipes }); } catch {}
  if (ok) { try { localStorage.setItem(CACHE_KEY, JSON.stringify(recipes)); } catch {} }
  if (!ok) alert("Could not save. Check your internet and that the owner code is still valid.");
}
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
  $("add").hidden = !admin;
  $("owner").textContent = admin ? "Owner: sign out" : "Owner sign in";
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
  $("edit").hidden = !admin;
  $("delete").hidden = !admin;
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
$("owner").onclick = async () => {
  if (admin) { admin = false; adminCode = ""; try { localStorage.removeItem(ADMIN_KEY); } catch {} render(); return; }
  const code = prompt("Owner code:");
  if (code && (await checkAdmin(code.trim()))) render();
};
$("form").onsubmit = () => {
  const data = { name: $("f-name").value.trim(), ingredients: lines($("f-ingredients")), steps: lines($("f-steps")) };
  if (!data.ingredients.length || !data.steps.length) { alert("Add at least one ingredient and one step."); return false; }
  if (editingId) recipes = recipes.map((r) => (r.id === editingId ? { ...r, ...data } : r));
  else recipes.unshift({ id: String(Date.now()), ...data });
  save(); render();
};

render();
load();
if ("serviceWorker" in navigator) navigator.serviceWorker.register("sw.js").catch(() => {});
