"use client"

import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "@/lib/store"
import { addMealToPlan } from "@/lib/slices/meal-plan-slice"
import { toggleFavorite } from "@/lib/slices/favorites-slice"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Heart, Clock, Users, Star, Calendar, Plus, Play, ChefHat } from "lucide-react"
import type { Recipe } from "@/lib/slices/recipes-slice"
import InteractiveNutrition from "./interactive-nutrition"
import CookMode from "./cook-mode"

interface RecipeModalProps {
  recipe: Recipe
  isOpen: boolean
  onClose: () => void
}

export default function RecipeModal({ recipe, isOpen, onClose }: RecipeModalProps) {
  const dispatch = useDispatch()
  const { favoriteIds } = useSelector((state: RootState) => state.favorites)
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedMealType, setSelectedMealType] = useState<"breakfast" | "lunch" | "dinner">("dinner")
  const [showCookMode, setShowCookMode] = useState(false)

  const isFavorite = favoriteIds.includes(recipe.id)

  const handleAddToPlan = () => {
    if (selectedDate) {
      dispatch(
        addMealToPlan({
          recipeId: recipe.id,
          date: selectedDate,
          mealType: selectedMealType,
        }),
      )
      onClose()
    }
  }

  const getNextWeekDates = () => {
    const dates = []
    const today = new Date()
    for (let i = 0; i < 7; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)
      dates.push(date.toISOString().split("T")[0])
    }
    return dates
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">{recipe.title}</div>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  onClick={() => setShowCookMode(true)}
                  className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
                >
                  <ChefHat className="h-4 w-4 mr-1" />
                  Cook Mode
                </Button>
                {recipe.videoUrl && (
                  <Button size="sm" variant="outline" onClick={() => window.open(recipe.videoUrl, "_blank")}>
                    <Play className="h-4 w-4 mr-1" />
                    Video
                  </Button>
                )}
                <Button size="sm" variant="ghost" onClick={() => dispatch(toggleFavorite(recipe.id))}>
                  <Heart
                    className={`h-5 w-5 transition-all duration-200 ${isFavorite ? "fill-red-500 text-red-500 scale-110" : "text-gray-600"}`}
                  />
                </Button>
              </div>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            <img
              src={recipe.image || "/placeholder.svg"}
              alt={recipe.title}
              className="w-full h-64 object-cover rounded-lg"
            />

            <div className="flex items-center gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                Prep: {recipe.prepTime}m | Cook: {recipe.cookTime}m
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                {recipe.servings} servings
              </div>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                {recipe.rating}
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">{recipe.cuisine}</Badge>
              <Badge variant="outline">{recipe.category}</Badge>
              <Badge variant="outline">{recipe.difficulty}</Badge>
              {recipe.spiceLevel && (
                <Badge variant="outline" className="text-orange-600">
                  🌶️ {recipe.spiceLevel}
                </Badge>
              )}
              {recipe.dietType.map((diet) => (
                <Badge key={diet} variant="outline" className="bg-green-50 text-green-700">
                  {diet}
                </Badge>
              ))}
            </div>

            {/* Interactive Nutrition */}
            <InteractiveNutrition recipe={recipe} />

            {/* Tags */}
            {recipe.tags.length > 0 && (
              <div>
                <h3 className="font-semibold text-lg mb-2">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {recipe.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="bg-blue-50 text-blue-700">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-lg mb-3">Ingredients</h3>
                <ul className="space-y-2">
                  {recipe.ingredients.map((ingredient, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
                      {ingredient}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-3">Instructions</h3>
                <ol className="space-y-3">
                  {recipe.instructions.map((instruction, index) => (
                    <li key={index} className="flex gap-3">
                      <span className="bg-orange-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium flex-shrink-0">
                        {index + 1}
                      </span>
                      <span className="text-sm">{instruction}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            <div className="border-t pt-6">
              <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Add to Meal Plan
              </h3>
              <div className="flex flex-col sm:flex-row gap-3">
                <Select value={selectedDate} onValueChange={setSelectedDate}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Select date" />
                  </SelectTrigger>
                  <SelectContent>
                    {getNextWeekDates().map((date) => (
                      <SelectItem key={date} value={date}>
                        {new Date(date).toLocaleDateString("en-US", {
                          weekday: "long",
                          month: "short",
                          day: "numeric",
                        })}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={selectedMealType}
                  onValueChange={(value: "breakfast" | "lunch" | "dinner") => setSelectedMealType(value)}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="breakfast">Breakfast</SelectItem>
                    <SelectItem value="lunch">Lunch</SelectItem>
                    <SelectItem value="dinner">Dinner</SelectItem>
                  </SelectContent>
                </Select>

                <Button onClick={handleAddToPlan} disabled={!selectedDate}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Cook Mode Modal */}
      <CookMode recipe={recipe} isOpen={showCookMode} onClose={() => setShowCookMode(false)} />
    </>
  )
}
