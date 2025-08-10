"use client"

import { useSelector, useDispatch } from "react-redux"
import type { RootState } from "@/lib/store"
import {
  setCuisine,
  setDietType,
  setMaxCookTime,
  setMinRating,
  resetFilters,
  setSortBy,
  setSortOrder,
} from "@/lib/slices/filters-slice"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { setCategory, setSpiceLevel, setMaxCalories, setMinProtein } from "@/lib/slices/filters-slice"
import { ArrowUpDown, X } from "lucide-react"

export default function RecipeFilters() {
  const dispatch = useDispatch()
  const filters = useSelector((state: RootState) => state.filters)

  const activeFiltersCount =
    [filters.cuisine, filters.dietType, filters.category, filters.spiceLevel, filters.difficulty].filter(Boolean)
      .length +
    (filters.maxCookTime !== 60 ? 1 : 0) +
    (filters.minRating !== 0 ? 1 : 0) +
    (filters.maxCalories !== 1000 ? 1 : 0) +
    (filters.minProtein !== 0 ? 1 : 0)

  return (
    <Card className="animate-slide-down">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            Filters & Sorting
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                {activeFiltersCount} active
              </Badge>
            )}
          </div>
          <Button variant="outline" size="sm" onClick={() => dispatch(resetFilters())}>
            <X className="h-4 w-4 mr-1" />
            Reset
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Sort Controls */}
        <div className="bg-gray-50 rounded-lg p-4">
          <Label className="text-sm font-medium text-gray-700 mb-3 block">Sort Results</Label>
          <div className="flex gap-3">
            <Select value={filters.sortBy} onValueChange={(value: any) => dispatch(setSortBy(value))}>
              <SelectTrigger className="flex-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="popularity">Popularity</SelectItem>
                <SelectItem value="rating">Rating</SelectItem>
                <SelectItem value="cookTime">Cook Time</SelectItem>
                <SelectItem value="calories">Calories</SelectItem>
                <SelectItem value="prepTime">Prep Time</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="sm"
              onClick={() => dispatch(setSortOrder(filters.sortOrder === "asc" ? "desc" : "asc"))}
              className="px-3"
            >
              <ArrowUpDown className="h-4 w-4" />
              {filters.sortOrder === "asc" ? "↑" : "↓"}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label>Cuisine</Label>
            <Select value={filters.cuisine} onValueChange={(value) => dispatch(setCuisine(value))}>
              <SelectTrigger>
                <SelectValue placeholder="Any cuisine" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any cuisine</SelectItem>
                <SelectItem value="Indian">Indian</SelectItem>
                <SelectItem value="Italian">Italian</SelectItem>
                <SelectItem value="Chinese">Chinese</SelectItem>
                <SelectItem value="Mexican">Mexican</SelectItem>
                <SelectItem value="Thai">Thai</SelectItem>
                <SelectItem value="American">American</SelectItem>
                <SelectItem value="French">French</SelectItem>
                <SelectItem value="Japanese">Japanese</SelectItem>
                <SelectItem value="British">British</SelectItem>
                <SelectItem value="Greek">Greek</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Diet Type</Label>
            <Select value={filters.dietType} onValueChange={(value) => dispatch(setDietType(value))}>
              <SelectTrigger>
                <SelectValue placeholder="Any diet" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any diet</SelectItem>
                <SelectItem value="Vegetarian">🥬 Vegetarian</SelectItem>
                <SelectItem value="Vegan">🌱 Vegan</SelectItem>
                <SelectItem value="Keto">🥑 Keto</SelectItem>
                <SelectItem value="Paleo">🥩 Paleo</SelectItem>
                <SelectItem value="Gluten-Free">🌾 Gluten-Free</SelectItem>
                <SelectItem value="Low-Carb">⚡ Low-Carb</SelectItem>
                <SelectItem value="High-Protein">💪 High-Protein</SelectItem>
                <SelectItem value="High-Fiber">🌿 High-Fiber</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Category</Label>
            <Select value={filters.category} onValueChange={(value) => dispatch(setCategory(value))}>
              <SelectTrigger>
                <SelectValue placeholder="Any category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any category</SelectItem>
                <SelectItem value="Breakfast">🌅 Breakfast</SelectItem>
                <SelectItem value="Lunch">☀️ Lunch</SelectItem>
                <SelectItem value="Dinner">🌙 Dinner</SelectItem>
                <SelectItem value="Snack">🍿 Snack</SelectItem>
                <SelectItem value="Dessert">🍰 Dessert</SelectItem>
                <SelectItem value="Appetizer">🥗 Appetizer</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Spice Level</Label>
            <Select value={filters.spiceLevel} onValueChange={(value) => dispatch(setSpiceLevel(value))}>
              <SelectTrigger>
                <SelectValue placeholder="Any spice level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any spice level</SelectItem>
                <SelectItem value="Mild">🌶️ Mild</SelectItem>
                <SelectItem value="Medium">🌶️🌶️ Medium</SelectItem>
                <SelectItem value="Hot">🌶️🌶️🌶️ Hot</SelectItem>
                <SelectItem value="Very Hot">🌶️🌶️🌶️🌶️ Very Hot</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="space-y-2">
            <Label>Max Cook Time: {filters.maxCookTime} min</Label>
            <Slider
              value={[filters.maxCookTime]}
              onValueChange={(value) => dispatch(setMaxCookTime(value[0]))}
              max={60}
              min={5}
              step={5}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label>Min Rating: {filters.minRating} stars</Label>
            <Slider
              value={[filters.minRating]}
              onValueChange={(value) => dispatch(setMinRating(value[0]))}
              max={5}
              min={0}
              step={0.5}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label>Max Calories: {filters.maxCalories}</Label>
            <Slider
              value={[filters.maxCalories]}
              onValueChange={(value) => dispatch(setMaxCalories(value[0]))}
              max={1000}
              min={100}
              step={50}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label>Min Protein: {filters.minProtein}g</Label>
            <Slider
              value={[filters.minProtein]}
              onValueChange={(value) => dispatch(setMinProtein(value[0]))}
              max={50}
              min={0}
              step={5}
              className="w-full"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
