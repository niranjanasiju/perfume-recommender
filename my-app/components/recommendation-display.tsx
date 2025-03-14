"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Sparkles, RefreshCw } from "lucide-react"

interface RecommendationDisplayProps {
  recommendation: string
  onReset: () => void
}

export default function RecommendationDisplay({ recommendation, onReset }: RecommendationDisplayProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const formatRecommendation = (text: string) => {
    const lines = text.split("\n")
    return lines.map((line, index) => {
      if (line.includes(":")) {
        const [title, content] = line.split(":")
        return (
          <div key={index} className="mb-4">
            <h3 className="text-xl font-medium text-amber-800">{title.trim()}:</h3>
            <p className="text-amber-700">{content.trim()}</p>
          </div>
        )
      }
      return (
        <p key={index} className="mb-2 text-amber-700">
          {line.trim()}
        </p>
      )
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: isVisible ? 1 : 0, scale: isVisible ? 1 : 0.9 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <Card className="w-full shadow-lg border-amber-200 bg-white/80 backdrop-blur-sm overflow-hidden">
        <div className="bg-gradient-to-r from-amber-400 to-rose-400 h-2" />
        <CardContent className="pt-6">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center p-2 bg-amber-100 rounded-full mb-4">
              <Sparkles className="h-6 w-6 text-amber-600" />
            </div>
            <h2 className="text-3xl font-serif font-bold text-amber-900">Your Perfect Scent</h2>
            <p className="text-amber-600 mt-2">Based on your unique preferences</p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="bg-amber-50 p-6 rounded-lg border border-amber-200 mb-6"
          >
            {formatRecommendation(recommendation)}
          </motion.div>

          <div className="flex justify-center mt-4">
            <Button
              onClick={onReset}
              variant="outline"
              className="border-amber-300 text-amber-700 hover:bg-amber-50 flex items-center"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

