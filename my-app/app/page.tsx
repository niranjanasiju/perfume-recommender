import PerfumeForm from "@/components/perfume-form"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-rose-50 to-amber-50">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-amber-900 mb-4">Find Your Perfect Scent</h1>
          <p className="text-amber-700 text-lg md:text-xl max-w-2xl mx-auto">
            Answer a few questions about your preferences and personality to discover the perfect fragrance that matches
            your essence.
          </p>
        </div>

        <PerfumeForm />
      </div>
    </main>
  )
}

