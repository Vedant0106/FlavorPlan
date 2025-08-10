"use client"

import { useSelector } from "react-redux"
import type { RootState } from "@/lib/store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Target, Zap, Activity } from "lucide-react"

export default function NutritionDashboard() {
  const { plannedMeals } = useSelector((state: RootState) => state.mealPlan)
  const { recipes } = useSelector((state: RootState) => state.recipes)

  const getTodayNutrition = () => {
    const today = new Date().toISOString().split("T")[0]
    const todayMeals = plannedMeals.filter((meal) => meal.date === today)

    let totalCalories = 0
    let totalProtein = 0
    let totalCarbs = 0
    let totalFat = 0
    let totalFiber = 0

    todayMeals.forEach((meal) => {
      const recipe = recipes.find((r) => r.id === meal.recipeId)
      if (recipe) {
        totalCalories += recipe.calories
        totalProtein += recipe.macros.protein
        totalCarbs += recipe.macros.carbs
        totalFat += recipe.macros.fat
        totalFiber += recipe.macros.fiber
      }
    })

    return {
      calories: totalCalories,
      protein: totalProtein,
      carbs: totalCarbs,
      fat: totalFat,
      fiber: totalFiber,
      mealsCount: todayMeals.length,
    }
  }

  const getWeeklyStats = () => {
    const weekDates = []
    const today = new Date()
    for (let i = 0; i < 7; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)
      weekDates.push(date.toISOString().split("T")[0])
    }

    let totalMeals = 0
    let avgCalories = 0
    let avgProtein = 0
    const cuisineCount = new Map<string, number>()

    weekDates.forEach((date) => {
      const dayMeals = plannedMeals.filter((meal) => meal.date === date)
      totalMeals += dayMeals.length

      dayMeals.forEach((meal) => {
        const recipe = recipes.find((r) => r.id === meal.recipeId)
        if (recipe) {
          avgCalories += recipe.calories
          avgProtein += recipe.macros.protein
          cuisineCount.set(recipe.cuisine, (cuisineCount.get(recipe.cuisine) || 0) + 1)
        }
      })
    })

    const topCuisine = Array.from(cuisineCount.entries()).sort((a, b) => b[1] - a[1])[0]

    return {
      totalMeals,
      avgCalories: totalMeals > 0 ? Math.round(avgCalories / totalMeals) : 0,
      avgProtein: totalMeals > 0 ? Math.round(avgProtein / totalMeals) : 0,
      topCuisine: topCuisine ? topCuisine[0] : "None",
    }
  }

  const todayNutrition = getTodayNutrition()
  const weeklyStats = getWeeklyStats()

  // Daily targets (example values)
  const targets = {
    calories: 2000,
    protein: 150,
    carbs: 250,
    fat: 65,
    fiber: 25,
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2 flex items-center justify-center gap-2">
          <Activity className="h-6 w-6" />
          Nutrition Dashboard
        </h2>
        <p className="text-gray-600">Track your daily nutrition and weekly progress</p>
      </div>

      {/* Today's Nutrition */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Today's Nutrition
          </CardTitle>
        </CardHeader>
        <CardContent>
          {todayNutrition.mealsCount === 0 ? (
            <p className="text-center text-gray-500 py-4">No meals planned for today</p>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{todayNutrition.calories}</div>
                  <div className="text-sm text-gray-600">Calories</div>
                  <Progress value={(todayNutrition.calories / targets.calories) * 100} className="mt-2 h-2" />
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">{todayNutrition.protein}g</div>
                  <div className="text-sm text-gray-600">Protein</div>
                  <Progress value={(todayNutrition.protein / targets.protein) * 100} className="mt-2 h-2" />
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">{todayNutrition.carbs}g</div>
                  <div className="text-sm text-gray-600">Carbs</div>
                  <Progress value={(todayNutrition.carbs / targets.carbs) * 100} className="mt-2 h-2" />
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{todayNutrition.fat}g</div>
                  <div className="text-sm text-gray-600">Fat</div>
                  <Progress value={(todayNutrition.fat / targets.fat) * 100} className="mt-2 h-2" />
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{todayNutrition.fiber}g</div>
                  <div className="text-sm text-gray-600">Fiber</div>
                  <Progress value={(todayNutrition.fiber / targets.fiber) * 100} className="mt-2 h-2" />
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Weekly Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Weekly Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{weeklyStats.totalMeals}</div>
              <div className="text-sm text-gray-600">Total Meals Planned</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{weeklyStats.avgCalories}</div>
              <div className="text-sm text-gray-600">Avg Calories/Meal</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">{weeklyStats.avgProtein}g</div>
              <div className="text-sm text-gray-600">Avg Protein/Meal</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <Badge variant="secondary" className="text-lg px-3 py-1">
                {weeklyStats.topCuisine}
              </Badge>
              <div className="text-sm text-gray-600 mt-1">Top Cuisine</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Tips */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Nutrition Tips
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-semibold text-green-800 mb-2">High Protein Options</h4>
              <p className="text-sm text-green-700">
                Try our Tandoori Chicken Salad or Palak Paneer for protein-rich meals that support muscle building.
              </p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">Low Carb Choices</h4>
              <p className="text-sm text-blue-700">
                Keto-friendly options like Butter Chicken and Thai Basil Chicken are perfect for low-carb diets.
              </p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <h4 className="font-semibold text-purple-800 mb-2">Fiber Rich Foods</h4>
              <p className="text-sm text-purple-700">
                Include Chana Masala and Moroccan Tagine for high-fiber meals that aid digestion.
              </p>
            </div>
            <div className="p-4 bg-orange-50 rounded-lg">
              <h4 className="font-semibold text-orange-800 mb-2">Balanced Nutrition</h4>
              <p className="text-sm text-orange-700">
                Mix different cuisines throughout the week for a variety of nutrients and flavors.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
