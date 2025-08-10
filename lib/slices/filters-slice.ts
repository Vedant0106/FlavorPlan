import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

interface FiltersState {
  cuisine: string
  dietType: string
  difficulty: string
  category: string
  maxCookTime: number
  minRating: number
  maxCalories: number
  minProtein: number
  spiceLevel: string
  sortBy: "popularity" | "rating" | "cookTime" | "calories" | "prepTime"
  sortOrder: "asc" | "desc"
}

const initialState: FiltersState = {
  cuisine: "",
  dietType: "",
  difficulty: "",
  category: "",
  maxCookTime: 60,
  minRating: 0,
  maxCalories: 1000,
  minProtein: 0,
  spiceLevel: "",
  sortBy: "popularity",
  sortOrder: "desc",
}

const filtersSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    setCuisine: (state, action: PayloadAction<string>) => {
      state.cuisine = action.payload
    },
    setDietType: (state, action: PayloadAction<string>) => {
      state.dietType = action.payload
    },
    setDifficulty: (state, action: PayloadAction<string>) => {
      state.difficulty = action.payload
    },
    setCategory: (state, action: PayloadAction<string>) => {
      state.category = action.payload
    },
    setMaxCookTime: (state, action: PayloadAction<number>) => {
      state.maxCookTime = action.payload
    },
    setMinRating: (state, action: PayloadAction<number>) => {
      state.minRating = action.payload
    },
    setMaxCalories: (state, action: PayloadAction<number>) => {
      state.maxCalories = action.payload
    },
    setMinProtein: (state, action: PayloadAction<number>) => {
      state.minProtein = action.payload
    },
    setSpiceLevel: (state, action: PayloadAction<string>) => {
      state.spiceLevel = action.payload
    },
    setSortBy: (state, action: PayloadAction<"popularity" | "rating" | "cookTime" | "calories" | "prepTime">) => {
      state.sortBy = action.payload
    },
    setSortOrder: (state, action: PayloadAction<"asc" | "desc">) => {
      state.sortOrder = action.payload
    },
    resetFilters: (state) => {
      state.cuisine = ""
      state.dietType = ""
      state.difficulty = ""
      state.category = ""
      state.maxCookTime = 60
      state.minRating = 0
      state.maxCalories = 1000
      state.minProtein = 0
      state.spiceLevel = ""
      state.sortBy = "popularity"
      state.sortOrder = "desc"
    },
  },
})

export const {
  setCuisine,
  setDietType,
  setDifficulty,
  setCategory,
  setMaxCookTime,
  setMinRating,
  setMaxCalories,
  setMinProtein,
  setSpiceLevel,
  setSortBy,
  setSortOrder,
  resetFilters,
} = filtersSlice.actions
export default filtersSlice.reducer
