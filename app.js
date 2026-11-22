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
const MORE_RECIPES = [
  {
    "id": "id-falafel",
    "name": "Falafel",
    "ingredients": [
      "250 g dried chickpeas, soaked overnight (not canned)",
      "1 small onion, roughly chopped",
      "4 cloves garlic",
      "1 cup fresh parsley",
      "1/2 cup fresh coriander",
      "2 tsp ground cumin",
      "1 tsp ground coriander",
      "1 tsp salt",
      "1/2 tsp baking powder",
      "2 tbsp flour",
      "Oil for frying",
      "Pita, tahini sauce and salad (to serve)"
    ],
    "steps": [
      "Drain the soaked chickpeas and pat dry.",
      "Blitz the chickpeas, onion, garlic and herbs in a food processor into a coarse, crumbly mixture, not a paste.",
      "Mix in the spices, salt, baking powder and flour, and chill for 30 minutes.",
      "Shape into small balls or patties.",
      "Fry in hot oil for 3 to 4 minutes, turning, until deep golden and crisp.",
      "Drain on paper and serve in pita with tahini sauce and salad."
    ]
  },
  {
    "id": "id-cheese-sticks",
    "name": "Cheese Sticks",
    "ingredients": [
      "8 mozzarella string cheese sticks",
      "1/2 cup plain flour",
      "2 eggs, beaten",
      "1 cup breadcrumbs",
      "1/2 tsp garlic powder",
      "1/2 tsp dried oregano",
      "Oil for frying",
      "Marinara sauce (to serve)"
    ],
    "steps": [
      "Cut each cheese stick in half and freeze for 1 hour so they hold their shape.",
      "Set up three bowls: flour, beaten eggs, and breadcrumbs mixed with the garlic powder and oregano.",
      "Coat each stick in flour, then egg, then breadcrumbs. Dip again in egg and breadcrumbs for a thick coating.",
      "Freeze for another 30 minutes.",
      "Fry in hot oil for 1 to 2 minutes until golden, turning once.",
      "Drain and serve straight away with warm marinara sauce."
    ]
  },
  {
    "id": "id-cinnamon-roll-biscuits",
    "name": "Cinnamon Roll Biscuits",
    "ingredients": [
      "2 cups plain flour",
      "1 tbsp baking powder",
      "1/2 tsp salt",
      "1 tbsp sugar",
      "1/3 cup cold butter, cubed",
      "3/4 cup milk",
      "3 tbsp melted butter",
      "1/3 cup brown sugar",
      "1 tbsp ground cinnamon",
      "1/2 cup icing sugar",
      "1 to 2 tbsp milk, for the glaze"
    ],
    "steps": [
      "Heat the oven to 220°C and grease a baking tin.",
      "Mix the flour, baking powder, salt and sugar, and rub in the cold butter until crumbly.",
      "Stir in the milk to form a soft dough.",
      "Roll the dough into a rectangle about 1 cm thick and brush with melted butter.",
      "Mix the brown sugar and cinnamon, sprinkle over the dough, and roll up from the long side.",
      "Cut into 8 slices, place cut side up in the tin, and bake for 15 to 18 minutes until golden.",
      "Whisk the icing sugar with the milk and drizzle over the warm rolls."
    ]
  },
  {
    "id": "id-cabbage-rolls",
    "name": "Cabbage Rolls (Golabki)",
    "ingredients": [
      "1 large head of cabbage",
      "500 g minced beef or pork",
      "1/2 cup cooked rice",
      "1 onion, finely chopped",
      "1 egg",
      "1 tsp salt",
      "1/2 tsp pepper",
      "700 ml tomato sauce or passata",
      "1 cup beef stock"
    ],
    "steps": [
      "Cook the whole cabbage in boiling water for about 8 minutes, then peel off the softened leaves.",
      "Mix the mince, rice, onion, egg, salt and pepper.",
      "Place a spoonful of filling on each leaf, fold in the sides, and roll up tightly.",
      "Pack the rolls seam side down in a deep pan or baking dish.",
      "Pour over the tomato sauce and stock.",
      "Cover and simmer, or bake at 180°C, for 1 hour 15 minutes until tender."
    ]
  },
  {
    "id": "id-nalesniki",
    "name": "Nalesniki (Polish Crepes)",
    "ingredients": [
      "1 cup plain flour",
      "1 cup milk",
      "1/2 cup water",
      "2 eggs",
      "1 tbsp oil",
      "Pinch of salt",
      "250 g sweet curd cheese or ricotta",
      "2 tbsp sugar",
      "1 tsp vanilla",
      "Butter for frying",
      "Icing sugar or jam (to serve)"
    ],
    "steps": [
      "Whisk the flour, milk, water, eggs, oil and salt into a smooth thin batter, and rest for 15 minutes.",
      "Mix the cheese with the sugar and vanilla.",
      "Fry thin crepes in a buttered pan, about 1 minute per side.",
      "Spread each crepe with the cheese filling and fold into an envelope or roll.",
      "Fry the filled crepes in butter for 1 minute per side until golden.",
      "Serve dusted with icing sugar or with jam."
    ]
  },
  {
    "id": "id-arepa",
    "name": "Arepas",
    "ingredients": [
      "2 cups pre-cooked white cornmeal (masarepa)",
      "2 1/2 cups warm water",
      "1 tsp salt",
      "1 tbsp oil",
      "Shredded cheese, avocado or shredded chicken (to fill)",
      "Butter"
    ],
    "steps": [
      "Mix the warm water and salt, then stir in the cornmeal and oil until a soft dough forms.",
      "Rest the dough for 5 minutes.",
      "Shape into 6 to 8 thick discs, about 1.5 cm high.",
      "Cook on a lightly oiled pan over medium heat for 5 minutes per side until golden with a crisp crust.",
      "Bake at 180°C for 10 minutes so the centre cooks through.",
      "Split open, spread with butter, and fill with cheese, avocado or chicken."
    ]
  },
  {
    "id": "id-flatbread",
    "name": "Khubz (Arab Flatbread)",
    "ingredients": [
      "3 cups (400 g) plain flour",
      "1 tsp instant yeast",
      "1 tsp sugar",
      "1 tsp salt",
      "1 tbsp olive oil",
      "About 1 1/4 cups warm water"
    ],
    "steps": [
      "Mix the flour, yeast, sugar and salt, then add the oil and enough warm water to make a soft dough.",
      "Knead for 8 to 10 minutes until smooth and elastic.",
      "Cover and let it rise for 1 hour until doubled.",
      "Divide into 8 balls and rest them for 10 minutes.",
      "Roll each ball into a round about 5 mm thick, and let them rest for 15 minutes.",
      "Heat the oven to 250°C with a baking tray or pizza stone inside until very hot.",
      "Bake the rounds 1 or 2 at a time for 3 to 4 minutes, until they puff up like a balloon and turn lightly golden.",
      "Wrap in a clean cloth to keep soft, and serve warm with dips, kebabs or shawarma."
    ]
  },
  {
    "id": "id-shawarma",
    "name": "Chicken Shawarma",
    "ingredients": [
      "700 g chicken thigh, sliced",
      "3 tbsp olive oil",
      "3 tbsp lemon juice",
      "4 cloves garlic, minced",
      "2 tsp ground cumin",
      "2 tsp paprika",
      "1 tsp ground turmeric",
      "1 tsp cinnamon",
      "1/2 tsp ground cardamom",
      "Salt and pepper",
      "Flatbread or pita",
      "Garlic sauce, pickles, tomato and cucumber (to serve)"
    ],
    "steps": [
      "Mix the oil, lemon juice, garlic and all the spices with salt and pepper.",
      "Coat the chicken in the marinade and chill for at least 2 hours, or overnight.",
      "Cook the chicken in a very hot pan or under a grill for 4 to 5 minutes per side until charred and cooked through.",
      "Rest for 5 minutes, then slice thinly.",
      "Warm the flatbread and fill with chicken, garlic sauce, pickles, tomato and cucumber."
    ]
  }
];
const ARAB_FOOD = [
  {
    "id": "id-hummus",
    "name": "Hummus",
    "ingredients": [
      "2 cups cooked chickpeas (one 400 g can, drained)",
      "1/3 cup tahini",
      "3 tbsp lemon juice",
      "1 clove garlic",
      "1/2 tsp salt",
      "1/2 tsp ground cumin",
      "3 to 4 tbsp ice-cold water",
      "Olive oil, paprika and parsley (to serve)"
    ],
    "steps": [
      "Blend the tahini and lemon juice for 1 minute until pale and creamy.",
      "Add the garlic, salt, cumin and half the chickpeas, and blend until smooth.",
      "Add the remaining chickpeas and blend again, adding the cold water a spoonful at a time until very smooth and fluffy.",
      "Spread in a shallow bowl, make a well in the centre with a spoon, and fill with olive oil.",
      "Finish with paprika and parsley, and serve with khubz or vegetables."
    ]
  },
  {
    "id": "id-tabbouleh",
    "name": "Tabbouleh",
    "ingredients": [
      "3 large bunches flat-leaf parsley, very finely chopped",
      "1/4 cup fine bulgur, soaked in water for 15 minutes",
      "3 ripe tomatoes, finely diced",
      "1/2 cup fresh mint, finely chopped",
      "4 spring onions, finely sliced",
      "1/4 cup lemon juice",
      "1/4 cup olive oil",
      "1/2 tsp allspice",
      "Salt"
    ],
    "steps": [
      "Wash the parsley well and dry it thoroughly, then chop it very finely.",
      "Drain the bulgur and squeeze out the extra water.",
      "Toss the parsley, mint, tomatoes, spring onions and bulgur together.",
      "Whisk the lemon juice, olive oil, allspice and salt, and pour over the salad.",
      "Toss well and serve fresh with lettuce leaves."
    ]
  },
  {
    "id": "id-fattoush",
    "name": "Fattoush",
    "ingredients": [
      "2 pita or khubz, torn into pieces",
      "Oil for frying or brushing",
      "1 romaine lettuce, chopped",
      "2 tomatoes, diced",
      "1 cucumber, diced",
      "4 radishes, sliced",
      "4 spring onions, sliced",
      "1/2 cup mint and parsley leaves",
      "3 tbsp olive oil",
      "2 tbsp lemon juice",
      "1 tbsp pomegranate molasses",
      "1 clove garlic, crushed",
      "1 tbsp sumac",
      "Salt"
    ],
    "steps": [
      "Fry or bake the bread pieces with a little oil until crisp and golden.",
      "Whisk the olive oil, lemon juice, pomegranate molasses, garlic, half the sumac and salt.",
      "Toss the lettuce, tomatoes, cucumber, radishes, spring onions and herbs in a large bowl.",
      "Pour the dressing over and toss.",
      "Add the crispy bread just before serving and sprinkle with the remaining sumac."
    ]
  },
  {
    "id": "id-chicken-kabsa",
    "name": "Chicken Kabsa",
    "ingredients": [
      "1 kg chicken pieces",
      "2 cups basmati rice, soaked for 30 minutes",
      "3 tbsp oil or ghee",
      "2 onions, sliced",
      "4 cloves garlic, minced",
      "3 tomatoes, grated",
      "2 tbsp tomato paste",
      "2 tbsp kabsa spice mix",
      "3 cardamom pods",
      "1 cinnamon stick",
      "3 dried limes (loomi), pierced",
      "3 1/2 cups chicken stock",
      "Toasted almonds and raisins (to serve)"
    ],
    "steps": [
      "Brown the chicken in the oil in a large pot, then set it aside.",
      "Fry the onions until golden, then add the garlic, tomatoes, tomato paste, spice mix, cardamom and cinnamon, and cook for 5 minutes.",
      "Return the chicken, add the dried limes and stock, and simmer for 30 minutes until the chicken is tender.",
      "Lift out the chicken and stir the drained rice into the broth.",
      "Cook, covered, on low heat for about 20 minutes until the rice is fluffy.",
      "Grill or oven-roast the chicken for 10 minutes until golden, place it over the rice, and top with almonds and raisins."
    ]
  },
  {
    "id": "id-maqluba",
    "name": "Maqluba",
    "ingredients": [
      "1 kg chicken pieces",
      "2 eggplants, sliced",
      "1 small cauliflower, in florets",
      "2 tomatoes, sliced",
      "1 onion, sliced",
      "2 cups basmati rice, soaked",
      "2 tsp Arab seven-spice (baharat)",
      "1 tsp turmeric",
      "3 cups chicken stock",
      "Oil for frying",
      "Toasted nuts and yoghurt (to serve)"
    ],
    "steps": [
      "Boil the chicken with the onion and half the spices to make a flavourful stock, then strain and keep both the chicken and the stock.",
      "Fry the eggplant slices and cauliflower until golden and drain.",
      "Line the base of a deep pot with the tomato slices, then arrange the eggplant, chicken and cauliflower in layers.",
      "Mix the rice with the remaining spices and spread it over the top.",
      "Pour in the hot stock until it just covers the rice, cover, and simmer for 40 minutes.",
      "Rest for 10 minutes, place a large plate on top, and flip the pot over to turn out the dish.",
      "Top with toasted nuts and serve with yoghurt."
    ]
  },
  {
    "id": "id-shish-taouk",
    "name": "Shish Taouk",
    "ingredients": [
      "700 g chicken breast, cubed",
      "1/2 cup plain yoghurt",
      "3 tbsp lemon juice",
      "2 tbsp tomato paste",
      "4 cloves garlic, minced",
      "2 tbsp olive oil",
      "1 tsp paprika",
      "1 tsp salt",
      "1/2 tsp black pepper",
      "Skewers",
      "Garlic sauce (toum) and flatbread (to serve)"
    ],
    "steps": [
      "Mix the yoghurt, lemon juice, tomato paste, garlic, oil, paprika, salt and pepper.",
      "Add the chicken, coat well, and marinate for at least 4 hours or overnight.",
      "Thread the chicken onto skewers.",
      "Grill or roast at 220°C for 12 to 15 minutes, turning, until charred and cooked through.",
      "Serve with garlic sauce and warm flatbread."
    ]
  },
  {
    "id": "id-shorbat-adas",
    "name": "Lentil Soup (Shorbat Adas)",
    "ingredients": [
      "1 1/2 cups red lentils, rinsed",
      "1 onion, chopped",
      "2 carrots, chopped",
      "1 potato, diced",
      "3 cloves garlic",
      "1 tsp ground cumin",
      "1/2 tsp turmeric",
      "6 cups vegetable or chicken stock",
      "2 tbsp olive oil",
      "Lemon wedges and parsley (to serve)"
    ],
    "steps": [
      "Soften the onion, carrots and garlic in the olive oil for 5 minutes.",
      "Stir in the cumin and turmeric for 30 seconds.",
      "Add the lentils, potato and stock, and simmer for 25 to 30 minutes until everything is soft.",
      "Blend until smooth and season with salt and pepper.",
      "Serve hot with a squeeze of lemon and parsley."
    ]
  },
  {
    "id": "id-kunafa",
    "name": "Kunafa",
    "ingredients": [
      "400 g kataifi (shredded pastry)",
      "150 g melted butter",
      "500 g mozzarella or akkawi cheese, shredded",
      "1 cup sugar",
      "1/2 cup water",
      "1 tsp lemon juice",
      "1 tsp rose water",
      "Crushed pistachios (to serve)"
    ],
    "steps": [
      "Boil the sugar, water and lemon juice for 8 minutes, add the rose water, and let the syrup cool.",
      "Pull the kataifi apart, mix it with the melted butter, and rub until every strand is coated.",
      "Press half of the pastry into a greased round tin and cover it with the cheese.",
      "Top with the rest of the pastry and press down firmly.",
      "Bake at 190°C for 35 to 40 minutes until deep golden.",
      "Turn it onto a plate, pour over the cool syrup right away, and scatter with pistachios. Serve warm."
    ]
  },
  {
    "id": "id-umm-ali",
    "name": "Umm Ali",
    "ingredients": [
      "2 sheets puff pastry",
      "2 cups milk",
      "1 cup cream",
      "1/2 cup sugar",
      "1/2 cup mixed chopped nuts",
      "1/4 cup raisins",
      "1/4 cup shredded coconut",
      "1 tsp vanilla",
      "Cinnamon"
    ],
    "steps": [
      "Bake the puff pastry until golden and crisp, then break it into pieces.",
      "Heat the oven to 200°C.",
      "Layer the pastry, nuts, raisins and coconut in a baking dish.",
      "Heat the milk, cream, sugar and vanilla until the sugar dissolves, and pour it over the pastry.",
      "Sprinkle with cinnamon and bake for 15 to 20 minutes until bubbling and golden on top.",
      "Serve warm."
    ]
  }
];
const SHAKSHUKA = [
  {
    "id": "id-shakshuka",
    "name": "Shakshuka",
    "ingredients": [
      "2 tbsp olive oil",
      "1 onion, chopped",
      "1 red pepper, diced",
      "3 cloves garlic, minced",
      "1 tsp ground cumin",
      "1 tsp paprika",
      "1/2 tsp chilli flakes",
      "800 g canned chopped tomatoes",
      "1 tbsp tomato paste",
      "1 tsp sugar",
      "Salt and pepper",
      "5 eggs",
      "Crumbled feta (optional)",
      "Parsley or coriander",
      "Khubz or crusty bread (to serve)"
    ],
    "steps": [
      "Soften the onion and red pepper in the olive oil for 6 to 8 minutes.",
      "Add the garlic, cumin, paprika and chilli flakes and cook for 1 minute.",
      "Stir in the tomatoes, tomato paste, sugar, salt and pepper, and simmer for 15 minutes until thick.",
      "Make small wells in the sauce and crack an egg into each.",
      "Cover and cook on low heat for 5 to 8 minutes, until the whites are set and the yolks are still soft.",
      "Top with feta and herbs, and serve from the pan with bread."
    ]
  }
];
const ITALIAN_POLISH = [
  {
    "id": "it-margherita-pizza",
    "name": "Margherita Pizza",
    "ingredients": [
      "500 g strong bread flour",
      "1 tsp instant yeast",
      "2 tsp salt",
      "1 tbsp olive oil",
      "320 ml warm water",
      "400 g canned tomatoes, crushed",
      "2 balls fresh mozzarella",
      "Fresh basil leaves",
      "Olive oil, to finish"
    ],
    "steps": [
      "Mix the flour, yeast and salt, then add the oil and water and knead for 10 minutes until smooth.",
      "Cover and let the dough rise for 1 to 2 hours until doubled.",
      "Heat the oven to its highest setting (250°C or more) with a tray or stone inside.",
      "Divide the dough into 2 or 3 balls and stretch each into a thin round.",
      "Spread with a thin layer of crushed tomatoes seasoned with salt.",
      "Top with torn mozzarella and bake for 6 to 8 minutes until the crust is blistered.",
      "Finish with basil and a drizzle of olive oil."
    ]
  },
  {
    "id": "it-spaghetti-bolognese",
    "name": "Spaghetti Bolognese",
    "ingredients": [
      "500 g beef mince",
      "1 onion, finely chopped",
      "1 carrot, finely chopped",
      "1 celery stick, finely chopped",
      "3 cloves garlic",
      "2 tbsp tomato paste",
      "400 g canned tomatoes",
      "1/2 cup red wine",
      "1/2 cup milk",
      "1 tsp dried oregano",
      "400 g spaghetti",
      "Parmesan, to serve"
    ],
    "steps": [
      "Soften the onion, carrot and celery in olive oil for 8 minutes, then add the garlic.",
      "Add the mince and brown it well, breaking it up.",
      "Stir in the tomato paste and cook for 2 minutes, then pour in the wine and let it bubble away.",
      "Add the tomatoes, milk and oregano, and simmer gently for at least 1 hour, stirring now and then.",
      "Season well with salt and pepper.",
      "Boil the spaghetti until al dente, toss with the sauce, and serve with plenty of parmesan."
    ]
  },
  {
    "id": "it-chicken-parmigiana",
    "name": "Chicken Parmigiana",
    "ingredients": [
      "2 chicken breasts, halved and flattened",
      "1/2 cup plain flour",
      "2 eggs, beaten",
      "1 cup breadcrumbs",
      "1/2 cup grated parmesan",
      "1 1/2 cups tomato passata",
      "1 clove garlic, minced",
      "1 cup grated mozzarella",
      "Basil leaves",
      "Oil for frying"
    ],
    "steps": [
      "Coat the chicken in flour, then egg, then the breadcrumbs mixed with half the parmesan.",
      "Shallow fry for 3 minutes per side until golden and place in a baking dish.",
      "Simmer the passata with the garlic and a pinch of salt for 10 minutes.",
      "Spoon the sauce over the chicken and top with mozzarella and the remaining parmesan.",
      "Bake at 200°C for 12 to 15 minutes until the cheese is bubbling.",
      "Scatter with basil and serve with salad or pasta."
    ]
  },
  {
    "id": "it-minestrone",
    "name": "Minestrone",
    "ingredients": [
      "2 tbsp olive oil",
      "1 onion, diced",
      "2 carrots, diced",
      "2 celery sticks, diced",
      "3 cloves garlic",
      "1 courgette, diced",
      "400 g canned tomatoes",
      "1 L vegetable stock",
      "1 can cannellini beans, drained",
      "1 cup small pasta",
      "2 cups chopped cabbage or kale",
      "Parmesan and basil, to serve"
    ],
    "steps": [
      "Soften the onion, carrots, celery and garlic in the olive oil for 8 minutes.",
      "Add the courgette, tomatoes and stock, and simmer for 15 minutes.",
      "Add the beans, pasta and greens, and cook for 10 minutes until the pasta is tender.",
      "Season well and serve topped with parmesan and basil."
    ]
  },
  {
    "id": "it-bruschetta",
    "name": "Bruschetta",
    "ingredients": [
      "1 baguette or ciabatta, sliced",
      "4 ripe tomatoes, diced",
      "2 cloves garlic (1 minced, 1 left whole)",
      "1/4 cup fresh basil, torn",
      "3 tbsp olive oil",
      "1 tbsp balsamic vinegar",
      "Salt and pepper"
    ],
    "steps": [
      "Toss the tomatoes with the minced garlic, basil, 2 tbsp olive oil, vinegar, salt and pepper, and leave for 15 minutes.",
      "Brush the bread slices with olive oil and toast or grill until crisp and golden.",
      "Rub each slice with the whole garlic clove.",
      "Spoon the tomato mixture on top and serve straight away."
    ]
  },
  {
    "id": "it-tiramisu",
    "name": "Tiramisu",
    "ingredients": [
      "500 g mascarpone",
      "4 eggs, separated",
      "100 g sugar",
      "300 ml strong cold coffee",
      "3 tbsp marsala or coffee liqueur (optional)",
      "24 savoiardi (ladyfinger biscuits)",
      "Cocoa powder, for dusting"
    ],
    "steps": [
      "Whisk the egg yolks and sugar until pale and thick, then fold in the mascarpone.",
      "Whisk the egg whites to stiff peaks and gently fold them in.",
      "Mix the coffee with the liqueur and quickly dip each biscuit, so they are soaked but not falling apart.",
      "Layer half the biscuits in a dish, cover with half the cream, then repeat.",
      "Chill for at least 6 hours, preferably overnight.",
      "Dust with cocoa just before serving."
    ]
  },
  {
    "id": "it-panna-cotta",
    "name": "Panna Cotta",
    "ingredients": [
      "500 ml double cream",
      "250 ml milk",
      "80 g sugar",
      "1 vanilla pod or 1 tsp vanilla",
      "3 sheets gelatine (or 2 tsp powder)",
      "Berry sauce or caramel, to serve"
    ],
    "steps": [
      "Soak the gelatine in cold water for 5 minutes.",
      "Heat the cream, milk, sugar and vanilla until just steaming, but not boiling.",
      "Squeeze the gelatine and stir it into the hot cream until dissolved.",
      "Strain into 6 moulds or glasses and cool.",
      "Chill for at least 5 hours until set.",
      "Turn out or serve in the glasses with berry sauce."
    ]
  },
  {
    "id": "pl-pierogi-ruskie",
    "name": "Pierogi Ruskie",
    "ingredients": [
      "3 cups plain flour",
      "1 cup warm water",
      "1 egg",
      "1 tbsp oil",
      "1/2 tsp salt",
      "500 g potatoes, boiled",
      "250 g farmer's cheese or ricotta",
      "1 onion, finely chopped and fried",
      "Salt and pepper",
      "Butter, fried onion and sour cream (to serve)"
    ],
    "steps": [
      "Mix the flour, water, egg, oil and salt into a smooth dough, knead for 5 minutes, and rest for 30 minutes.",
      "Mash the potatoes and mix with the cheese, fried onion, salt and pepper for the filling.",
      "Roll out the dough thinly and cut out circles with a glass.",
      "Put a spoonful of filling on each circle, fold over and press the edges firmly to seal.",
      "Boil in salted water until they float, then simmer for 3 minutes.",
      "Serve with melted butter, fried onion and sour cream."
    ]
  },
  {
    "id": "pl-bigos",
    "name": "Bigos (Hunter's Stew)",
    "ingredients": [
      "500 g sauerkraut, drained",
      "500 g fresh white cabbage, shredded",
      "300 g pork shoulder, cubed",
      "200 g smoked sausage, sliced",
      "100 g bacon, diced",
      "1 onion, chopped",
      "6 dried mushrooms, soaked",
      "2 bay leaves",
      "4 allspice berries",
      "1 tbsp tomato paste",
      "1 cup stock or red wine",
      "Salt and pepper"
    ],
    "steps": [
      "Brown the bacon, pork and onion in a large pot.",
      "Add the sauerkraut, fresh cabbage, mushrooms with their soaking water, bay leaves, allspice and stock.",
      "Cover and simmer gently for 1 hour.",
      "Add the sausage and tomato paste, and cook for another hour, stirring now and then.",
      "Bigos tastes best reheated the next day. Serve with rye bread or potatoes."
    ]
  },
  {
    "id": "pl-zurek",
    "name": "Zurek (Sour Rye Soup)",
    "ingredients": [
      "1 cup sour rye starter (zakwas)",
      "1.5 L stock",
      "300 g white sausage (biala kielbasa)",
      "2 potatoes, diced",
      "1 carrot, diced",
      "3 cloves garlic",
      "1 tsp marjoram",
      "2 bay leaves",
      "1/2 cup cream",
      "4 boiled eggs, halved"
    ],
    "steps": [
      "Simmer the stock with the carrot, potatoes, bay leaves and sausage for 20 minutes.",
      "Stir in the sour rye starter and cook for 10 minutes, whisking so it does not clump.",
      "Add the garlic and marjoram, and season with salt and pepper.",
      "Stir in the cream and cook for 2 more minutes.",
      "Serve hot with half an egg and a slice of sausage in each bowl."
    ]
  },
  {
    "id": "pl-barszcz",
    "name": "Barszcz (Beetroot Soup)",
    "ingredients": [
      "500 g beetroot, peeled and grated",
      "1.5 L vegetable or beef stock",
      "1 carrot",
      "1 onion",
      "3 cloves garlic",
      "2 bay leaves",
      "4 allspice berries",
      "2 tbsp lemon juice or vinegar",
      "1 tsp sugar",
      "Sour cream and dill, to serve"
    ],
    "steps": [
      "Simmer the stock with the carrot, onion, bay leaves and allspice for 20 minutes.",
      "Add the beetroot and cook gently for 20 minutes, without boiling hard so the colour stays bright.",
      "Strain the soup and season with garlic, lemon juice, sugar, salt and pepper.",
      "Serve hot with sour cream and dill, or with small dumplings (uszka)."
    ]
  },
  {
    "id": "pl-kotlet-schabowy",
    "name": "Kotlet Schabowy (Polish Pork Cutlet)",
    "ingredients": [
      "4 boneless pork loin chops",
      "1/2 cup plain flour",
      "2 eggs, beaten",
      "1 cup breadcrumbs",
      "Salt and pepper",
      "Oil or lard for frying",
      "Boiled potatoes, dill and pickled cucumber (to serve)"
    ],
    "steps": [
      "Pound the pork chops thin between sheets of baking paper and season with salt and pepper.",
      "Coat in flour, then egg, then breadcrumbs, pressing so they stick.",
      "Fry in hot oil for 3 to 4 minutes per side until golden and cooked through.",
      "Drain on paper and serve with potatoes, dill and pickles."
    ]
  },
  {
    "id": "pl-placki-ziemniaczane",
    "name": "Placki Ziemniaczane (Potato Pancakes)",
    "ingredients": [
      "600 g potatoes, peeled",
      "1 small onion",
      "1 egg",
      "3 tbsp plain flour",
      "1 tsp salt",
      "Pepper",
      "Oil for frying",
      "Sour cream or sugar (to serve)"
    ],
    "steps": [
      "Grate the potatoes and onion, squeeze out the liquid, and pour off the water.",
      "Mix with the egg, flour, salt and pepper.",
      "Fry spoonfuls in hot oil for 3 to 4 minutes per side until crisp and golden.",
      "Drain on paper and serve with sour cream, or sprinkle with sugar."
    ]
  },
  {
    "id": "pl-sernik",
    "name": "Sernik (Polish Cheesecake)",
    "ingredients": [
      "1 kg farmer's cheese or twarog, ground (or ricotta)",
      "6 eggs, separated",
      "200 g sugar",
      "200 g butter, softened",
      "3 tbsp potato starch",
      "1 tsp vanilla",
      "Zest of 1 lemon",
      "100 g raisins (optional)"
    ],
    "steps": [
      "Heat the oven to 170°C and line a 24 cm tin.",
      "Beat the butter and sugar until fluffy, then add the yolks one at a time.",
      "Mix in the cheese, starch, vanilla and lemon zest.",
      "Whisk the egg whites to stiff peaks and gently fold them in, along with the raisins.",
      "Pour into the tin and bake for 60 to 70 minutes until set and golden.",
      "Let it cool in the oven with the door ajar, then chill before serving."
    ]
  },
  {
    "id": "pl-paczki",
    "name": "Paczki (Polish Doughnuts)",
    "ingredients": [
      "500 g plain flour",
      "7 g instant yeast",
      "80 g sugar",
      "250 ml warm milk",
      "4 egg yolks",
      "60 g melted butter",
      "1 tbsp spirit or vinegar",
      "Pinch of salt",
      "Rose jam or plum jam, for filling",
      "Oil for deep frying",
      "Icing sugar, to dust"
    ],
    "steps": [
      "Mix the flour, yeast, sugar and salt, then add the milk, yolks, butter and spirit, and knead for 10 minutes until smooth.",
      "Cover and let it rise for 1 hour until doubled.",
      "Roll out to 2 cm thick and cut out rounds. Let them rise for 30 minutes.",
      "Fry in oil at 170°C for 2 to 3 minutes per side until golden, with a pale band around the middle.",
      "Pipe jam into each doughnut once cooled slightly.",
      "Dust with icing sugar."
    ]
  }
];
const FLAN_AND_KATSU = [
  {
    "id": "es-flan",
    "name": "Flan (Crème Caramel)",
    "ingredients": [
      "3/4 cup sugar, for the caramel",
      "2 tbsp water",
      "4 eggs",
      "1 can (395 g) sweetened condensed milk",
      "1 can (360 ml) evaporated milk, or whole milk",
      "1 tsp vanilla",
      "Pinch of salt"
    ],
    "steps": [
      "Heat the oven to 160°C and boil a kettle of water.",
      "Melt the sugar with the 2 tbsp water in a pan over medium heat, without stirring, until it turns a deep amber caramel.",
      "Pour the caramel quickly into a 20 cm cake tin or ramekins, tilting to coat the base.",
      "Blend the eggs, condensed milk, evaporated milk, vanilla and salt until smooth, and strain it over the caramel.",
      "Place the tin in a deep roasting dish and pour hot water halfway up the sides.",
      "Bake for 50 to 60 minutes until set with a slight wobble in the centre.",
      "Cool, then chill for at least 4 hours.",
      "Run a knife around the edge and flip onto a plate so the caramel sauce pours over."
    ]
  },
  {
    "id": "jp-katsu-chicken-curry",
    "name": "Katsu Chicken Curry",
    "ingredients": [
      "2 chicken breasts, halved and flattened",
      "1/2 cup plain flour",
      "2 eggs, beaten",
      "1 1/2 cups panko breadcrumbs",
      "Oil for frying",
      "1 onion, sliced",
      "2 carrots, cut into chunks",
      "2 potatoes, cut into chunks",
      "1 tbsp oil",
      "600 ml chicken stock",
      "4 blocks Japanese curry roux, or 2 tbsp curry powder and 2 tbsp flour",
      "1 tbsp soy sauce",
      "1 small apple, grated",
      "Cooked rice, to serve"
    ],
    "steps": [
      "Fry the onion in the oil until soft, then add the carrots and potatoes.",
      "Pour in the stock and simmer for 15 minutes until the vegetables are tender.",
      "Turn the heat low and stir in the curry roux (or curry powder and flour), soy sauce and apple until thick and smooth.",
      "Coat the chicken in flour, then egg, then panko.",
      "Fry in hot oil for 3 to 4 minutes per side until golden and cooked through, then drain.",
      "Slice the chicken katsu.",
      "Serve over rice with the curry sauce poured alongside."
    ]
  }
];
const LUPIS_AND_SPREAD = [
  {
    "id": "id-lupis",
    "name": "Lupis (Pandan Sticky Rice Cake)",
    "ingredients": [
      "250 g glutinous rice flour",
      "1/4 tsp salt",
      "10 pandan leaves, or 1 tsp pandan paste",
      "About 250 ml water, for the dough",
      "Banana leaves, for wrapping (or baking paper and foil)",
      "150 g young coconut, freshly grated",
      "Pinch of salt, for the coconut",
      "150 g palm sugar (gula merah), chopped",
      "100 ml water, for the syrup",
      "1 pandan leaf, knotted"
    ],
    "steps": [
      "Blend the pandan leaves with about 250 ml water and strain through a sieve to get a bright green liquid (or mix in the pandan paste).",
      "Mix the glutinous rice flour and salt, then add the green liquid gradually, kneading into a soft dough that does not stick to your hands.",
      "Shape the dough into logs about 3 cm thick and 12 cm long.",
      "Soften the banana leaves by passing them over a flame or dipping them in hot water, then wrap each log tightly and tie the ends with string.",
      "Boil in plenty of water for 45 minutes (or steam for 40 minutes), then cool completely.",
      "Steam the grated coconut with a pinch of salt for 10 minutes and let it cool.",
      "Simmer the palm sugar, 100 ml water and the pandan leaf until the sugar dissolves and the syrup thickens slightly, then strain.",
      "Unwrap the lupis, slice into rounds, roll them in the grated coconut, and pour the palm sugar syrup over."
    ]
  },
  {
    "id": "it-hazelnut-chocolate-spread",
    "name": "Hazelnut Chocolate Spread",
    "ingredients": [
      "300 g hazelnuts",
      "150 g milk chocolate, melted",
      "3 tbsp unsweetened cocoa powder",
      "80 g icing sugar",
      "3 tbsp neutral oil (or more, if too thick)",
      "1/2 tsp vanilla extract",
      "Pinch of salt"
    ],
    "steps": [
      "Roast the hazelnuts on a tray at 180°C for 10 to 12 minutes until fragrant and the skins start to crack.",
      "Wrap the warm nuts in a clean towel and rub to remove most of the skins.",
      "Blend the nuts in a strong food processor for 10 to 15 minutes, scraping down the sides, until they turn into a smooth runny nut butter.",
      "Add the cocoa, icing sugar, vanilla and salt, and blend again.",
      "Pour in the melted chocolate and the oil, and blend until glossy and completely smooth.",
      "Spoon into a clean jar. Keep it in a cool place for up to 2 weeks, or in the fridge for up to a month. Stir before using."
    ]
  }
];
const CHEESECAKES = [
  {
    "id": "us-peanut-butter-cheesecake",
    "name": "Peanut Butter Cheesecake",
    "ingredients": [
      "200 g chocolate sandwich biscuits (or digestive biscuits)",
      "80 g butter, melted",
      "500 g full-fat cream cheese, at room temperature",
      "200 g smooth peanut butter",
      "120 g icing sugar",
      "1 tsp vanilla extract",
      "300 ml double cream, whipped to soft peaks",
      "Chopped roasted peanuts and melted chocolate, to decorate"
    ],
    "steps": [
      "Crush the biscuits to fine crumbs, mix with the melted butter and press firmly into the base of a lined 20 cm springform tin. Chill for 30 minutes.",
      "Beat the cream cheese, peanut butter, icing sugar and vanilla until completely smooth.",
      "Gently fold in the whipped cream until no streaks remain.",
      "Spread the filling over the base and smooth the top.",
      "Chill for at least 6 hours, or overnight, until set.",
      "Loosen the tin, remove the cheesecake and top with chopped peanuts and a drizzle of melted chocolate. Slice with a hot knife."
    ]
  },
  {
    "id": "dessert-banana-sour-cream-cheese-cake",
    "name": "Banana Sour Cream Cheese Cake",
    "ingredients": [
      "3 very ripe bananas, mashed",
      "200 g plain flour",
      "1 1/2 tsp baking powder",
      "1/2 tsp bicarbonate of soda",
      "1/4 tsp salt",
      "150 g butter, softened",
      "150 g sugar",
      "3 eggs",
      "120 g sour cream",
      "1 tsp vanilla extract",
      "250 g cream cheese, softened, for the frosting",
      "150 ml sour cream, for the frosting",
      "60 g icing sugar",
      "100 g cheddar or processed cheese, finely grated, for the top",
      "Chocolate cereal balls, to decorate"
    ],
    "steps": [
      "Heat the oven to 170°C. Grease and line a rectangular cake tin.",
      "Mix the flour, baking powder, bicarbonate of soda and salt.",
      "Beat the butter and sugar until pale and fluffy, then beat in the eggs one at a time.",
      "Stir in the mashed bananas, the sour cream and the vanilla, then fold in the dry ingredients until just combined.",
      "Pour into the tin and bake for 35 to 40 minutes, until a skewer comes out clean. Cool completely.",
      "Beat the cream cheese, sour cream and icing sugar into a smooth, thick frosting.",
      "Cover the top and sides of the cake with the frosting.",
      "Cover the top thickly with the grated cheese and decorate the edges with chocolate cereal balls. Chill for at least 1 hour before slicing."
    ]
  },
  {
    "id": "es-san-sebastian-cheesecake",
    "name": "San Sebastián Cheesecake (Basque Burnt Cheesecake)",
    "ingredients": [
      "800 g full-fat cream cheese, at room temperature",
      "200 g caster sugar",
      "5 eggs",
      "400 ml double cream",
      "1 tbsp plain flour",
      "1 tsp vanilla extract",
      "Pinch of salt"
    ],
    "steps": [
      "Heat the oven to 220°C. Line a 20 cm springform tin with two overlapping sheets of baking paper, letting it stand well above the rim; creases are fine.",
      "Beat the cream cheese and sugar until completely smooth.",
      "Beat in the eggs one at a time, then the cream, vanilla and salt.",
      "Sift in the flour and mix until just combined. The batter will be very runny.",
      "Pour into the tin and bake for 40 to 45 minutes, until deeply browned on top and still very wobbly in the middle.",
      "Cool in the tin, then chill for at least 4 hours or overnight. The centre will firm up as it chills.",
      "Serve slightly chilled or at room temperature."
    ]
  }
];
const BUILTIN_VER = 13;
const BUILTINS = [...SAMPLES.map((r) => ({ ...r, v: 1 })), ...INDONESIAN.map((r) => ({ ...r, v: 2 })), ...MORE_INDONESIAN.map((r) => ({ ...r, v: 3 })), ...EVEN_MORE.map((r) => ({ ...r, v: 4 })), ...KOREAN.map((r) => ({ ...r, v: 5 })), ...DRINKS_AND_MOCHI.map((r) => ({ ...r, v: 6 })), ...MORE_RECIPES.map((r) => ({ ...r, v: 7 })), ...ARAB_FOOD.map((r) => ({ ...r, v: 8 })), ...SHAKSHUKA.map((r) => ({ ...r, v: 9 })), ...ITALIAN_POLISH.map((r) => ({ ...r, v: 10 })), ...FLAN_AND_KATSU.map((r) => ({ ...r, v: 11 })), ...LUPIS_AND_SPREAD.map((r) => ({ ...r, v: 12 })), ...CHEESECAKES.map((r) => ({ ...r, v: 13 }))];

// Favorites are personal and saved on this device only.
const FAV_KEY = "pantree-favs";
let favs = new Set();
try { favs = new Set(JSON.parse(localStorage.getItem(FAV_KEY)) || []); } catch {}
const saveFavs = () => { try { localStorage.setItem(FAV_KEY, JSON.stringify([...favs])); } catch {} };
let favView = false;
// A link like ?addfav=id1,id2 saves those recipes as favorites on this device, then tidies the address.
try {
  const sp = new URLSearchParams(location.search);
  const add = (sp.get("addfav") || "").split(",").map((s) => s.trim()).filter((s) => /^[\w-]{1,80}$/.test(s));
  if (add.length) {
    add.forEach((id) => favs.add(id));
    saveFavs();
    sp.delete("addfav");
    sp.set("fav", "1");
    history.replaceState(null, "", location.pathname + "?" + sp.toString());
  }
} catch {}
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
  s1: ["Dessert", "American", "img/fluffy-pancakes.jpg"], s2: ["Pasta", "Italian"], s3: ["Sides", "Mexican"], s4: ["Soup", "International"],
  "sw-chicken-tikka-masala": ["Chicken", "Indian", "img/sw-chicken-tikka-masala.jpg"],
  "sw-classic-beef-lasagne": ["Pasta", "Italian"],
  "sw-lasagne": ["Pasta", "Italian", "img/sw-lasagne.jpg"],
  "sw-grilled-salmon": ["Seafood", "Modern", "img/sw-grilled-salmon.jpg"],
  "sw-fish-tacos": ["Seafood", "Mexican", "img/sw-fish-tacos.jpg"],
  "sw-spaghetti-carbonara": ["Pasta", "Italian", "img/sw-spaghetti-carbonara.jpg"],
  "sw-vegetable-stir-fry": ["Vegetarian", "Chinese"], "sw-mushroom-risotto": ["Vegetarian", "Italian"], "sw-lemon-roast-chicken": ["Chicken", "British"],
  "id-nasi-goreng": ["Rice & Noodles", "Indonesian"], "id-mie-goreng": ["Rice & Noodles", "Indonesian"], "id-soto-ayam": ["Soup", "Indonesian"],
  "id-beef-rendang": ["Beef", "Indonesian"], "id-gado-gado": ["Vegetarian", "Indonesian"], "id-sate-ayam": ["Chicken", "Indonesian"],
  "id-ayam-goreng": ["Chicken", "Indonesian"], "id-pisang-goreng": ["Dessert", "Indonesian"], "id-pempek": ["Seafood", "Indonesian"],
  "id-bakso": ["Soup", "Indonesian"], "id-es-campur": ["Dessert", "Indonesian"], "id-es-cendol": ["Dessert", "Indonesian"],
  "id-dodol": ["Dessert", "Indonesian"], "id-cheese-tteokbokki": ["Snacks", "Korean"], "id-bubble-tea": ["Drinks", "Taiwanese"],
  "id-hummus": ["Sides", "Arab"], "id-lupis": ["Dessert", "Indonesian", "img/lupis.jpg"], "us-peanut-butter-cheesecake": ["Dessert", "American"], "dessert-banana-sour-cream-cheese-cake": ["Dessert", "International", "img/banana-sour-cream-cheese-cake.jpg"], "es-san-sebastian-cheesecake": ["Dessert", "Spanish"], "it-hazelnut-chocolate-spread": ["Dessert", "Italian"], "es-flan": ["Dessert", "Spanish"], "jp-katsu-chicken-curry": ["Chicken", "Japanese", "img/katsu-chicken-curry.jpg"],
  "it-margherita-pizza": ["Pizza", "Italian"], "it-spaghetti-bolognese": ["Pasta", "Italian"], "it-chicken-parmigiana": ["Chicken", "Italian"],
  "it-minestrone": ["Soup", "Italian"], "it-bruschetta": ["Sides", "Italian"], "it-tiramisu": ["Dessert", "Italian", "img/tiramisu.jpg"], "it-panna-cotta": ["Dessert", "Italian"],
  "pl-pierogi-ruskie": ["Vegetarian", "Polish"], "pl-bigos": ["Pork", "Polish"], "pl-zurek": ["Soup", "Polish"], "pl-barszcz": ["Soup", "Polish"],
  "pl-kotlet-schabowy": ["Pork", "Polish"], "pl-placki-ziemniaczane": ["Sides", "Polish"], "pl-sernik": ["Dessert", "Polish"], "pl-paczki": ["Dessert", "Polish", "img/paczki.jpg"], "id-shakshuka": ["Breakfast", "Arab"], "id-tabbouleh": ["Sides", "Arab"], "id-fattoush": ["Sides", "Arab"],
  "id-chicken-kabsa": ["Chicken", "Arab"], "id-maqluba": ["Chicken", "Arab"], "id-shish-taouk": ["Chicken", "Arab"],
  "id-shorbat-adas": ["Soup", "Arab"], "id-kunafa": ["Dessert", "Arab"], "id-umm-ali": ["Dessert", "Arab"],
  "id-falafel": ["Vegetarian", "Arab"], "id-cheese-sticks": ["Snacks", "American"], "id-cinnamon-roll-biscuits": ["Dessert", "American"],
  "id-cabbage-rolls": ["Beef", "Polish"], "id-nalesniki": ["Dessert", "Polish"], "id-arepa": ["Breakfast", "Venezuelan"],
  "id-flatbread": ["Sides", "Arab"], "id-shawarma": ["Chicken", "Arab"], "id-ice-cream-mochi": ["Dessert", "Japanese"], "id-martabak-manis": ["Dessert", "Indonesian"]
};
const ICONS = { Dessert:"🍨", Soup:"🍲", Pasta:"🍝", Seafood:"🐟", Chicken:"🍗", Beef:"🥩", Vegetarian:"🥗", Snacks:"🥟", Breakfast:"🥞", "Rice & Noodles":"🍜", Drinks:"🥤", Sides:"🥑", Pizza:"🍕", Pork:"🥓" };
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
  if (img) return `<img src="${esc(img)}" alt="${esc(r.name)}" loading="lazy" onload="this.parentElement.classList.add('loaded')" onerror="this.parentElement.classList.add('loaded','broken')">`;
  return `<span aria-hidden="true">${ICONS[categoryOf(r)] || "🍽️"}</span>`;
};
// Broad words people type, matched to groups of recipes (for example "meal" = everything except desserts and drinks).
const SWEET = ["Dessert"], SIP = ["Drinks"], SIDE = ["Sides"];
const GROUPS = [
  { words: ["meal", "meals", "dinner", "lunch", "main", "mains", "food"], test: (r) => ![...SWEET, ...SIP, ...SIDE].includes(categoryOf(r)) },
  { words: ["sweet", "sweets", "treat", "treats", "dessert", "desserts"], test: (r) => SWEET.includes(categoryOf(r)) },
  { words: ["side", "sides", "snack", "snacks"], test: (r) => [...SIDE, "Snacks"].includes(categoryOf(r)) },
  { words: ["arabic", "arabian", "middle eastern", "middle-eastern"], test: (r) => areaOf(r) === "Arab" },
  { words: ["drink", "drinks", "beverage", "beverages"], test: (r) => SIP.includes(categoryOf(r)) },
];
// Alternate spellings people type.
const ALIASES = { satee: "satay", sate: "satay", lasagna: "lasagne", lasagnia: "lasagne", katsu: "katsu", flan: "flan" };
const groupFor = (q) => GROUPS.find((g) => g.words.includes(q));
const coverClass = (r) => "thumb" + (imageOf(r) ? " skel" : "");
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
  const q0 = $("search").value.trim().toLowerCase();
  const q = ALIASES[q0] || q0;
  const group = groupFor(q);
  const shown = recipes.filter((r) =>
    (!favView || favs.has(r.id)) &&
    (!q || (group && group.test(r)) || r.name.toLowerCase().includes(q) || r.ingredients.some((i) => i.toLowerCase().includes(q)) || tagsOf(r).some((t) => t.toLowerCase().includes(q))));
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
      <div class="${coverClass(r)}" style="${coverStyle(r)}">${coverHtml(r)}</div>
      <div class="meta"><h3>${esc(r.name)}</h3><p>${r.ingredients.length} ingredients · ${r.steps.length} steps</p></div></button>
      <div class="tags">${tagsOf(r).map((t) => `<button class="tag" data-q="${esc(t)}">${esc(t)}</button>`).join("")}</div>
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
  $("view-cover").className = coverClass(r);
  $("view-cover").setAttribute("style", coverStyle(r));
  $("view-cover").innerHTML = coverHtml(r);
  $("view").innerHTML =
    `<h2>${esc(r.name)}</h2><div class="tags">${tagsOf(r).map((t) => `<button class="tag" data-q="${esc(t)}">${esc(t)}</button>`).join("")}</div><a class="yt" href="${esc(videoUrl(r))}" target="_blank" rel="noopener noreferrer">▶ Watch on YouTube</a><h3>Ingredients</h3><ul>${r.ingredients.map((i) => `<li>${esc(i)}</li>`).join("")}</ul>` +
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
// Tapping a tag searches for it, just as if you had typed it.
function searchFor(text) {
  $("search").value = text;
  favView = false;
  syncSearchToUrl();
  render();
  scrollTo({ top: 0 });
}
$("view").onclick = async (e) => {
  const tag = e.target.closest(".tag");
  if (!tag) return;
  const text = tag.dataset.q;
  await closeView();
  searchFor(text);
};
$("list").onclick = (e) => {
  const tag = e.target.closest(".tag");
  if (tag) { searchFor(tag.dataset.q); return; }
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
try { navigator.storage && navigator.storage.persist && navigator.storage.persist(); } catch {}   // ask the browser not to clear offline data
