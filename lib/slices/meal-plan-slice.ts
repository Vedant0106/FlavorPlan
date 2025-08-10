import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

interface MealPlanItem {
  id: string
  recipeId: string
  date: string
  mealType: "breakfast" | "lunch" | "dinner"
}

interface MealPlanState {
  plannedMeals: MealPlanItem[]
  selectedWeek: string
}

const initialState: MealPlanState = {
  plannedMeals: [],
  selectedWeek: new Date().toISOString().split("T")[0],
}

const mealPlanSlice = createSlice({
  name: "mealPlan",
  initialState,
  reducers: {
    addMealToPlan: (state, action: PayloadAction<Omit<MealPlanItem, "id">>) => {
      const newMeal: MealPlanItem = {
        ...action.payload,
        id: Date.now().toString(),
      }
      state.plannedMeals.push(newMeal)
    },
    removeMealFromPlan: (state, action: PayloadAction<string>) => {
      state.plannedMeals = state.plannedMeals.filter((meal) => meal.id !== action.payload)
    },
    setSelectedWeek: (state, action: PayloadAction<string>) => {
      state.selectedWeek = action.payload
    },
  },
})

export const { addMealToPlan, removeMealFromPlan, setSelectedWeek } = mealPlanSlice.actions
export default mealPlanSlice.reducer
