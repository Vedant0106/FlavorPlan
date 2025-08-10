"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import RecipeGrid from "./recipe-grid"
import MealPlanner from "./meal-planner"
import ShoppingList from "./shopping-list"
import NutritionDashboard from "./nutrition-dashboard"
import { Search, ChefHat, Calendar, ShoppingCart, BarChart3 } from "lucide-react"

export default function RecipeApp() {
  const [activeTab, setActiveTab] = useState("recipes")

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <ChefHat className="h-8 w-8 text-orange-600" />
            <h1 className="text-4xl font-bold text-gray-900">FlavorPlan</h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover amazing recipes from around the world, plan your meals, track nutrition, and generate shopping
            lists
          </p>
        </header>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 max-w-2xl mx-auto mb-8">
            <TabsTrigger value="recipes" className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              <span className="hidden sm:inline">Recipes</span>
            </TabsTrigger>
            <TabsTrigger value="planner" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span className="hidden sm:inline">Planner</span>
            </TabsTrigger>
            <TabsTrigger value="nutrition" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Nutrition</span>
            </TabsTrigger>
            <TabsTrigger value="shopping" className="flex items-center gap-2">
              <ShoppingCart className="h-4 w-4" />
              <span className="hidden sm:inline">Shopping</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="recipes">
            <RecipeGrid />
          </TabsContent>

          <TabsContent value="planner">
            <MealPlanner />
          </TabsContent>

          <TabsContent value="nutrition">
            <NutritionDashboard />
          </TabsContent>

          <TabsContent value="shopping">
            <ShoppingList />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
