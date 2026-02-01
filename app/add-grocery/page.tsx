"use client"

import { useState } from "react"
import { useGrocery } from "@/hooks/use-data"

export default function AddGroceryPage() {
  const [name, setName] = useState("")
  const [quantity, setQuantity] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  const { addItem } = useGrocery()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    setIsSubmitting(true)
    try {
      await addItem(name.trim(), quantity)
      setSuccess(true)
      setName("")
      setQuantity(1)
      setTimeout(() => setSuccess(false), 3000)
    } catch (error) {
      console.error("Failed to add item:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-2">Add Grocery Item</h1>
        <p className="text-gray-400 mb-6">Add items to the family grocery list</p>

        {success && (
          <div className="bg-green-600/20 border border-green-500 text-green-400 px-4 py-3 rounded-lg mb-6">
            Item added successfully!
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-2">
              Item Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Milk, Eggs, Bread"
              autoFocus
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>

          <div>
            <label htmlFor="quantity" className="block text-sm font-medium mb-2">
              Quantity
            </label>
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-12 h-12 bg-gray-800 border border-gray-700 rounded-lg text-2xl font-bold hover:bg-gray-700 transition"
              >
                -
              </button>
              <input
                type="number"
                id="quantity"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                min={1}
                className="w-20 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-lg text-center focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
              <button
                type="button"
                onClick={() => setQuantity(quantity + 1)}
                className="w-12 h-12 bg-gray-800 border border-gray-700 rounded-lg text-2xl font-bold hover:bg-gray-700 transition"
              >
                +
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !name.trim()}
            className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:text-gray-500 rounded-lg text-lg font-semibold transition"
          >
            {isSubmitting ? "Adding..." : "Add to List"}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-800">
          <a href="/demo/tv" className="text-blue-400 hover:text-blue-300">
            Back to TV Display
          </a>
        </div>
      </div>
    </div>
  )
}
