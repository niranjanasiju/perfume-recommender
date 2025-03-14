"use client"

import type React from "react"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { recommendPerfume } from "@/lib/actions"
import RecommendationDisplay from "./recommendation-display"
import { Loader2 } from "lucide-react"

export default function PerfumeForm() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [formData, setFormData] = useState({
    personality: "",
    places: "",
    scentPreference: "",
    season: "",
    mood: "",
  })
  const [recommendation, setRecommendation] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const questions = [
    {
      id: "personality",
      question: "How would you describe your personality?",
      type: "select",
      options: [
        { value: "outgoing", label: "Outgoing & Adventurous" },
        { value: "calm", label: "Calm & Collected" },
        { value: "creative", label: "Creative & Artistic" },
        { value: "sophisticated", label: "Sophisticated & Elegant" },
        { value: "playful", label: "Playful & Energetic" },
      ],
    },
    {
      id: "places",
      question: "What kind of places do you enjoy visiting?",
      type: "select",
      options: [
        { value: "beach", label: "Beaches & Coastal Areas" },
        { value: "forest", label: "Forests & Mountains" },
        { value: "city", label: "Urban City Centers" },
        { value: "cafe", label: "Cozy Cafés & Bookstores" },
        { value: "garden", label: "Gardens & Flower Fields" },
      ],
    },
    {
      id: "scentPreference",
      question: "What type of scent do you prefer?",
      type: "radio",
      options: [
        { value: "floral", label: "Floral (Rose, Jasmine, Lily)" },
        { value: "woody", label: "Woody (Sandalwood, Cedar, Vetiver)" },
        { value: "oriental", label: "Oriental (Vanilla, Amber, Spices)" },
        { value: "fresh", label: "Fresh (Citrus, Ocean, Green Notes)" },
        { value: "gourmand", label: "Gourmand (Sweet, Edible Notes)" },
      ],
    },
    {
      id: "season",
      question: "What is your ideal season?",
      type: "radio",
      options: [
        { value: "spring", label: "Spring" },
        { value: "summer", label: "Summer" },
        { value: "fall", label: "Fall" },
        { value: "winter", label: "Winter" },
      ],
    },
    {
      id: "mood",
      question: "What mood do you want your perfume to reflect?",
      type: "input",
      placeholder: "e.g., romantic, confident, relaxed, mysterious...",
    },
  ]

  const handleInputChange = (id: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }))
  }

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const result = await recommendPerfume(formData)
      setRecommendation(result)
    } catch (error) {
      console.error("Error getting recommendation:", error)
    } finally {
      setLoading(false)
    }
  }

  const currentQ = questions[currentQuestion]
  const isLastQuestion = currentQuestion === questions.length - 1
  const isFormComplete = Object.values(formData).every((val) => val.trim() !== "")

  if (recommendation) {
    return (
      <RecommendationDisplay
        recommendation={recommendation}
        onReset={() => {
          setRecommendation(null)
          setCurrentQuestion(0)
          setFormData({
            personality: "",
            places: "",
            scentPreference: "",
            season: "",
            mood: "",
          })
        }}
      />
    )
  }

  return (
    <Card className="w-full shadow-lg border-amber-200 bg-white/80 backdrop-blur-sm">
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-between text-sm text-amber-700 mb-2">
            <span>
              Question {currentQuestion + 1} of {questions.length}
            </span>
            <span>{Math.round(((currentQuestion + 1) / questions.length) * 100)}% complete</span>
          </div>

          <div className="w-full bg-amber-100 h-2 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-amber-400 to-rose-400"
              initial={{ width: `${(currentQuestion / questions.length) * 100}%` }}
              animate={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="min-h-[200px]"
            >
              <div className="mb-6">
                <h2 className="text-2xl font-medium text-amber-900 mb-4">{currentQ.question}</h2>

                {currentQ.type === "select" && (
                  <Select
                    value={formData[currentQ.id as keyof typeof formData]}
                    onValueChange={(value) => handleInputChange(currentQ.id, value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select an option" />
                    </SelectTrigger>
                    <SelectContent>
                      {currentQ.options?.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}

                {currentQ.type === "radio" && (
                  <RadioGroup
                    value={formData[currentQ.id as keyof typeof formData]}
                    onValueChange={(value) => handleInputChange(currentQ.id, value)}
                    className="space-y-3"
                  >
                    {currentQ.options?.map((option) => (
                      <div key={option.value} className="flex items-center space-x-2">
                        <RadioGroupItem value={option.value} id={option.value} />
                        <Label htmlFor={option.value} className="cursor-pointer">
                          {option.label}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                )}

                {currentQ.type === "input" && (
                  <Input
                    value={formData[currentQ.id as keyof typeof formData]}
                    onChange={(e) => handleInputChange(currentQ.id, e.target.value)}
                    placeholder={currentQ.placeholder}
                    className="w-full"
                  />
                )}
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-between pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className="border-amber-300 text-amber-700 hover:bg-amber-50"
            >
              Previous
            </Button>

            {!isLastQuestion ? (
              <Button
                type="button"
                onClick={handleNext}
                disabled={!formData[currentQ.id as keyof typeof formData]}
                className="bg-gradient-to-r from-amber-500 to-rose-400 hover:from-amber-600 hover:to-rose-500 text-white"
              >
                Next
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={loading || !isFormComplete}
                className="bg-gradient-to-r from-amber-500 to-rose-400 hover:from-amber-600 hover:to-rose-500 text-white"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Finding your scent...
                  </>
                ) : (
                  "Get Recommendation"
                )}
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

