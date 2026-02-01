export const goalEmojis = {
  health: "💪",
  fitness: "🏃",
  education: "📚",
  career: "💼",
  finance: "💰",
  relationships: "❤️",
  personal: "🌟",
  hobby: "🎨",
  travel: "✈️",
  other: "🎯",
}

export const metricEmojis = {
  weight: "⚖️",
  water: "💧",
  steps: "👣",
  sleep: "😴",
  meditation: "🧘",
  reading: "📖",
  exercise: "🏋️",
  calories: "🍎",
  mood: "😊",
  productivity: "✅",
  savings: "💵",
  default: "📊",
}

export const pastelColors = [
  { bg: "bg-pastel-pink", text: "text-pastel-pink", value: "pink" },
  { bg: "bg-pastel-blue", text: "text-pastel-blue", value: "blue" },
  { bg: "bg-pastel-green", text: "text-pastel-green", value: "green" },
  { bg: "bg-pastel-yellow", text: "text-pastel-yellow", value: "yellow" },
  { bg: "bg-pastel-purple", text: "text-pastel-purple", value: "purple" },
  { bg: "bg-pastel-orange", text: "text-pastel-orange", value: "orange" },
]

export function getEmojiForGoal(category: string): string {
  return goalEmojis[category.toLowerCase() as keyof typeof goalEmojis] || goalEmojis.other
}

export function getEmojiForMetric(metricName: string): string {
  const key = Object.keys(metricEmojis).find((k) => metricName.toLowerCase().includes(k))
  return key ? metricEmojis[key as keyof typeof metricEmojis] : metricEmojis.default
}

export function getColorForIndex(index: number) {
  return pastelColors[index % pastelColors.length]
}

export function getColorForCategory(category: string) {
  const hash = category.split("").reduce((acc, char) => char.charCodeAt(0) + acc, 0)
  return pastelColors[hash % pastelColors.length]
}
