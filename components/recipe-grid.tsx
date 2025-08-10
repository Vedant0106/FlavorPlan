"use client"

import type React from "react"

import { useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import type { RootState, AppDispatch } from "@/lib/store"
import { setSearchTerm, searchRecipes, fetchRandomRecipes } from "@/lib/slices/recipes-slice"
import { toggleFavorite } from "@/lib/slices/favorites-slice"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, Clock, Users, Star, Filter, Search, Loader2 } from "lucide-react"
import { useState } from "react"
import RecipeFilters from "./recipe-filters"
import RecipeModal from "./recipe-modal"
import CuisineSelector from "./cuisine-selector"
import type { Recipe } from "@/lib/slices/recipes-slice"

export default function RecipeGrid() {
  const dispatch = useDispatch<AppDispatch>()
  const { recipes, searchTerm, loading, error } = useSelector((state: RootState) => state.recipes)
  const { favoriteIds } = useSelector((state: RootState) => state.favorites)
  const filters = useSelector((state: RootState) => state.filters)

  const [showFilters, setShowFilters] = useState(false)
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null)

  // Load random recipes on component mount
  useEffect(() => {
    if (recipes.length === 0) {
      dispatch(fetchRandomRecipes(12))
    }
  }, [dispatch, recipes.length])

  const handleSearch = () => {
    if (searchTerm.trim()) {
      dispatch(searchRecipes(searchTerm))
    } else {
      dispatch(fetchRandomRecipes(12))
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  const filteredAndSortedRecipes = recipes
    .filter((recipe) => {
      const matchesCuisine = !filters.cuisine || recipe.cuisine.toLowerCase() === filters.cuisine.toLowerCase()
      const matchesDiet =
        !filters.dietType || recipe.dietType.some((diet) => diet.toLowerCase() === filters.dietType.toLowerCase())
      const matchesDifficulty =
        !filters.difficulty || recipe.difficulty.toLowerCase() === filters.difficulty.toLowerCase()
      const matchesCategory = !filters.category || recipe.category.toLowerCase() === filters.category.toLowerCase()
      const matchesCookTime = recipe.cookTime <= filters.maxCookTime
      const matchesRating = recipe.rating >= filters.minRating
      const matchesCalories = recipe.calories <= filters.maxCalories
      const matchesProtein = recipe.macros.protein >= filters.minProtein
      const matchesSpiceLevel =
        !filters.spiceLevel || recipe.spiceLevel?.toLowerCase() === filters.spiceLevel.toLowerCase()

      return (
        matchesCuisine &&
        matchesDiet &&
        matchesDifficulty &&
        matchesCategory &&
        matchesCookTime &&
        matchesRating &&
        matchesCalories &&
        matchesProtein &&
        matchesSpiceLevel
      )
    })
    .sort((a, b) => {
      const getValue = (recipe: Recipe, sortBy: string) => {
        switch (sortBy) {
          case "rating":
            return recipe.rating
          case "cookTime":
            return recipe.cookTime
          case "calories":
            return recipe.calories
          case "prepTime":
            return recipe.prepTime
          case "popularity":
            return recipe.rating * 100 + Math.random() * 10 // Mock popularity
          default:
            return 0
        }
      }

      const aValue = getValue(a, filters.sortBy)
      const bValue = getValue(b, filters.sortBy)

      return filters.sortOrder === "asc" ? aValue - bValue : bValue - aValue
    })

  const handleFavoriteToggle = (recipeId: string) => {
    dispatch(toggleFavorite(recipeId))
  }

  return (
    <div className="space-y-6">
      {/* Cuisine Selector */}
      <CuisineSelector />

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 flex gap-2">
          <Input
            placeholder="Search recipes..."
            value={searchTerm}
            onChange={(e) => dispatch(setSearchTerm(e.target.value))}
            onKeyPress={handleKeyPress}
            className="flex-1"
          />
          <Button onClick={handleSearch} disabled={loading}>
            <Search className="h-4 w-4" />
          </Button>
        </div>
        <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          Filters
        </Button>
      </div>

      {showFilters && <RecipeFilters />}

      {/* Error State */}
      {error && (
        <div className="text-center py-8">
          <p className="text-red-500 mb-4">Error: {error}</p>
          <Button onClick={() => dispatch(fetchRandomRecipes(12))}>Try Again</Button>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
          <span className="ml-2 text-gray-600">Loading delicious recipes...</span>
        </div>
      )}

      {/* Recipe Grid */}
      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedRecipes.map((recipe, index) => (
            <Card
              key={recipe.id}
              className="group hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105 hover:-translate-y-2 animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardHeader className="p-0">
                <div className="relative overflow-hidden rounded-t-lg">
                  <img
                    src={recipe.image || "/placeholder.svg"}
                    alt={recipe.title}
                    className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                    onClick={() => setSelectedRecipe(recipe)}
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300"></div>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="absolute top-2 right-2 bg-white/80 hover:bg-white transition-all duration-200 hover:scale-110"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleFavoriteToggle(recipe.id)
                    }}
                  >
                    <Heart
                      className={`h-4 w-4 transition-all duration-200 ${
                        favoriteIds.includes(recipe.id)
                          ? "fill-red-500 text-red-500 scale-110"
                          : "text-gray-600 hover:text-red-500"
                      }`}
                    />
                  </Button>
                  <div className="absolute top-2 left-2">
                    <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-0 shadow-lg">
                      {recipe.rating} ⭐
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4" onClick={() => setSelectedRecipe(recipe)}>
                <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-orange-600 transition-colors duration-200">
                  {recipe.title}
                </h3>

                <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {recipe.cookTime}m
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {recipe.servings}
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    {recipe.rating}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-3">
                  <Badge variant="secondary">{recipe.cuisine}</Badge>
                  <Badge variant="outline">{recipe.category}</Badge>
                  <Badge variant="outline">{recipe.difficulty}</Badge>
                  {recipe.spiceLevel && (
                    <Badge variant="outline" className="text-orange-600">
                      🌶️ {recipe.spiceLevel}
                    </Badge>
                  )}
                </div>

                <div className="flex flex-wrap gap-1 mb-3">
                  {recipe.dietType.slice(0, 2).map((diet) => (
                    <Badge key={diet} variant="outline" className="text-xs bg-green-50 text-green-700">
                      {diet}
                    </Badge>
                  ))}
                  {recipe.dietType.length > 2 && (
                    <Badge variant="outline" className="text-xs">
                      +{recipe.dietType.length - 2}
                    </Badge>
                  )}
                </div>

                <div className="text-sm space-y-1">
                  <p className="text-gray-600">{recipe.calories} calories</p>
                  <div className="flex gap-3 text-xs text-gray-500">
                    <span>P: {recipe.macros.protein}g</span>
                    <span>C: {recipe.macros.carbs}g</span>
                    <span>F: {recipe.macros.fat}g</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* No Results */}
      {!loading && filteredAndSortedRecipes.length === 0 && recipes.length > 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No recipes found matching your criteria</p>
          <Button variant="outline" className="mt-4 bg-transparent" onClick={() => dispatch(fetchRandomRecipes(12))}>
            Show Random Recipes
          </Button>
        </div>
      )}

      {/* Recipe Modal */}
      {selectedRecipe && (
        <RecipeModal recipe={selectedRecipe} isOpen={!!selectedRecipe} onClose={() => setSelectedRecipe(null)} />
      )}
    </div>
  )
}
