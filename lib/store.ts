import { configureStore } from "@reduxjs/toolkit"
import recipesReducer from "./slices/recipes-slice"
import favoritesReducer from "./slices/favorites-slice"
import mealPlanReducer from "./slices/meal-plan-slice"
import filtersReducer from "./slices/filters-slice"

export const store = configureStore({
  reducer: {
    recipes: recipesReducer,
    favorites: favoritesReducer,
    mealPlan: mealPlanReducer,
    filters: filtersReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
