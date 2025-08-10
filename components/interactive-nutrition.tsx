"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import type { Recipe } from "@/lib/slices/recipes-slice"

interface InteractiveNutritionProps {
  recipe: Recipe
}

export default function InteractiveNutrition({ recipe }: InteractiveNutritionProps) {
  const [selectedMacro, setSelectedMacro] = useState<string | null>(null)

  // Daily recommended values (example for 2000 calorie diet)
  const dailyValues = {
    calories: 2000,
    protein: 50, // grams
    carbs: 300, // grams
    fat: 65, // grams
    fiber: 25, // grams
  }

  const getPercentage = (value: number, daily: number) => {
    return Math.min((value / daily) * 100, 100)
  }

  const macros = [
    {
      key: "calories",
      label: "Calories",
      value: recipe.calories,
      daily: dailyValues.calories,
      color: "bg-blue-500",
      bgColor: "bg-blue-50",
      textColor: "text-blue-700",
    },
    {
      key: "protein",
      label: "Protein",
      value: recipe.macros.protein,
      daily: dailyValues.protein,
      unit: "g",
      color: "bg-red-500",
      bgColor: "bg-red-50",
      textColor: "text-red-700",
    },
    {
      key: "carbs",
      label: "Carbs",
      value: recipe.macros.carbs,
      daily: dailyValues.carbs,
      unit: "g",
      color: "bg-yellow-500",
      bgColor: "bg-yellow-50",
      textColor: "text-yellow-700",
    },
    {
      key: "fat",
      label: "Fat",
      value: recipe.macros.fat,
      daily: dailyValues.fat,
      unit: "g",
      color: "bg-green-500",
      bgColor: "bg-green-50",
      textColor: "text-green-700",
    },
    {
      key: "fiber",
      label: "Fiber",
      value: recipe.macros.fiber,
      daily: dailyValues.fiber,
      unit: "g",
      color: "bg-purple-500",
      bgColor: "bg-purple-50",
      textColor: "text-purple-700",
    },
  ]

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <h3 className="font-semibold text-lg mb-4">Nutritional Information (per serving)</h3>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          {macros.map((macro) => (
            <div
              key={macro.key}
              className={`
                text-center p-4 rounded-xl cursor-pointer transition-all duration-300 transform
                hover:scale-105 hover:shadow-lg
                ${selectedMacro === macro.key ? `${macro.bgColor} ring-2 ring-${macro.color.replace("bg-", "")} scale-105` : "bg-gray-50 hover:bg-gray-100"}
              `}
              onClick={() => setSelectedMacro(selectedMacro === macro.key ? null : macro.key)}
            >
              <div
                className={`text-2xl font-bold ${selectedMacro === macro.key ? macro.textColor : "text-gray-800"} transition-colors duration-300`}
              >
                {macro.value}
                {macro.unit || ""}
              </div>
              <div className="text-sm text-gray-600 mb-2">{macro.label}</div>

              {selectedMacro === macro.key && (
                <div className="animate-slide-down space-y-2">
                  <Progress value={getPercentage(macro.value, macro.daily)} className="h-2" />
                  <div className="text-xs text-gray-600">
                    {getPercentage(macro.value, macro.daily).toFixed(1)}% of daily value
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {selectedMacro && (
          <div className="animate-slide-up bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-4 border border-orange-200">
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-3 h-3 rounded-full ${macros.find((m) => m.key === selectedMacro)?.color}`}></div>
              <span className="font-medium text-gray-800">
                {macros.find((m) => m.key === selectedMacro)?.label} Details
              </span>
            </div>
            <p className="text-sm text-gray-600">
              This recipe provides{" "}
              <span className="font-semibold">
                {macros.find((m) => m.key === selectedMacro)?.value}
                {macros.find((m) => m.key === selectedMacro)?.unit || ""}
              </span>{" "}
              of {macros.find((m) => m.key === selectedMacro)?.label.toLowerCase()}, which is{" "}
              <span className="font-semibold">
                {getPercentage(
                  macros.find((m) => m.key === selectedMacro)?.value || 0,
                  macros.find((m) => m.key === selectedMacro)?.daily || 1,
                ).toFixed(1)}
                %
              </span>{" "}
              of your daily recommended intake.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
