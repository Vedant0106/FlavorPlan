"use client"

import { useDispatch, useSelector } from "react-redux"
import type { RootState, AppDispatch } from "@/lib/store"
import { fetchRecipesByCuisine, fetchRandomRecipes, setSelectedCuisine } from "@/lib/slices/recipes-slice"
import { Badge } from "@/components/ui/badge"
import SurpriseMeAnimation from "./surprise-me-animation"

const cuisines = [
  { name: "Indian" },
  { name: "Italian" },
  { name: "Chinese" },
  { name: "Mexican" },
  { name: "Thai" },
  { name: "American" },
  { name: "French" },
  { name: "Japanese" },
  { name: "British" },
  { name: "Greek" },
]

export default function CuisineSelector() {
  const dispatch = useDispatch<AppDispatch>()
  const { selectedCuisine, loading } = useSelector((state: RootState) => state.recipes)

  const handleCuisineSelect = (cuisine: string) => {
    if (selectedCuisine === cuisine) {
      dispatch(setSelectedCuisine(""))
      dispatch(fetchRandomRecipes(12))
    } else {
      dispatch(setSelectedCuisine(cuisine))
      dispatch(fetchRecipesByCuisine(cuisine))
    }
  }

  const handleRandomRecipes = () => {
    dispatch(setSelectedCuisine(""))
    dispatch(fetchRandomRecipes(12))
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-between gap-4">
        <h3 className="text-xl font-semibold text-gray-800 text-center sm:text-left">Explore World Cuisines</h3>
        <SurpriseMeAnimation onSurpriseMe={handleRandomRecipes} loading={loading} />
      </div>

      <div className="flex flex-wrap justify-center gap-3">
        {cuisines.map((cuisine, index) => (
          <button
            key={cuisine.name}
            onClick={() => handleCuisineSelect(cuisine.name)}
            disabled={loading}
            className={`
              px-4 py-3 rounded-full border transition-all duration-300 transform
              hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed
              animate-fade-in group relative overflow-hidden
              ${
                selectedCuisine === cuisine.name
                  ? "bg-gradient-to-r from-orange-500 to-red-500 text-white border-orange-500 shadow-lg scale-105 animate-pulse"
                  : "bg-white text-gray-700 border-gray-200 hover:border-orange-300 hover:bg-gradient-to-r hover:from-orange-50 hover:to-red-50"
              }
            `}
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <span className="font-medium text-sm relative z-10 transition-all duration-300 group-hover:scale-105">
              {cuisine.name}
            </span>
            {selectedCuisine !== cuisine.name && (
              <div className="absolute inset-0 bg-gradient-to-r from-orange-400/10 to-red-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            )}
          </button>
        ))}
      </div>

      {selectedCuisine && (
        <div className="flex justify-center animate-slide-up">
          <Badge className="bg-gradient-to-r from-orange-100 to-red-100 text-orange-800 px-6 py-2 text-sm font-medium border border-orange-200 shadow-lg animate-bounce">
            ✨ Showing {selectedCuisine} recipes
          </Badge>
        </div>
      )}
    </div>
  )
}
