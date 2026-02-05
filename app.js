const RecipeApp = (function () {

  console.log("RecipeApp initializing...");

  const recipes = [
    {
      id: 1,
      title: "Pasta Carbonara",
      difficulty: "easy",
      time: 20,
      ingredients: ["Pasta", "Eggs", "Parmesan", "Pepper", "Garlic"],
      steps: [
        "Boil water",
        "Cook pasta",
        {
          text: "Prepare sauce",
          substeps: [
            "Beat eggs",
            "Add cheese",
            "Add pepper"
          ]
        },
        "Mix pasta and sauce",
        "Serve hot"
      ]
    },
    {
      id: 2,
      title: "Chicken Biryani",
      difficulty: "hard",
      time: 60,
      ingredients: ["Rice", "Chicken", "Onion", "Spices", "Yogurt", "Oil"],
      steps: [
        "Wash rice",
        {
          text: "Prepare chicken masala",
          substeps: [
            "Heat oil",
            "Add onions",
            {
              text: "Add spices",
              substeps: ["Add chilli", "Add garam masala"]
            },
            "Add chicken"
          ]
        },
        "Cook rice",
        "Layer rice and chicken",
        "Dum cook and serve"
      ]
    },
    {
      id: 3,
      title: "Vegetable Stir Fry",
      difficulty: "easy",
      time: 15,
      ingredients: ["Carrot", "Beans", "Capsicum", "Soy sauce", "Oil"],
      steps: [
        "Chop vegetables",
        "Heat pan",
        "Add oil",
        "Add vegetables",
        "Stir and serve"
      ]
    },
    {
      id: 4,
      title: "Paneer Butter Masala",
      difficulty: "medium",
      time: 35,
      ingredients: ["Paneer", "Butter", "Tomato", "Cream", "Spices"],
      steps: [
        "Heat butter",
        "Prepare tomato gravy",
        "Add spices",
        "Add paneer",
        "Add cream and serve"
      ]
    },
    {
      id: 5,
      title: "Grilled Sandwich",
      difficulty: "easy",
      time: 10,
      ingredients: ["Bread", "Butter", "Cheese", "Vegetables"],
      steps: [
        "Apply butter",
        "Add vegetables",
        "Add cheese",
        "Grill sandwich",
        "Serve hot"
      ]
    },
    {
      id: 6,
      title: "Beef Steak",
      difficulty: "hard",
      time: 45,
      ingredients: ["Beef", "Salt", "Pepper", "Oil", "Garlic"],
      steps: [
        "Marinate steak",
        "Heat pan",
        "Cook one side",
        "Flip and cook",
        "Rest and serve"
      ]
    },
    {
      id: 7,
      title: "Tomato Soup",
      difficulty: "medium",
      time: 25,
      ingredients: ["Tomato", "Onion", "Garlic", "Butter", "Cream"],
      steps: [
        "Chop vegetables",
        "Boil tomatoes",
        "Blend mixture",
        "Heat soup",
        "Serve warm"
      ]
    },
    {
      id: 8,
      title: "Fried Rice",
      difficulty: "medium",
      time: 30,
      ingredients: ["Rice", "Vegetables", "Soy sauce", "Oil", "Garlic"],
      steps: [
        "Cook rice",
        "Heat pan",
        "Add vegetables",
        "Add rice",
        "Add sauce and mix"
      ]
    }
  ];

  const recipeContainer = document.getElementById("recipe-container");

  let currentFilter = "all";
  let currentSort = "none";

  const filterButtons = document.querySelectorAll("[data-filter]");
  const sortButtons = document.querySelectorAll("[data-sort]");

  /* ---------- recursion ---------- */

  const renderSteps = (steps, level = 0) => {
    let html = "";

    steps.forEach(step => {
      if (typeof step === "string") {
        html += `<li class="step-item level-${level}">${step}</li>`;
      } else {
        html += `<li class="step-item level-${level}">${step.text}</li>`;
        if (step.substeps) {
          html += renderSteps(step.substeps, level + 1);
        }
      }
    });

    return html;
  };

  const createStepsHTML = (steps) => {
    return `<ul class="steps-list">${renderSteps(steps)}</ul>`;
  };

  /* ---------- card ---------- */

  const createRecipeCard = (recipe) => {
    return `
      <div class="recipe-card" data-recipe-id="${recipe.id}">
        <h3>${recipe.title}</h3>

        <div class="recipe-meta">
          Difficulty: ${recipe.difficulty}<br>
          Time: ${recipe.time} mins
        </div>

        <button class="toggle-btn" data-toggle="steps" data-recipe-id="${recipe.id}">
          Show Steps
        </button>

        <button class="toggle-btn" data-toggle="ingredients" data-recipe-id="${recipe.id}">
          Show Ingredients
        </button>

        <div class="steps-container" data-container="steps" data-recipe-id="${recipe.id}">
          ${createStepsHTML(recipe.steps)}
        </div>

        <div class="ingredients-container" data-container="ingredients" data-recipe-id="${recipe.id}">
          <ul>
            ${recipe.ingredients.map(i => `<li>${i}</li>`).join("")}
          </ul>
        </div>
      </div>
    `;
  };

  const renderRecipes = (list) => {
    recipeContainer.innerHTML = list.map(createRecipeCard).join("");
  };

  /* ---------- filters ---------- */

  const filterByDifficulty = (list, level) =>
    list.filter(r => r.difficulty === level);

  const filterByTime = (list, max) =>
    list.filter(r => r.time < max);

  const applyFilter = (list, type) => {
    switch (type) {
      case "easy": return filterByDifficulty(list, "easy");
      case "medium": return filterByDifficulty(list, "medium");
      case "hard": return filterByDifficulty(list, "hard");
      case "quick": return filterByTime(list, 30);
      default: return list;
    }
  };

  /* ---------- sorts ---------- */

  const sortByName = list =>
    [...list].sort((a, b) => a.title.localeCompare(b.title));

  const sortByTime = list =>
    [...list].sort((a, b) => a.time - b.time);

  const applySort = (list, type) => {
    switch (type) {
      case "name": return sortByName(list);
      case "time": return sortByTime(list);
      default: return list;
    }
  };

  /* ---------- display ---------- */

  const updateDisplay = () => {
    let result = recipes;

    result = applyFilter(result, currentFilter);
    result = applySort(result, currentSort);

    renderRecipes(result);

    console.log(
      `Displaying ${result.length} recipes (Filter: ${currentFilter}, Sort: ${currentSort})`
    );
  };

  const updateActiveButtons = () => {
    filterButtons.forEach(b => {
      b.classList.remove("active");
      if (b.dataset.filter === currentFilter) b.classList.add("active");
    });

    sortButtons.forEach(b => {
      b.classList.remove("active");
      if (b.dataset.sort === currentSort) b.classList.add("active");
    });
  };

  /* ---------- toggle delegation ---------- */

  const handleToggleClick = (e) => {

    const button = e.target.closest(".toggle-btn");
    if (!button) return;

    const recipeId = button.dataset.recipeId;
    const toggleType = button.dataset.toggle;

    const container = recipeContainer.querySelector(
      `[data-container="${toggleType}"][data-recipe-id="${recipeId}"]`
    );

    if (!container) return;

    container.classList.toggle("visible");

    const isVisible = container.classList.contains("visible");

    if (toggleType === "steps") {
      button.textContent = isVisible ? "Hide Steps" : "Show Steps";
    }

    if (toggleType === "ingredients") {
      button.textContent = isVisible ? "Hide Ingredients" : "Show Ingredients";
    }
  };

  /* ---------- handlers ---------- */

  const handleFilterClick = (e) => {
    const value = e.target.dataset.filter;
    if (!value) return;

    currentFilter = value;
    updateActiveButtons();
    updateDisplay();
  };

  const handleSortClick = (e) => {
    const value = e.target.dataset.sort;
    if (!value) return;

    currentSort = value;
    updateActiveButtons();
    updateDisplay();
  };

  /* ---------- setup ---------- */

  const setupEventListeners = () => {

    filterButtons.forEach(btn =>
      btn.addEventListener("click", handleFilterClick)
    );

    sortButtons.forEach(btn =>
      btn.addEventListener("click", handleSortClick)
    );

    recipeContainer.addEventListener("click", handleToggleClick);

    console.log("Event listeners attached!");
  };

  const init = () => {
    setupEventListeners();
    updateActiveButtons();
    updateDisplay();
    console.log("RecipeApp ready!");
  };

  return {
    init,
    updateDisplay
  };

})();

RecipeApp.init();
