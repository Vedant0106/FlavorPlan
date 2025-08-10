"use client"

import { useSelector, useDispatch } from "react-redux"
import type { RootState } from "@/lib/store"
import { removeMealFromPlan } from "@/lib/slices/meal-plan-slice"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Trash2, Clock, Users } from "lucide-react"

export default function MealPlanner() {
  const dispatch = useDispatch()
  const { plannedMeals } = useSelector((state: RootState) => state.mealPlan)
  const { recipes } = useSelector((state: RootState) => state.recipes)

  const getNextWeekDates = () => {
    const dates = []
    const today = new Date()
    for (let i = 0; i < 7; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)
      dates.push({
        date: date.toISOString().split("T")[0],
        display: date.toLocaleDateString("en-US", {
          weekday: "long",
          month: "short",
          day: "numeric",
        }),
      })
    }
    return dates
  }

  const getMealsForDate = (date: string) => {
    return plannedMeals.filter((meal) => meal.date === date)
  }

  const getRecipeById = (recipeId: string) => {
    return recipes.find((recipe) => recipe.id === recipeId)
  }

  const weekDates = getNextWeekDates()

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Your Meal Plan</h2>
        <p className="text-gray-600">Plan your meals for the week ahead</p>
      </div>

      <div className="grid gap-4">
        {weekDates.map(({ date, display }) => {
          const dayMeals = getMealsForDate(date)

          return (
            <Card key={date}>
              <CardHeader>
                <CardTitle className="text-lg">{display}</CardTitle>
              </CardHeader>
              <CardContent>
                {dayMeals.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No meals planned</p>
                ) : (
                  <div className="grid gap-4 md:grid-cols-3">
                    {["breakfast", "lunch", "dinner"].map((mealType) => {
                      const meal = dayMeals.find((m) => m.mealType === mealType)
                      const recipe = meal ? getRecipeById(meal.recipeId) : null

                      return (
                        <div key={mealType} className="space-y-2">
                          <h4 className="font-medium capitalize text-sm text-gray-600">{mealType}</h4>
                          {recipe ? (
                            <div className="border rounded-lg p-3 space-y-2">
                              <div className="flex items-start justify-between">
                                <h5 className="font-medium text-sm line-clamp-2">{recipe.title}</h5>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => dispatch(removeMealFromPlan(meal!.id))}
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                              <div className="flex items-center gap-3 text-xs text-gray-600">
                                <div className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {recipe.cookTime}m
                                </div>
                                <div className="flex items-center gap-1">
                                  <Users className="h-3 w-3" />
                                  {recipe.servings}
                                </div>
                              </div>
                              <Badge variant="outline" className="text-xs">
                                {recipe.cuisine}
                              </Badge>
                            </div>
                          ) : (
                            <div className="border-2 border-dashed border-gray-200 rounded-lg p-3 text-center text-xs text-gray-400">
                              No meal planned
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {plannedMeals.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg mb-2">No meals planned yet</p>
          <p className="text-gray-400">Go to the Recipes tab to add meals to your plan</p>
        </div>
      )}
    </div>
  )
}
