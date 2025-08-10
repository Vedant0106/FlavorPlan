"use client"

import { useSelector } from "react-redux"
import type { RootState } from "@/lib/store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { ShoppingCart, Calendar } from "lucide-react"
import { useState } from "react"

export default function ShoppingList() {
  const { plannedMeals } = useSelector((state: RootState) => state.mealPlan)
  const { recipes } = useSelector((state: RootState) => state.recipes)
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set())

  const getShoppingList = () => {
    const ingredientMap = new Map<string, { count: number; recipes: string[] }>()

    plannedMeals.forEach((meal) => {
      const recipe = recipes.find((r) => r.id === meal.recipeId)
      if (recipe) {
        recipe.ingredients.forEach((ingredient) => {
          const key = ingredient.toLowerCase()
          if (ingredientMap.has(key)) {
            const existing = ingredientMap.get(key)!
            existing.count += 1
            existing.recipes.push(recipe.title)
          } else {
            ingredientMap.set(key, { count: 1, recipes: [recipe.title] })
          }
        })
      }
    })

    return Array.from(ingredientMap.entries()).map(([ingredient, data]) => ({
      ingredient,
      count: data.count,
      recipes: [...new Set(data.recipes)], // Remove duplicates
    }))
  }

  const handleItemCheck = (ingredient: string) => {
    const newCheckedItems = new Set(checkedItems)
    if (newCheckedItems.has(ingredient)) {
      newCheckedItems.delete(ingredient)
    } else {
      newCheckedItems.add(ingredient)
    }
    setCheckedItems(newCheckedItems)
  }

  const shoppingList = getShoppingList()
  const checkedCount = shoppingList.filter((item) => checkedItems.has(item.ingredient)).length

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2 flex items-center justify-center gap-2">
          <ShoppingCart className="h-6 w-6" />
          Shopping List
        </h2>
        <p className="text-gray-600">Generated from your meal plan</p>
      </div>

      {shoppingList.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg mb-2">No shopping list yet</p>
            <p className="text-gray-400">Add meals to your plan to generate a shopping list</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Ingredients Needed</span>
              <Badge variant="secondary">
                {checkedCount}/{shoppingList.length} checked
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {shoppingList.map(({ ingredient, count, recipes }) => (
                <div
                  key={ingredient}
                  className={`flex items-start gap-3 p-3 rounded-lg border transition-colors ${
                    checkedItems.has(ingredient) ? "bg-gray-50 text-gray-500 line-through" : "bg-white"
                  }`}
                >
                  <Checkbox
                    checked={checkedItems.has(ingredient)}
                    onCheckedChange={() => handleItemCheck(ingredient)}
                    className="mt-1"
                  />
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium capitalize">{ingredient}</span>
                      {count > 1 && (
                        <Badge variant="outline" className="text-xs">
                          {count}x
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">For: {recipes.join(", ")}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
