import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, TrendingUp, TrendingDown, Target } from "lucide-react"
import Link from "next/link"
import { MetricLineChart } from "@/components/charts/metric-line-chart"
import { MetricProjectionChart } from "@/components/charts/metric-projection-chart"
import { CalendarHeatmap } from "@/components/charts/calendar-heatmap"

export default async function MetricDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient()

  if (!supabase) {
    return notFound()
  }

  const { id } = await params

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return notFound()
  }

  // Fetch all entries for this metric
  const { data: metrics } = await supabase
    .from("metrics")
    .select("*")
    .eq("user_id", user.id)
    .order("date", { ascending: true })

  if (!metrics || metrics.length === 0) {
    return notFound()
  }

  // Find the metric by ID to get the name
  const targetMetric = metrics.find((m) => m.id === id)
  if (!targetMetric) {
    return notFound()
  }

  // Get all entries for this metric name
  const metricEntries = metrics.filter((m) => m.metric_name === targetMetric.metric_name)

  const chartData = metricEntries.map((m) => ({
    date: m.date,
    value: m.metric_value,
    formattedDate: new Date(m.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
  }))

  // Calculate statistics
  const values = metricEntries.map((m) => m.metric_value)
  const average = values.reduce((a, b) => a + b, 0) / values.length
  const best = Math.max(...values)
  const worst = Math.min(...values)

  // Calculate streak for boolean-like metrics
  const isBooleanMetric = values.every((v) => v === 0 || v === 1)
  const heatmapData = isBooleanMetric ? metricEntries.map((m) => ({ date: m.date, value: m.metric_value === 1 })) : []

  const latestEntry = metricEntries[metricEntries.length - 1]

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div>
        <Link href="/metrics">
          <Button variant="ghost" size="sm" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Metrics
          </Button>
        </Link>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">{targetMetric.metric_name}</h1>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold">
                {latestEntry.metric_value} {latestEntry.unit}
              </span>
              <span className="text-muted-foreground">
                as of {new Date(latestEntry.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {average.toFixed(1)} {latestEntry.unit}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Best</CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {best} {latestEntry.unit}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Worst</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {worst} {latestEntry.unit}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Entries</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metricEntries.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      {isBooleanMetric ? (
        <Card>
          <CardHeader>
            <CardTitle>Calendar Heatmap</CardTitle>
          </CardHeader>
          <CardContent>
            <CalendarHeatmap data={heatmapData} />
          </CardContent>
        </Card>
      ) : (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Progress Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <MetricLineChart data={chartData} unit={latestEntry.unit} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Trend & Projection</CardTitle>
            </CardHeader>
            <CardContent>
              <MetricProjectionChart data={chartData} unit={latestEntry.unit} targetDate="2026-12-31" />
            </CardContent>
          </Card>
        </>
      )}

      {/* History Table */}
      <Card>
        <CardHeader>
          <CardTitle>Log History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {metricEntries
              .slice()
              .reverse()
              .map((entry) => (
                <div key={entry.id} className="flex items-start justify-between py-3 border-b last:border-0">
                  <div>
                    <p className="font-medium">
                      {entry.metric_value} {entry.unit}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(entry.date).toLocaleDateString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                    {entry.notes && <p className="text-sm text-muted-foreground mt-1">{entry.notes}</p>}
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
