"use client"

import { useState, useEffect, useRef } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import {
  ChefHat,
  ArrowLeft,
  ArrowRight,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  SkipForward,
  Lightbulb,
  Scale,
  Timer,
} from "lucide-react"
import type { Recipe } from "@/lib/slices/recipes-slice"

interface CookModeProps {
  recipe: Recipe
  isOpen: boolean
  onClose: () => void
}

export default function CookMode({ recipe, isOpen, onClose }: CookModeProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [timer, setTimer] = useState(0)
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const [voiceEnabled, setVoiceEnabled] = useState(false)
  const [autoAdvance, setAutoAdvance] = useState(true)
  const [customTimer, setCustomTimer] = useState([5])
  const [showIngredients, setShowIngredients] = useState(false)
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set())
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Initialize audio for timer notification
  useEffect(() => {
    audioRef.current = new Audio(
      "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT",
    )
  }, [])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isTimerRunning && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            setIsTimerRunning(false)
            // Timer finished - play notification and auto-advance if enabled
            if (audioRef.current) {
              audioRef.current.play().catch(() => {})
            }

            // Show browser notification
            if (Notification.permission === "granted") {
              new Notification("Timer Finished!", {
                body: `Step ${currentStep + 1} timer completed`,
                icon: "/favicon.ico",
              })
            }

            // Auto-advance to next step if enabled
            if (autoAdvance && currentStep < recipe.instructions.length - 1) {
              setTimeout(() => {
                nextStep()
              }, 1000)
            }

            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isTimerRunning, timer, autoAdvance, currentStep, recipe.instructions.length])

  // Request notification permission on mount
  useEffect(() => {
    if (isOpen && Notification.permission === "default") {
      Notification.requestPermission()
    }
  }, [isOpen])

  const speakText = (text: string) => {
    if (voiceEnabled && "speechSynthesis" in window) {
      // Cancel any ongoing speech
      speechSynthesis.cancel()

      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 0.8
      utterance.pitch = 1
      utterance.volume = 0.8

      // Use a more natural voice if available
      const voices = speechSynthesis.getVoices()
      const preferredVoice = voices.find(
        (voice) => voice.name.includes("Google") || voice.name.includes("Microsoft") || voice.lang.startsWith("en"),
      )
      if (preferredVoice) {
        utterance.voice = preferredVoice
      }

      speechSynthesis.speak(utterance)
    }
  }

  const nextStep = () => {
    if (currentStep < recipe.instructions.length - 1) {
      const newStep = currentStep + 1
      setCurrentStep(newStep)

      // Mark current step as completed
      setCompletedSteps((prev) => new Set([...prev, currentStep]))

      if (voiceEnabled) {
        speakText(`Step ${newStep + 1}. ${recipe.instructions[newStep]}`)
      }

      // Stop current timer when moving to next step
      setIsTimerRunning(false)
      setTimer(0)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      const newStep = currentStep - 1
      setCurrentStep(newStep)

      if (voiceEnabled) {
        speakText(`Going back to step ${newStep + 1}. ${recipe.instructions[newStep]}`)
      }

      // Stop current timer when moving to previous step
      setIsTimerRunning(false)
      setTimer(0)
    }
  }

  const startTimer = (minutes: number) => {
    setTimer(minutes * 60)
    setIsTimerRunning(true)

    if (voiceEnabled) {
      speakText(`Timer started for ${minutes} minute${minutes > 1 ? "s" : ""}`)
    }
  }

  const startCustomTimer = () => {
    startTimer(customTimer[0])
  }

  const toggleVoice = () => {
    const newVoiceState = !voiceEnabled
    setVoiceEnabled(newVoiceState)

    if (newVoiceState) {
      speakText(`Voice assistant enabled. Currently on step ${currentStep + 1}. ${recipe.instructions[currentStep]}`)
    } else {
      speechSynthesis.cancel()
    }
  }

  const readCurrentStep = () => {
    speakText(`Step ${currentStep + 1}. ${recipe.instructions[currentStep]}`)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const progress = ((currentStep + 1) / recipe.instructions.length) * 100
  const isLastStep = currentStep === recipe.instructions.length - 1

  // Extract cooking tips from the current step
  const getCookingTips = (instruction: string) => {
    const tips = []
    if (instruction.toLowerCase().includes("heat") || instruction.toLowerCase().includes("temperature")) {
      tips.push("🌡️ Use a thermometer for precise temperature control")
    }
    if (instruction.toLowerCase().includes("mix") || instruction.toLowerCase().includes("stir")) {
      tips.push("🥄 Stir gently to avoid overmixing")
    }
    if (instruction.toLowerCase().includes("season") || instruction.toLowerCase().includes("salt")) {
      tips.push("🧂 Taste as you go and adjust seasoning gradually")
    }
    return tips
  }

  const currentTips = getCookingTips(recipe.instructions[currentStep])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[95vh] p-0 overflow-hidden">
        <div className="bg-gradient-to-br from-orange-500 to-red-500 text-white p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <ChefHat className="h-8 w-8" />
              <div>
                <h2 className="text-2xl font-bold">{recipe.title}</h2>
                <p className="text-orange-100">Cook Mode - Smart Kitchen Assistant</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleVoice}
                className={`text-white hover:bg-white/20 ${voiceEnabled ? "bg-white/20" : ""}`}
              >
                {voiceEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowIngredients(!showIngredients)}
                className="text-white hover:bg-white/20"
              >
                <Scale className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span>
                Step {currentStep + 1} of {recipe.instructions.length}
              </span>
              <div className="flex items-center gap-4">
                <span>{progress.toFixed(0)}% Complete</span>
                <label className="flex items-center gap-2 text-xs">
                  <input
                    type="checkbox"
                    checked={autoAdvance}
                    onChange={(e) => setAutoAdvance(e.target.checked)}
                    className="rounded"
                  />
                  Auto-advance
                </label>
              </div>
            </div>
            <Progress value={progress} className="h-2 bg-white/20" />
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Main Content */}
          <div className="flex-1 p-8 space-y-6 overflow-y-auto">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Badge
                  variant="secondary"
                  className={`text-lg px-4 py-2 ${completedSteps.has(currentStep) ? "bg-green-100 text-green-800" : ""}`}
                >
                  Step {currentStep + 1}
                  {completedSteps.has(currentStep) && " ✓"}
                </Badge>
                {voiceEnabled && (
                  <Button size="sm" variant="outline" onClick={readCurrentStep} className="ml-2 bg-transparent">
                    🔊 Read
                  </Button>
                )}
              </div>
              <p className="text-2xl leading-relaxed text-gray-800 font-medium mb-6">
                {recipe.instructions[currentStep]}
              </p>

              {/* Cooking Tips */}
              {currentTips.length > 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Lightbulb className="h-5 w-5 text-amber-600" />
                    <span className="font-semibold text-amber-800">Cooking Tips</span>
                  </div>
                  <ul className="text-sm text-amber-700 space-y-1">
                    {currentTips.map((tip, index) => (
                      <li key={index}>{tip}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Enhanced Timer Section */}
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="flex items-center justify-center gap-4 mb-4">
                <Timer className="h-6 w-6 text-orange-600" />
                <span className="text-lg font-semibold">Smart Timer</span>
                {timer > 0 && (
                  <Badge variant={isTimerRunning ? "default" : "secondary"}>
                    {isTimerRunning ? "Running" : "Paused"}
                  </Badge>
                )}
              </div>

              {timer > 0 && (
                <div className="mb-6 text-center">
                  <div
                    className={`text-5xl font-bold mb-3 ${timer <= 10 ? "text-red-500 animate-pulse" : "text-orange-600"}`}
                  >
                    {formatTime(timer)}
                  </div>
                  <div className="flex justify-center gap-2 mb-4">
                    <Button
                      size="sm"
                      onClick={() => setIsTimerRunning(!isTimerRunning)}
                      className="bg-orange-500 hover:bg-orange-600"
                    >
                      {isTimerRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setTimer(0)
                        setIsTimerRunning(false)
                      }}
                    >
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                    {autoAdvance && (
                      <Button size="sm" variant="outline" onClick={nextStep} disabled={isLastStep}>
                        <SkipForward className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <Progress
                    value={timer > 0 ? ((customTimer[0] * 60 - timer) / (customTimer[0] * 60)) * 100 : 0}
                    className="h-2 mb-2"
                  />
                </div>
              )}

              {/* Quick Timer Buttons */}
              <div className="space-y-4">
                <div className="flex justify-center gap-2 flex-wrap">
                  {[1, 3, 5, 10, 15, 20, 30].map((minutes) => (
                    <Button
                      key={minutes}
                      size="sm"
                      variant="outline"
                      onClick={() => startTimer(minutes)}
                      className="hover:bg-orange-50 hover:border-orange-300"
                    >
                      {minutes}m
                    </Button>
                  ))}
                </div>

                {/* Custom Timer */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Custom Timer: {customTimer[0]} minutes</label>
                  <div className="flex items-center gap-3">
                    <Slider
                      value={customTimer}
                      onValueChange={setCustomTimer}
                      max={60}
                      min={1}
                      step={1}
                      className="flex-1"
                    />
                    <Button size="sm" onClick={startCustomTimer} className="bg-orange-500 hover:bg-orange-600">
                      Start
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Ingredients Sidebar */}
          {showIngredients && (
            <div className="w-80 border-l bg-gray-50 p-6 overflow-y-auto">
              <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <Scale className="h-5 w-5" />
                Ingredients
              </h3>
              <ul className="space-y-2">
                {recipe.ingredients.map((ingredient, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
                    {ingredient}
                  </li>
                ))}
              </ul>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-800 mb-2">Recipe Info</h4>
                <div className="text-sm text-blue-700 space-y-1">
                  <p>Serves: {recipe.servings}</p>
                  <p>Prep: {recipe.prepTime}m</p>
                  <p>Cook: {recipe.cookTime}m</p>
                  <p>Difficulty: {recipe.difficulty}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Enhanced Navigation */}
        <div className="border-t bg-gray-50 p-6">
          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 0}
              className="flex items-center gap-2 bg-transparent"
            >
              <ArrowLeft className="h-4 w-4" />
              Previous
            </Button>

            <div className="flex items-center gap-2">
              {recipe.instructions.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentStep(index)}
                  className={`w-4 h-4 rounded-full transition-all duration-300 ${
                    index === currentStep
                      ? "bg-orange-500 scale-125"
                      : completedSteps.has(index)
                        ? "bg-green-500"
                        : index < currentStep
                          ? "bg-blue-500"
                          : "bg-gray-300"
                  }`}
                  title={`Go to step ${index + 1}`}
                />
              ))}
            </div>

            <Button
              onClick={nextStep}
              disabled={isLastStep}
              className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600"
            >
              {isLastStep ? "Complete" : "Next"}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
