import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"

export interface Recipe {
  id: string
  title: string
  image: string
  cookTime: number
  prepTime: number
  servings: number
  difficulty: "Easy" | "Medium" | "Hard"
  cuisine: string
  dietType: string[]
  category: "Breakfast" | "Lunch" | "Dinner" | "Snack" | "Dessert" | "Appetizer"
  ingredients: string[]
  instructions: string[]
  calories: number
  rating: number
  macros: {
    protein: number
    carbs: number
    fat: number
    fiber: number
  }
  tags: string[]
  spiceLevel?: "Mild" | "Medium" | "Hot" | "Very Hot"
  source: string
  videoUrl?: string
}

interface RecipesState {
  recipes: Recipe[]
  loading: boolean
  searchTerm: string
  selectedCuisine: string
  error: string | null
}

// Transform MealDB recipe to our format
const transformMealDBRecipe = (meal: any): Recipe => {
  const ingredients = []
  const instructions = meal.strInstructions
    ? meal.strInstructions.split("\n").filter((step: string) => step.trim())
    : []

  // Extract ingredients from MealDB format
  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`]
    const measure = meal[`strMeasure${i}`]
    if (ingredient && ingredient.trim()) {
      ingredients.push(`${measure ? measure.trim() + " " : ""}${ingredient.trim()}`)
    }
  }

  // Estimate nutritional values based on cuisine and ingredients
  const estimateNutrition = (cuisine: string, ingredientCount: number) => {
    const baseCalories = ingredientCount * 25 + Math.random() * 100 + 200
    const cuisineMultipliers: Record<string, any> = {
      Indian: { protein: 1.2, carbs: 1.3, fat: 1.1, calories: 1.1 },
      Italian: { protein: 1.0, carbs: 1.4, fat: 1.2, calories: 1.2 },
      Chinese: { protein: 1.1, carbs: 1.2, fat: 0.9, calories: 1.0 },
      Mexican: { protein: 1.3, carbs: 1.1, fat: 1.0, calories: 1.1 },
      Thai: { protein: 1.1, carbs: 1.0, fat: 0.8, calories: 0.9 },
      American: { protein: 1.4, carbs: 1.2, fat: 1.3, calories: 1.3 },
      French: { protein: 1.0, carbs: 1.1, fat: 1.4, calories: 1.2 },
      Japanese: { protein: 1.2, carbs: 1.0, fat: 0.7, calories: 0.8 },
      British: { protein: 1.1, carbs: 1.3, fat: 1.2, calories: 1.1 },
      Greek: { protein: 1.1, carbs: 1.0, fat: 1.1, calories: 1.0 },
    }

    const multiplier = cuisineMultipliers[cuisine] || { protein: 1.0, carbs: 1.0, fat: 1.0, calories: 1.0 }

    return {
      protein: Math.round(((baseCalories * 0.15) / 4) * multiplier.protein),
      carbs: Math.round(((baseCalories * 0.5) / 4) * multiplier.carbs),
      fat: Math.round(((baseCalories * 0.35) / 9) * multiplier.fat),
      fiber: Math.round(ingredientCount * 0.8 + Math.random() * 5),
      calories: Math.round(baseCalories * multiplier.calories),
    }
  }

  const nutrition = estimateNutrition(meal.strArea || "Unknown", ingredients.length)

  // Determine diet types based on ingredients and category
  const dietTypes = []
  const ingredientText = ingredients.join(" ").toLowerCase()

  if (
    !ingredientText.includes("meat") &&
    !ingredientText.includes("chicken") &&
    !ingredientText.includes("beef") &&
    !ingredientText.includes("pork") &&
    !ingredientText.includes("fish")
  ) {
    dietTypes.push("Vegetarian")
  }
  if (
    !ingredientText.includes("dairy") &&
    !ingredientText.includes("cheese") &&
    !ingredientText.includes("milk") &&
    !ingredientText.includes("butter") &&
    !ingredientText.includes("cream")
  ) {
    if (dietTypes.includes("Vegetarian")) {
      dietTypes.push("Vegan")
    }
  }
  if (nutrition.protein > 20) {
    dietTypes.push("High-Protein")
  }
  if (nutrition.carbs < 20) {
    dietTypes.push("Low-Carb")
  }
  if (nutrition.fiber > 8) {
    dietTypes.push("High-Fiber")
  }

  // Determine spice level for certain cuisines
  let spiceLevel: "Mild" | "Medium" | "Hot" | "Very Hot" | undefined
  if (["Indian", "Thai", "Mexican"].includes(meal.strArea)) {
    const spiceLevels: ("Mild" | "Medium" | "Hot" | "Very Hot")[] = ["Mild", "Medium", "Hot"]
    spiceLevel = spiceLevels[Math.floor(Math.random() * spiceLevels.length)]
  }

  return {
    id: meal.idMeal,
    title: meal.strMeal,
    image: meal.strMealThumb,
    cookTime: Math.floor(Math.random() * 40) + 15, // Random cook time 15-55 mins
    prepTime: Math.floor(Math.random() * 20) + 5, // Random prep time 5-25 mins
    servings: Math.floor(Math.random() * 4) + 2, // Random servings 2-6
    difficulty: ["Easy", "Medium", "Hard"][Math.floor(Math.random() * 3)] as "Easy" | "Medium" | "Hard",
    cuisine: meal.strArea || "International",
    dietType: dietTypes,
    category:
      meal.strCategory === "Breakfast"
        ? "Breakfast"
        : meal.strCategory === "Dessert"
          ? "Dessert"
          : (["Lunch", "Dinner"][Math.floor(Math.random() * 2)] as "Lunch" | "Dinner"),
    ingredients,
    instructions,
    calories: nutrition.calories,
    rating: Math.round((Math.random() * 1.5 + 3.5) * 10) / 10, // Random rating 3.5-5.0
    macros: {
      protein: nutrition.protein,
      carbs: nutrition.carbs,
      fat: nutrition.fat,
      fiber: nutrition.fiber,
    },
    tags: [meal.strCategory, meal.strArea].filter(Boolean),
    spiceLevel,
    source: "TheMealDB",
    videoUrl: meal.strYoutube,
  }
}

// Async thunk to fetch recipes by cuisine
export const fetchRecipesByCuisine = createAsyncThunk("recipes/fetchByCuisine", async (cuisine: string) => {
  const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${cuisine}`)
  const data = await response.json()

  if (!data.meals) return []

  // Get detailed info for each recipe (limit to 8 recipes per cuisine for performance)
  const detailedRecipes = await Promise.all(
    data.meals.slice(0, 8).map(async (meal: any) => {
      const detailResponse = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${meal.idMeal}`)
      const detailData = await detailResponse.json()
      return transformMealDBRecipe(detailData.meals[0])
    }),
  )

  return detailedRecipes
})

// Async thunk to fetch random recipes
export const fetchRandomRecipes = createAsyncThunk("recipes/fetchRandom", async (count = 12) => {
  const recipes = []
  for (let i = 0; i < count; i++) {
    const response = await fetch("https://www.themealdb.com/api/json/v1/1/random.php")
    const data = await response.json()
    if (data.meals && data.meals[0]) {
      recipes.push(transformMealDBRecipe(data.meals[0]))
    }
  }
  return recipes
})

// Async thunk to search recipes
export const searchRecipes = createAsyncThunk("recipes/search", async (searchTerm: string) => {
  const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchTerm}`)
  const data = await response.json()

  if (!data.meals) return []

  return data.meals.map(transformMealDBRecipe)
})

const initialState: RecipesState = {
  recipes: [],
  loading: false,
  searchTerm: "",
  selectedCuisine: "",
  error: null,
}

const recipesSlice = createSlice({
  name: "recipes",
  initialState,
  reducers: {
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload
    },
    setSelectedCuisine: (state, action: PayloadAction<string>) => {
      state.selectedCuisine = action.payload
    },
    clearRecipes: (state) => {
      state.recipes = []
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch by cuisine
      .addCase(fetchRecipesByCuisine.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchRecipesByCuisine.fulfilled, (state, action) => {
        state.loading = false
        state.recipes = action.payload
      })
      .addCase(fetchRecipesByCuisine.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Failed to fetch recipes"
      })
      // Fetch random recipes
      .addCase(fetchRandomRecipes.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchRandomRecipes.fulfilled, (state, action) => {
        state.loading = false
        state.recipes = action.payload
      })
      .addCase(fetchRandomRecipes.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Failed to fetch recipes"
      })
      // Search recipes
      .addCase(searchRecipes.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(searchRecipes.fulfilled, (state, action) => {
        state.loading = false
        state.recipes = action.payload
      })
      .addCase(searchRecipes.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Failed to search recipes"
      })
  },
})

export const { setSearchTerm, setSelectedCuisine, clearRecipes } = recipesSlice.actions
export default recipesSlice.reducer
