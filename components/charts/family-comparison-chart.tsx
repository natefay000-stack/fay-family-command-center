"use client"

import { useState } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

interface FamilyMember {
  id: string
  name: string
  color: string
}

interface DataPoint {
  date: string
  formattedDate: string
  [key: string]: string | number
}

interface FamilyComparisonChartProps {
  data: DataPoint[]
  members: FamilyMember[]
  unit: string
}

export function FamilyComparisonChart({ data, members, unit }: FamilyComparisonChartProps) {
  const [visibleMembers, setVisibleMembers] = useState<Set<string>>(new Set(members.map((m) => m.id)))

  const toggleMember = (memberId: string) => {
    const newVisible = new Set(visibleMembers)
    if (newVisible.has(memberId)) {
      newVisible.delete(memberId)
    } else {
      newVisible.add(memberId)
    }
    setVisibleMembers(newVisible)
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-4 flex-wrap">
        {members.map((member) => (
          <div key={member.id} className="flex items-center space-x-2">
            <Checkbox
              id={member.id}
              checked={visibleMembers.has(member.id)}
              onCheckedChange={() => toggleMember(member.id)}
            />
            <Label htmlFor={member.id} className="flex items-center gap-2 cursor-pointer">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: member.color }} />
              {member.name}
            </Label>
          </div>
        ))}
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis dataKey="formattedDate" stroke="hsl(var(--muted-foreground))" fontSize={12} />
          <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--popover))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "6px",
            }}
            formatter={(value: number) => [`${value} ${unit}`, ""]}
          />
          <Legend />
          {members.map((member) =>
            visibleMembers.has(member.id) ? (
              <Line
                key={member.id}
                type="monotone"
                dataKey={member.id}
                stroke={member.color}
                strokeWidth={2}
                name={member.name}
                dot={{ fill: member.color, r: 4 }}
              />
            ) : null,
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
