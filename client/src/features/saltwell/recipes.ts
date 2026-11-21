import type { Meal } from "@/lib/api";

/** Saltwell's own recipes. IDs start with "sw-" so they never collide with TheMealDB ids. */
export const LOCAL_PREFIX = "sw-";

const ing = (name: string, measure = ""): Meal["ingredients"][number] => ({ name, measure });

export const LOCAL_RECIPES: Meal[] = [
  {
    id: "sw-chicken-tikka-masala",
    name: "Chicken Tikka Masala",
    thumb: "/images/chicken-tikka-masala.webp",
    category: "Chicken",
    area: "Indian",
    tags: ["Saltwell", "Curry", "50 min", "Serves 4"],
    ingredients: [
      ing("Chicken thigh, cubed", "600g"), ing("Yogurt", "150g"), ing("Tikka masala spice", "2 tbsp"),
      ing("Onion, diced", "1"), ing("Garlic cloves", "3"), ing("Crushed tomatoes", "400g"),
      ing("Cream", "100ml"), ing("Basmati rice & naan", "to serve"),
    ],
    instructions: [
      "Marinate chicken in yogurt and half the spice for 30 min.",
      "Grill or pan-sear chicken until charred; set aside.",
      "Fry onion and garlic, add remaining spice and tomatoes; simmer 15 min.",
      "Stir in cream and chicken; simmer 5 min. Garnish with coriander.",
    ].join("\n"),
  },
  {
    id: "sw-lasagne",
    name: "Classic Beef Lasagne",
    thumb: "/images/lasagne.webp",
    category: "Beef",
    area: "Italian",
    tags: ["Saltwell", "Pasta", "1 h 30 min", "Serves 6"],
    ingredients: [
      ing("Minced beef", "500g"), ing("Onion", "1"), ing("Garlic cloves", "2"), ing("Passata", "700g"),
      ing("Lasagne sheets", "250g"), ing("Béchamel", "500ml"), ing("Mozzarella", "200g"),
      ing("Parmesan & fresh basil", "to top"),
    ],
    instructions: [
      "Brown beef with onion and garlic; add passata and simmer 20 min.",
      "Layer sauce, pasta and béchamel in a baking dish.",
      "Top with mozzarella and parmesan.",
      "Bake at 180°C for 40 min until golden. Rest 10 min.",
    ].join("\n"),
  },
  {
    id: "sw-grilled-salmon",
    name: "Grilled Salmon with Asparagus",
    thumb: "/images/grilled-salmon.webp",
    category: "Seafood",
    area: "Modern",
    tags: ["Saltwell", "Healthy", "25 min", "Serves 2"],
    ingredients: [
      ing("Salmon fillets", "2"), ing("Asparagus", "1 bunch"), ing("Olive oil", "2 tbsp"), ing("Paprika", "1 tsp"),
      ing("Lemon", "1"), ing("Mixed salad, cherry tomatoes, red onion", "to serve"), ing("Parsley, salt & pepper", "to taste"),
    ],
    instructions: [
      "Rub salmon with oil, paprika, salt and pepper.",
      "Grill 4–5 min per side.",
      "Roast or grill asparagus for 6–8 min.",
      "Serve with salad, lemon wedges and parsley.",
    ].join("\n"),
  },
  {
    id: "sw-fish-tacos",
    name: "Blackened Fish Tacos",
    thumb: "/images/fish-tacos.webp",
    category: "Seafood",
    area: "Mexican",
    tags: ["Saltwell", "Tacos", "30 min", "Serves 4"],
    ingredients: [
      ing("White fish fillets", "500g"), ing("Blackening spice", "2 tbsp"), ing("Small corn tortillas", "8"),
      ing("Red cabbage slaw"), ing("Avocado, diced", "1"), ing("Tomato salsa"), ing("Lime-yogurt crema"),
      ing("Coriander & lime", "to serve"),
    ],
    instructions: [
      "Coat fish in spice and sear 3 min per side.",
      "Warm tortillas in a dry pan.",
      "Fill with slaw, flaked fish, avocado and salsa.",
      "Drizzle with crema and serve with lime.",
    ].join("\n"),
  },
  {
    id: "sw-spaghetti-carbonara",
    name: "Spaghetti Carbonara",
    thumb: "/images/spaghetti-carbonara.webp",
    category: "Pasta",
    area: "Italian",
    tags: ["Saltwell", "Pasta", "25 min", "Serves 4"],
    ingredients: [
      ing("Spaghetti", "400g"), ing("Pancetta, diced", "150g"), ing("Eggs + 2 yolks", "3"),
      ing("Pecorino or parmesan", "80g"), ing("Black pepper"), ing("Parsley"),
    ],
    instructions: [
      "Crisp pancetta in a dry pan.",
      "Boil spaghetti; reserve a cup of pasta water.",
      "Whisk eggs, cheese and plenty of pepper.",
      "Off the heat, toss pasta with pancetta and egg mix, loosening with pasta water until creamy.",
    ].join("\n"),
  },
];

export const getLocalRecipe = (id: string) => LOCAL_RECIPES.find((r) => r.id === id);

export const searchLocalRecipes = (q: string) => {
  const s = q.trim().toLowerCase();
  return s ? LOCAL_RECIPES.filter((r) => r.name.toLowerCase().includes(s)) : LOCAL_RECIPES;
};
