import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AddMetricButton } from "@/components/add-metric-button"
import { MetricsList } from "@/components/metrics-list"
import { TrendingUp, Activity } from "lucide-react"

export default async function MetricsPage() {
  const supabase = await createClient()

  if (!supabase) {
    return null
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  // Fetch all metrics for the user
  const { data: metrics } = await supabase
    .from("metrics")
    .select("*")
    .eq("user_id", user.id)
    .order("date", { ascending: false })

  // Group metrics by name
  const metricsByName = metrics?.reduce(
    (acc, metric) => {
      if (!acc[metric.metric_name]) {
        acc[metric.metric_name] = []
      }
      acc[metric.metric_name].push(metric)
      return acc
    },
    {} as Record<string, typeof metrics>,
  )

  const uniqueMetricNames = metricsByName ? Object.keys(metricsByName) : []

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">My Metrics</h1>
          <p className="text-muted-foreground">Track your personal metrics and see your progress over time</p>
        </div>
        <AddMetricButton />
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Entries</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.length || 0}</div>
            <p className="text-xs text-muted-foreground">All-time metric entries</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tracked Metrics</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{uniqueMetricNames.length}</div>
            <p className="text-xs text-muted-foreground">Different metrics tracked</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {
                metrics?.filter((m) => {
                  const metricDate = new Date(m.date)
                  const now = new Date()
                  return metricDate.getMonth() === now.getMonth() && metricDate.getFullYear() === now.getFullYear()
                }).length
              }
            </div>
            <p className="text-xs text-muted-foreground">Entries this month</p>
          </CardContent>
        </Card>
      </div>

      {/* Metrics List */}
      {metrics && metrics.length > 0 ? (
        <MetricsList metrics={metrics} metricsByName={metricsByName || {}} />
      ) : (
        <Card>
          <CardContent className="py-12">
            <div className="text-center space-y-4">
              <TrendingUp className="h-16 w-16 mx-auto text-muted-foreground opacity-50" />
              <div>
                <h3 className="text-lg font-semibold mb-2">No metrics yet</h3>
                <p className="text-muted-foreground mb-4">
                  Start tracking metrics like weight, running distance, reading time, or anything you want to measure!
                </p>
                <AddMetricButton />
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
