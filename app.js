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

// Indonesian recipes (added in built-in version 2).
const INDONESIAN = [
  {
    "id": "id-nasi-goreng",
    "name": "Nasi Goreng",
    "ingredients": [
      "3 cups cooked rice, cold",
      "3 shallots, sliced",
      "3 cloves garlic, minced",
      "2 red chillies, sliced",
      "2 tbsp kecap manis (sweet soy sauce)",
      "1 tbsp soy sauce",
      "1 tsp shrimp paste (terasi)",
      "2 eggs",
      "200 g chicken or shrimp, diced",
      "Cucumber, tomato and fried shallots (to serve)"
    ],
    "steps": [
      "Fry the shallots, garlic, chillies and shrimp paste in oil until fragrant.",
      "Add the chicken or shrimp and cook through.",
      "Add the cold rice and stir fry on high heat, breaking up clumps.",
      "Season with kecap manis and soy sauce.",
      "Push the rice aside, scramble an egg, then mix it in.",
      "Serve topped with a fried egg, cucumber, tomato and fried shallots."
    ]
  },
  {
    "id": "id-mie-goreng",
    "name": "Mie Goreng",
    "ingredients": [
      "250 g egg noodles",
      "2 cloves garlic, minced",
      "3 shallots, sliced",
      "150 g chicken, sliced",
      "1 cup cabbage or choy sum",
      "1 carrot, thinly sliced",
      "3 tbsp kecap manis",
      "1 tbsp oyster sauce",
      "1 egg",
      "Fried shallots and chilli (to serve)"
    ],
    "steps": [
      "Boil the noodles for 2 minutes, drain and toss with a little oil.",
      "Fry the garlic and shallots until golden, then add the chicken.",
      "Add the vegetables and stir fry for 2 minutes.",
      "Push everything aside, scramble the egg, then mix together.",
      "Add the noodles, kecap manis and oyster sauce, and toss until coated.",
      "Serve with fried shallots and sliced chilli."
    ]
  },
  {
    "id": "id-soto-ayam",
    "name": "Soto Ayam",
    "ingredients": [
      "1 whole chicken, or 800 g thighs",
      "2 L water",
      "3 lemongrass stalks, bruised",
      "4 lime leaves",
      "1 tbsp ground turmeric",
      "5 shallots",
      "4 cloves garlic",
      "2 cm ginger",
      "Rice vermicelli or rice",
      "Boiled eggs, bean sprouts, celery leaf and fried shallots (to serve)",
      "Lime and sambal (to serve)"
    ],
    "steps": [
      "Blend the shallots, garlic, ginger and turmeric into a paste, and fry it until fragrant.",
      "Add the chicken, water, lemongrass and lime leaves, and simmer for 45 minutes.",
      "Remove the chicken, shred the meat, and strain the broth.",
      "Season the broth with salt and pepper.",
      "Place noodles in a bowl, add chicken, egg and sprouts, then pour over the hot broth.",
      "Top with fried shallots, celery leaf, lime and sambal."
    ]
  },
  {
    "id": "id-beef-rendang",
    "name": "Beef Rendang",
    "ingredients": [
      "1 kg beef chuck, cubed",
      "400 ml coconut milk",
      "5 shallots",
      "4 cloves garlic",
      "3 cm ginger",
      "3 cm galangal",
      "8 dried red chillies, soaked",
      "2 lemongrass stalks, bruised",
      "4 lime leaves",
      "1 tbsp tamarind paste",
      "2 tbsp toasted grated coconut",
      "Salt and palm sugar"
    ],
    "steps": [
      "Blend the shallots, garlic, ginger, galangal and chillies into a paste.",
      "Fry the paste for 5 minutes, then add the beef, lemongrass and lime leaves.",
      "Pour in the coconut milk and tamarind, and bring to a boil.",
      "Simmer gently for 2.5 to 3 hours, stirring often, until the sauce is thick and dark.",
      "Stir in the toasted coconut near the end.",
      "Season with salt and palm sugar, and serve with rice."
    ]
  },
  {
    "id": "id-gado-gado",
    "name": "Gado-Gado",
    "ingredients": [
      "200 g green beans",
      "2 potatoes, boiled",
      "1 cup bean sprouts",
      "1/2 cabbage, shredded",
      "200 g tofu or tempeh, fried",
      "2 boiled eggs",
      "1 cucumber, sliced",
      "Prawn crackers (krupuk)",
      "150 g roasted peanuts",
      "2 cloves garlic",
      "1 red chilli",
      "2 tbsp palm sugar",
      "1 tbsp tamarind water",
      "200 ml warm water"
    ],
    "steps": [
      "Blanch the green beans, sprouts and cabbage for 1 to 2 minutes each, then cool.",
      "Grind the peanuts, garlic, chilli, palm sugar and a pinch of salt into a rough paste.",
      "Stir in the tamarind water and warm water to make a thick sauce.",
      "Arrange the vegetables, potato, tofu, egg and cucumber on a plate.",
      "Pour over the peanut sauce and top with prawn crackers."
    ]
  },
  {
    "id": "id-sate-ayam",
    "name": "Chicken Satay (Sate Ayam)",
    "ingredients": [
      "600 g chicken thigh, cubed",
      "2 tbsp kecap manis",
      "1 tbsp vegetable oil",
      "2 cloves garlic, minced",
      "1 tsp ground coriander",
      "20 bamboo skewers, soaked",
      "150 g peanut butter",
      "2 tbsp kecap manis (for sauce)",
      "1 tbsp lime juice",
      "1 chilli, chopped",
      "100 ml warm water",
      "Rice cakes (lontong), sliced shallots and cucumber (to serve)"
    ],
    "steps": [
      "Marinate the chicken in kecap manis, oil, garlic and coriander for at least 30 minutes.",
      "Thread the chicken onto the skewers.",
      "Mix the peanut butter, kecap manis, lime juice, chilli and warm water into a sauce.",
      "Grill the skewers for 8 to 10 minutes, turning, until charred and cooked through.",
      "Serve with the peanut sauce, lontong, shallots and cucumber."
    ]
  },
  {
    "id": "id-ayam-goreng",
    "name": "Ayam Goreng",
    "ingredients": [
      "1 kg chicken pieces",
      "4 shallots",
      "4 cloves garlic",
      "2 cm turmeric, or 1 tsp ground",
      "2 candlenuts or macadamias",
      "1 tsp ground coriander",
      "2 lemongrass stalks, bruised",
      "3 bay leaves",
      "500 ml water",
      "Oil for frying",
      "Sambal and cucumber (to serve)"
    ],
    "steps": [
      "Blend the shallots, garlic, turmeric, candlenuts and coriander into a paste.",
      "Simmer the chicken with the paste, lemongrass, bay leaves, water and salt for 30 minutes.",
      "Drain the chicken and pat it dry.",
      "Deep fry until deep golden and crisp.",
      "Serve with rice, sambal and cucumber."
    ]
  },
  {
    "id": "id-pisang-goreng",
    "name": "Pisang Goreng",
    "ingredients": [
      "6 ripe bananas (pisang raja or plantains)",
      "100 g plain flour",
      "50 g rice flour",
      "2 tbsp sugar",
      "1/4 tsp salt",
      "1/2 tsp baking powder",
      "150 ml cold water",
      "Oil for frying",
      "Grated cheese, chocolate sauce or palm sugar (to serve)"
    ],
    "steps": [
      "Mix the flours, sugar, salt and baking powder.",
      "Whisk in the cold water to make a thin batter.",
      "Slice the bananas lengthways and dip them in the batter.",
      "Fry in hot oil for 2 to 3 minutes per side until golden and crisp.",
      "Drain, and serve warm with cheese, chocolate sauce or palm sugar."
    ]
  }
];
const MORE_INDONESIAN = [
  {
    "id": "id-pempek",
    "name": "Pempek Palembang",
    "ingredients": [
      "300 g white fish fillet, minced (ikan tenggiri or mackerel)",
      "200 g tapioca starch",
      "150 ml ice-cold water",
      "2 cloves garlic, minced",
      "1 tsp salt",
      "1/2 tsp sugar",
      "1 hard-boiled egg per pempek (for pempek kapal selam)",
      "Oil for frying",
      "3 tbsp palm sugar",
      "2 cloves garlic",
      "3 bird's eye chillies",
      "3 tbsp tamarind water",
      "300 ml water",
      "1 tbsp rice vinegar",
      "Cucumber and yellow noodles (to serve)"
    ],
    "steps": [
      "Mix the minced fish, garlic, salt and sugar. Add the ice-cold water gradually.",
      "Knead in the tapioca starch until you have a smooth dough that does not stick to your hands.",
      "Shape into logs or ovals. For pempek kapal selam, wrap the dough around a peeled boiled egg.",
      "Boil in water until they float, about 10 minutes, then drain.",
      "Fry the boiled pempek in hot oil until golden.",
      "For the cuko sauce, boil the palm sugar, garlic, chillies, tamarind water and water for 10 minutes, then add the vinegar and strain.",
      "Serve the pempek sliced, with cuko, cucumber and noodles."
    ]
  },
  {
    "id": "id-bakso",
    "name": "Bakso (Indonesian Meatball Soup)",
    "ingredients": [
      "500 g beef mince",
      "100 g tapioca starch",
      "4 cloves garlic, minced",
      "2 shallots, minced",
      "1 tsp salt",
      "1 tsp white pepper",
      "1 egg white",
      "100 g crushed ice",
      "1.5 L beef stock",
      "2 cloves garlic, fried",
      "Rice noodles or egg noodles",
      "Bok choy or choy sum",
      "Fried shallots, celery leaf and sliced spring onion (to serve)",
      "Sambal, kecap manis and lime (to serve)"
    ],
    "steps": [
      "Blend the beef, garlic, shallots, salt, pepper, egg white and ice into a smooth paste.",
      "Mix in the tapioca starch until sticky.",
      "Bring a pot of salted water to a gentle simmer. Form the paste into balls by squeezing it through your fist, and drop them in.",
      "Cook until the balls float, about 8 minutes, then lift them out.",
      "Heat the stock with the fried garlic and season to taste.",
      "Place cooked noodles and greens in bowls, add the meatballs, and ladle over the hot stock.",
      "Top with fried shallots, celery leaf and spring onion, and serve with sambal, kecap manis and lime."
    ]
  }
];
const EVEN_MORE = [
  {
    "id": "id-es-campur",
    "name": "Es Campur",
    "ingredients": [
      "200 g jackfruit, sliced",
      "1 avocado, cubed",
      "1 young coconut, flesh scraped",
      "100 g grass jelly (cincau), cubed",
      "50 g tapioca pearls, cooked",
      "4 tbsp sweet corn kernels",
      "200 ml sweet condensed milk",
      "400 ml coconut milk or evaporated milk",
      "4 tbsp rose syrup or cocoa syrup",
      "Shaved or crushed ice"
    ],
    "steps": [
      "Prepare all the fruit and toppings and keep them chilled.",
      "Divide the jackfruit, avocado, young coconut, grass jelly, tapioca and corn between four tall glasses.",
      "Fill the glasses with plenty of shaved or crushed ice.",
      "Pour over the milk, then drizzle with condensed milk and rose syrup.",
      "Serve right away with a long spoon."
    ]
  },
  {
    "id": "id-es-cendol",
    "name": "Es Cendol",
    "ingredients": [
      "100 g rice flour",
      "2 tbsp tapioca starch",
      "1 tsp pandan paste, or 10 pandan leaves blended with water",
      "500 ml water",
      "1/4 tsp salt",
      "200 g palm sugar (gula merah)",
      "150 ml water (for syrup)",
      "1 pandan leaf, knotted",
      "400 ml coconut milk",
      "Pinch of salt (for coconut milk)",
      "Shaved ice",
      "Jackfruit or red beans (optional)"
    ],
    "steps": [
      "Whisk the rice flour, tapioca, pandan, water and salt in a pot, and cook over medium heat, stirring, until thick and glossy.",
      "Press the hot dough through a colander or cendol mould into a bowl of ice water to form short green noodles.",
      "Boil the palm sugar, water and knotted pandan leaf until the sugar dissolves, then strain.",
      "Warm the coconut milk gently with a pinch of salt. Do not boil.",
      "Put cendol into glasses and add shaved ice.",
      "Pour over the coconut milk and palm sugar syrup, and top with jackfruit or red beans."
    ]
  },
  {
    "id": "id-dodol",
    "name": "Dodol",
    "ingredients": [
      "250 g glutinous rice flour",
      "1 L thick coconut milk",
      "500 g palm sugar, chopped",
      "100 g white sugar",
      "2 pandan leaves, knotted",
      "1/2 tsp salt",
      "Banana leaf or lined tray"
    ],
    "steps": [
      "Dissolve the palm sugar and white sugar in the coconut milk over low heat, then strain out any bits.",
      "Whisk in the glutinous rice flour and salt until completely smooth.",
      "Add the pandan leaves and cook over low heat, stirring constantly, for about 2 to 3 hours.",
      "The dodol is ready when it is very thick, dark and glossy and pulls away from the pot.",
      "Spread it into a lightly oiled tray or banana leaf and let it cool completely.",
      "Cut into pieces and wrap each one."
    ]
  },
  {
    "id": "id-martabak-manis",
    "name": "Martabak Manis (Sweet Pancake)",
    "ingredients": [
      "300 g plain flour",
      "1 tsp instant yeast",
      "1 tbsp sugar",
      "1 egg",
      "300 ml warm water",
      "1/2 tsp salt",
      "1/2 tsp baking soda",
      "Butter or margarine for the pan",
      "Chocolate sprinkles",
      "Crushed roasted peanuts",
      "Grated cheese",
      "Sweetened condensed milk"
    ],
    "steps": [
      "Mix the flour, yeast, sugar, egg, warm water and salt into a smooth batter, and rest for 1 hour until bubbly.",
      "Stir in the baking soda just before cooking.",
      "Heat a thick pan on medium-low and grease it generously with butter.",
      "Pour in the batter. Cook until bubbles form on the surface and the underside is golden.",
      "Add chocolate sprinkles, peanuts and cheese, then drizzle with condensed milk.",
      "Fold in half, brush with butter, and cut into squares."
    ]
  }
];
const KOREAN = [
  {
    "id": "id-cheese-tteokbokki",
    "name": "Cheese Tteokbokki",
    "video": "https://www.youtube.com/watch?v=aGKMwZS6zCM",
    "ingredients": [
      "500 g cylinder rice cakes (tteok)",
      "1 L anchovy stock, or water",
      "3 tbsp gochujang (Korean chilli paste)",
      "1 tbsp gochugaru (Korean chilli flakes)",
      "1 tbsp soy sauce",
      "1 tbsp sugar",
      "1 tbsp minced garlic",
      "2 fish cake sheets (eomuk), cut into pieces",
      "2 spring onions, cut into lengths",
      "2 boiled eggs, peeled",
      "1 cup shredded mozzarella",
      "1 tsp sesame seeds"
    ],
    "steps": [
      "If the rice cakes are hard or refrigerated, soak them in warm water for 10 minutes, then drain.",
      "Bring the stock to a boil in a wide pan and stir in the gochujang, gochugaru, soy sauce, sugar and garlic until dissolved.",
      "Add the rice cakes and fish cakes and simmer for 10 to 12 minutes, stirring often, until the rice cakes are soft and the sauce is thick.",
      "Add the spring onions and boiled eggs and cook for 1 more minute.",
      "Sprinkle the mozzarella over the top, cover, and cook on low for 2 minutes until melted.",
      "Sprinkle with sesame seeds and serve hot."
    ]
  }
];
const DRINKS_AND_MOCHI = [
  {
    "id": "id-bubble-tea",
    "name": "Brown Sugar Bubble Tea",
    "ingredients": [
      "1/2 cup (80 g) tapioca pearls (boba)",
      "4 cups water, for boiling the pearls",
      "1/4 cup brown sugar",
      "1/4 cup water, for the syrup",
      "2 black tea bags",
      "1 cup hot water",
      "1 cup cold milk",
      "Ice cubes",
      "A wide boba straw"
    ],
    "steps": [
      "Boil the 4 cups of water, add the tapioca pearls and stir until they float. Cook following the packet time (usually 5 to 7 minutes), then cover and rest for 5 minutes.",
      "Drain the pearls and rinse briefly under warm water.",
      "Simmer the brown sugar and 1/4 cup water for 3 minutes into a syrup, add the pearls and cook 3 more minutes. Take off the heat and let them soak.",
      "Steep the tea bags in the hot water for 5 minutes, then remove the bags and let the tea cool.",
      "Spoon the pearls and syrup into two tall glasses, tilting the glass so the syrup streaks the sides.",
      "Add ice, pour in the tea, then the milk. Stir and drink with a wide straw."
    ]
  },
  {
    "id": "id-ice-cream-mochi",
    "name": "Ice Cream Mochi",
    "ingredients": [
      "6 small scoops ice cream, frozen hard (vanilla, matcha or strawberry)",
      "100 g glutinous rice flour (mochiko or shiratamako)",
      "40 g sugar",
      "150 ml water",
      "Cornstarch or potato starch, for dusting",
      "Plastic wrap"
    ],
    "steps": [
      "Scoop the ice cream into 6 balls onto a lined tray and freeze for at least 1 hour, until very hard.",
      "Whisk the rice flour, sugar and water in a microwave-safe bowl until smooth.",
      "Cover and microwave for 1 minute, stir, then microwave for another 1 minute until the dough is thick, glossy and translucent.",
      "Dust a tray generously with cornstarch and tip the hot dough onto it. Dust the top, and let it cool for 5 minutes.",
      "Roll the dough about 3 mm thick and cut it into 6 circles.",
      "Place a frozen ice cream ball in the middle of each circle, stretch the mochi up and around, and pinch the seam closed.",
      "Wrap each mochi in plastic wrap and freeze for at least 1 hour. Rest for 2 minutes at room temperature before eating."
    ]
  }
];
const BUILTIN_VER = 6;
const BUILTINS = [...SAMPLES.map((r) => ({ ...r, v: 1 })), ...INDONESIAN.map((r) => ({ ...r, v: 2 })), ...MORE_INDONESIAN.map((r) => ({ ...r, v: 3 })), ...EVEN_MORE.map((r) => ({ ...r, v: 4 })), ...KOREAN.map((r) => ({ ...r, v: 5 })), ...DRINKS_AND_MOCHI.map((r) => ({ ...r, v: 6 }))];

// Favorites are personal and saved on this device only.
const FAV_KEY = "pantree-favs";
let favs = new Set();
try { favs = new Set(JSON.parse(localStorage.getItem(FAV_KEY)) || []); } catch {}
const saveFavs = () => { try { localStorage.setItem(FAV_KEY, JSON.stringify([...favs])); } catch {} };
let favView = false;
const HEART = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-7-4.6-9.3-9.1C1 8.6 2.9 5 6.4 5c2 0 3.600 1.100 4.600 2.700h2C14 6.100 15.600 5 17.600 5c3.500 0 5.400 3.600 3.700 6.900C19 16.400 12 21 12 21z"/></svg>';
function toggleFav(id) {
  if (favs.has(id)) favs.delete(id); else favs.add(id);
  saveFavs(); render();
  if (viewingId === id) updateFavDetail();
}
function updateFavDetail() {
  const on = favs.has(viewingId);
  $("fav-detail").setAttribute("aria-pressed", on);
  $("fav-detail").textContent = on ? "♥ Saved" : "♡ Save";
}

const ADMIN_KEY = "pantree-admin-code";
let admin = false;
let adminCode = "";
try { adminCode = sessionStorage.getItem(ADMIN_KEY) || localStorage.getItem(ADMIN_KEY) || ""; } catch {}

const CACHE_KEY = "pantree-last-list";
recipes = BUILTINS.map(({ v, ...r }) => r);   // built-in recipes until the shared list loads
try { const c = JSON.parse(localStorage.getItem(CACHE_KEY)); if (Array.isArray(c)) recipes = c; } catch {}  // last list seen, so it works offline

async function load() {
  try {
    const r = await fetch("/api/recipes", { cache: "no-store" });
    const j = await r.json();
    serverInfo = j.configured || null;
    const have = Array.isArray(j.recipes) ? new Set(j.recipes.map((x) => x.id)) : null;
    const ver = Number(j.ver) || 0;
    // Built-in recipes newer than what the owner last saved still show up for everyone.
    const extra = BUILTINS.filter((b) => !(have && have.has(b.id)) && (!have || b.v > ver)).map(({ v, ...r }) => r);
    recipes = [...(j.recipes || []), ...extra];
    try { localStorage.setItem(CACHE_KEY, JSON.stringify(recipes)); } catch {}
  } catch {}
  if (adminCode) await checkAdmin(adminCode, true);
  render();
}

let lastStatus = 0, lastWasOurs = false;
let serverInfo = null;
async function api(body) {
  const r = await fetch("/api/recipes", {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-admin-code": adminCode },
    body: JSON.stringify(body),
  });
  lastStatus = r.status;
  lastWasOurs = false;
  try { const j = await r.clone().json(); lastWasOurs = typeof j === "object" && j !== null; } catch {}
  return r.ok;
}

function signInProblem(failed) {
  if (failed) return "Could not reach the server. Check your internet.";
  if (serverInfo && !serverInfo.code) return "The owner code isn't set on the server yet. Add ADMIN_CODE in Vercel, then redeploy.";
  if (lastStatus === 401 && lastWasOurs) return "Wrong code.";
  if (lastStatus === 401) return "Vercel blocked the request (Deployment Protection is probably on). Turn off Vercel Authentication in Settings → Deployment Protection.";
  return "Sign-in failed (server error " + lastStatus + "). If this persists, check Vercel's Deployment Protection and logs.";
}

async function checkAdmin(code, quiet) {
  const prev = adminCode;
  adminCode = code;
  let ok = false;
  let failed = false;
  try { ok = await api({ action: "check" }); } catch { failed = true; }
  admin = ok;
  if (ok) { try { localStorage.setItem(ADMIN_KEY, code); } catch {} }
  else { adminCode = quiet ? "" : prev; try { localStorage.removeItem(ADMIN_KEY); } catch {} if (!quiet) alert(signInProblem(failed)); }
  return ok;
}

async function save() {
  let ok = false;
  try { ok = await api({ recipes, ver: BUILTIN_VER }); } catch {}
  if (ok) { try { localStorage.setItem(CACHE_KEY, JSON.stringify(recipes)); } catch {} }
  if (!ok) alert("Could not save. Check your internet and that the owner code is still valid.");
}

// Category and cuisine tags (and photos) for the built-in recipes. Owner-added recipes carry their own tags.
const META = {
  s1: ["Breakfast", "American"], s2: ["Pasta", "Italian"], s3: ["Snacks", "Mexican"], s4: ["Soup", "International"],
  "sw-chicken-tikka-masala": ["Chicken", "Indian", "img/sw-chicken-tikka-masala.jpg"],
  "sw-classic-beef-lasagne": ["Pasta", "Italian"],
  "sw-lasagne": ["Pasta", "Italian", "img/sw-lasagne.jpg"],
  "sw-grilled-salmon": ["Seafood", "Modern", "img/sw-grilled-salmon.jpg"],
  "sw-fish-tacos": ["Seafood", "Mexican", "img/sw-fish-tacos.jpg"],
  "sw-spaghetti-carbonara": ["Pasta", "Italian", "img/sw-spaghetti-carbonara.jpg"],
  "sw-vegetable-stir-fry": ["Vegetarian", "Chinese"], "sw-mushroom-risotto": ["Vegetarian", "Italian"], "sw-lemon-roast-chicken": ["Chicken", "British"],
  "id-nasi-goreng": ["Rice & Noodles", "Indonesian"], "id-mie-goreng": ["Rice & Noodles", "Indonesian"], "id-soto-ayam": ["Soup", "Indonesian"],
  "id-beef-rendang": ["Beef", "Indonesian"], "id-gado-gado": ["Vegetarian", "Indonesian"], "id-sate-ayam": ["Chicken", "Indonesian"],
  "id-ayam-goreng": ["Chicken", "Indonesian"], "id-pisang-goreng": ["Dessert", "Indonesian"], "id-pempek": ["Snacks", "Indonesian"],
  "id-bakso": ["Soup", "Indonesian"], "id-es-campur": ["Dessert", "Indonesian"], "id-es-cendol": ["Dessert", "Indonesian"],
  "id-dodol": ["Dessert", "Indonesian"], "id-cheese-tteokbokki": ["Snacks", "Korean"], "id-bubble-tea": ["Drinks", "Taiwanese"], "id-ice-cream-mochi": ["Dessert", "Japanese"], "id-martabak-manis": ["Dessert", "Indonesian"]
};
const ICONS = { Dessert:"🍨", Soup:"🍲", Pasta:"🍝", Seafood:"🐟", Chicken:"🍗", Beef:"🥩", Vegetarian:"🥗", Snacks:"🥟", Breakfast:"🥞", "Rice & Noodles":"🍜", Drinks:"🥤" };
const YT_OK = /^https:\/\/((www|m)\.)?(youtube\.com|youtu\.be)\//i;
const validVideo = (u) => (typeof u === "string" && YT_OK.test(u.trim()) ? u.trim() : "");
// The owner's link if there is one, otherwise a YouTube search for the recipe.
const videoUrl = (r) => validVideo(r.video) || "https://www.youtube.com/results?search_query=" + encodeURIComponent(r.name + " recipe");
const categoryOf = (r) => r.category || (META[r.id] && META[r.id][0]) || "";
const areaOf = (r) => r.area || (META[r.id] && META[r.id][1]) || "";
const imageOf = (r) => r.image || (META[r.id] && META[r.id][2]) || "";
const tagsOf = (r) => [categoryOf(r), areaOf(r)].filter(Boolean);
const hue = (s) => [...s].reduce((n, c) => (n * 31 + c.charCodeAt(0)) % 360, 7);
const coverHtml = (r) => {
  const img = imageOf(r);
  if (img) return `<img src="${esc(img)}" alt="${esc(r.name)}" loading="lazy">`;
  return `<span aria-hidden="true">${ICONS[categoryOf(r)] || "🍽️"}</span>`;
};
const coverStyle = (r) => imageOf(r) ? "" : `background:linear-gradient(135deg,hsl(${hue(r.id)} 45% 40%),hsl(${(hue(r.id) + 40) % 360} 50% 28%))`;
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
    (!favView || favs.has(r.id)) &&
    (!q || r.name.toLowerCase().includes(q) || r.ingredients.some((i) => i.toLowerCase().includes(q)) || tagsOf(r).some((t) => t.toLowerCase().includes(q))));
  $("add").hidden = !admin;
  $("owner").textContent = admin ? "Owner: sign out" : "Owner sign in";
  const cats = [...new Set(recipes.map(categoryOf).filter(Boolean))].sort();
  const areas = [...new Set(recipes.map(areaOf).filter(Boolean))].sort();
  $("dl-categories").innerHTML = cats.map((c) => `<option value="${esc(c)}">`).join("");
  $("dl-areas").innerHTML = areas.map((c) => `<option value="${esc(c)}">`).join("");
  $("favn").textContent = recipes.filter((r) => favs.has(r.id)).length;
  $("tHome").setAttribute("aria-pressed", !favView);
  $("tFav").setAttribute("aria-pressed", favView);
  $("heading").textContent = favView ? "Favorites" : q ? `Results for “${$("search").value.trim()}”` : "Browse recipes";
  $("empty").textContent = favView && !q ? "No favorites yet. Tap the heart on a recipe to save it." : "No recipes found. Try another search.";
  $("empty").hidden = shown.length > 0;
  $("list").innerHTML = shown.map((r) =>
    `<li><div class="card"><button class="open" data-id="${esc(r.id)}">
      <div class="thumb" style="${coverStyle(r)}">${coverHtml(r)}</div>
      <div class="meta"><h3>${esc(r.name)}</h3><p>${r.ingredients.length} ingredients · ${r.steps.length} steps</p></div></button>
      <div class="tags">${tagsOf(r).map((t) => `<span class="tag">${esc(t)}</span>`).join("")}</div>
      <button class="fav" data-fav="${esc(r.id)}" aria-pressed="${favs.has(r.id)}" aria-label="${favs.has(r.id) ? "Remove from" : "Add to"} favorites: ${esc(r.name)}">${HEART}</button></div></li>`).join("");
}
function openForm(recipe) {
  editingId = recipe ? recipe.id : null;
  $("form-title").textContent = recipe ? "Edit recipe" : "New recipe";
  $("f-name").value = recipe ? recipe.name : "";
  $("f-category").value = recipe ? categoryOf(recipe) : "";
  $("f-area").value = recipe ? areaOf(recipe) : "";
  $("f-video").value = recipe ? validVideo(recipe.video) : "";
  fill($("f-ingredients"), recipe ? recipe.ingredients : []);
  fill($("f-steps"), recipe ? recipe.steps : []);
  $("form-dialog").showModal();
}

function openView(id) {
  const r = recipes.find((x) => x.id === id);
  if (!r) return;
  viewingId = id;
  $("view-cover").setAttribute("style", coverStyle(r));
  $("view-cover").innerHTML = coverHtml(r);
  $("view").innerHTML =
    `<h2>${esc(r.name)}</h2><div class="tags">${tagsOf(r).map((t) => `<span class="tag">${esc(t)}</span>`).join("")}</div><a class="yt" href="${esc(videoUrl(r))}" target="_blank" rel="noopener noreferrer">▶ Watch on YouTube</a><h3>Ingredients</h3><ul>${r.ingredients.map((i) => `<li>${esc(i)}</li>`).join("")}</ul>` +
    `<h3>Steps</h3><ol>${r.steps.map((s) => `<li>${esc(s)}</li>`).join("")}</ol>`;
  $("edit").hidden = !admin;
  $("delete").hidden = !admin;
  updateFavDetail();
  if (!$("view-dialog").open) $("view-dialog").showModal();
  $("view-dialog").scrollTop = 0;
}

// Opening a recipe adds a history step, so the Back button returns to the same search.
const urlFor = (hash) => location.pathname + (location.search || "") + (hash || "");
function showRecipe(id) {
  history.pushState({ recipe: id }, "", urlFor("#recipe=" + encodeURIComponent(id)));
  openView(id);
}
function closeView() {
  return new Promise((done) => {
    if (history.state && history.state.recipe) { addEventListener("popstate", () => done(), { once: true }); history.back(); }
    else { $("view-dialog").close(); done(); }
  });
}
window.addEventListener("popstate", () => {
  const id = history.state && history.state.recipe;
  if (id) openView(id); else if ($("view-dialog").open) $("view-dialog").close();
});
$("view-dialog").addEventListener("cancel", (e) => { e.preventDefault(); closeView(); });

// Keep the search in the address so it survives Back and reloads.
function syncSearchToUrl() {
  const p = new URLSearchParams();
  const q = $("search").value.trim();
  if (q) p.set("q", q);
  if (favView) p.set("fav", "1");
  const s = p.toString();
  history.replaceState(history.state, "", location.pathname + (s ? "?" + s : "") + location.hash);
}

$("add").onclick = () => openForm(null);
$("add-ingredient").onclick = () => addLine($("f-ingredients")).focus();
$("add-step").onclick = () => addLine($("f-steps")).focus();
$("cancel").onclick = () => $("form-dialog").close();
$("back").onclick = () => closeView();
$("fav-detail").onclick = () => toggleFav(viewingId);
$("tHome").onclick = () => { favView = false; syncSearchToUrl(); render(); scrollTo({ top: 0 }); };
$("tFav").onclick = () => { favView = true; syncSearchToUrl(); render(); scrollTo({ top: 0 }); };
$("search").oninput = () => { syncSearchToUrl(); render(); };
$("list").onclick = (e) => {
  const fav = e.target.closest(".fav");
  if (fav) { toggleFav(fav.dataset.fav); return; }
  const open = e.target.closest(".open");
  if (open) showRecipe(open.dataset.id);
};
$("theme").onclick = () => {
  const dark = document.documentElement.dataset.theme === "dark" || (!document.documentElement.dataset.theme && matchMedia("(prefers-color-scheme: dark)").matches);
  document.documentElement.dataset.theme = dark ? "light" : "dark";
  try { localStorage.setItem("pantree-theme", document.documentElement.dataset.theme); } catch {}
};
try { const t = localStorage.getItem("pantree-theme"); if (t) document.documentElement.dataset.theme = t; } catch {}
$("edit").onclick = async () => { const r = recipes.find((x) => x.id === viewingId); await closeView(); openForm(r); };
$("delete").onclick = async () => {
  if (!confirm("Delete this recipe?")) return;
  const id = viewingId;
  await closeView();
  recipes = recipes.filter((x) => x.id !== id);
  save(); render();
};
$("owner").onclick = async () => {
  if (admin) { admin = false; adminCode = ""; try { localStorage.removeItem(ADMIN_KEY); } catch {} render(); return; }
  const code = prompt("Owner code:");
  if (code && (await checkAdmin(code.trim()))) render();
};
$("form").onsubmit = () => {
  const data = { name: $("f-name").value.trim(), category: $("f-category").value.trim(), area: $("f-area").value.trim(), video: validVideo($("f-video").value), ingredients: lines($("f-ingredients")), steps: lines($("f-steps")) };
  if ($("f-video").value.trim() && !data.video) { alert("Use a YouTube link that starts with https://youtube.com or https://youtu.be"); return false; }
  if (!data.ingredients.length || !data.steps.length) { alert("Add at least one ingredient and one step."); return false; }
  if (editingId) recipes = recipes.map((r) => (r.id === editingId ? { ...r, ...data } : r));
  else recipes.unshift({ id: String(Date.now()), ...data });
  save(); render();
};

// Restore the search (and an open recipe) from the address.
try { const sp = new URLSearchParams(location.search); $("search").value = sp.get("q") || ""; favView = sp.get("fav") === "1"; } catch {}
render();
load();
{
  const m = location.hash.match(/^#recipe=(.+)$/);
  if (m) { const id = decodeURIComponent(m[1]); history.replaceState({ recipe: id }, "", location.href); openView(id); }
}
// Keep the saved list fresh: refresh when the device reconnects or the app comes back to the front.
window.addEventListener("online", load);
document.addEventListener("visibilitychange", () => { if (document.visibilityState === "visible" && navigator.onLine) load(); });
if ("serviceWorker" in navigator) navigator.serviceWorker.register("sw.js").catch(() => {});
