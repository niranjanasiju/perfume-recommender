"use server"

interface PerfumeFormData {
  personality: string
  places: string
  scentPreference: string
  season: string
  mood: string
}

export async function recommendPerfume(data: PerfumeFormData): Promise<string> {
  try {
    const response = await fetch("http://localhost:5001/recommend", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        q1: data.personality,
        q2: data.places,
        q3: data.scentPreference,
        q4: data.season,
        q5: data.mood,
      }),
    })

    if (!response.ok) {
      throw new Error(`Server error: ${response.statusText}`)
    }

    const result = await response.json()

    if (result.recommendation) {
      return result.recommendation
    } else {
      throw new Error("No recommendation received from AI.")
    }
  } catch (error) {
    console.error("Error fetching recommendation:", error)
    return "Sorry, we couldn't fetch your perfume recommendation. Please try again later."
  }
}