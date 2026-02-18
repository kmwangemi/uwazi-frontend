'use client'

import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { mockTenders, mockDashboardData } from '@/lib/mockData'
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
} from 'recharts'
import { formatCurrency } from '@/lib/formatters'

export default function AnalyticsPage() {
  // Risk distribution
  const riskDistribution = [
    { name: 'Low Risk (0-39)', value: mockTenders.filter((t) => t.corruptionRisk < 40).length, fill: '#10B981' },
    { name: 'Medium Risk (40-69)', value: mockTenders.filter((t) => t.corruptionRisk >= 40 && t.corruptionRisk < 70).length, fill: '#F59E0B' },
    { name: 'High Risk (70+)', value: mockTenders.filter((t) => t.corruptionRisk >= 70).length, fill: '#EF4444' },
  ]

  // Spending by category
  const spendingByCategory = mockTenders.reduce(
    (acc, t) => {
      const existing = acc.find((item) => item.category === t.category)
      if (existing) {
        existing.amount += t.budgetedAmount
      } else {
        acc.push({ category: t.category, amount: t.budgetedAmount })
      }
      return acc
    },
    [] as Array<{ category: string; amount: number }>
  ).sort((a, b) => b.amount - a.amount)

  // Monthly trends
  const monthlyData = [
    { month: 'Jan', amount: 2500000, risk: 35 },
    { month: 'Feb', amount: 2800000, risk: 38 },
    { month: 'Mar', amount: 3200000, risk: 42 },
    { month: 'Apr', amount: 2900000, risk: 39 },
    { month: 'May', amount: 3500000, risk: 45 },
    { month: 'Jun', amount: 5200000, risk: 52 },
  ]

  // Tender timeline
  const tenderTimeline = [
    { week: 'Week 1', count: 5, approved: 3 },
    { week: 'Week 2', count: 8, approved: 5 },
    { week: 'Week 3', count: 6, approved: 4 },
    { week: 'Week 4', count: 9, approved: 6 },
    { week: 'Week 5', count: 7, approved: 5 },
    { week: 'Week 6', count: 10, approved: 7 },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics & Insights</h1>
        <p className="text-gray-600">Advanced analytics and procurement patterns</p>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="spending">Spending Analysis</TabsTrigger>
          <TabsTrigger value="risk">Risk Analysis</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={riskDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {riskDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Tender Submissions</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={tenderTimeline}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#2563EB" name="Total Submitted" />
                  <Bar dataKey="approved" fill="#10B981" name="Approved" />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="spending" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Spending by Category</h3>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart
                data={spendingByCategory}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 200, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" tickFormatter={(value) => formatCurrency(value)} />
                <YAxis dataKey="category" type="category" width={190} />
                <Tooltip formatter={(value) => formatCurrency(value as number)} />
                <Bar dataKey="amount" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Categories by Amount</h3>
            <div className="space-y-3">
              {spendingByCategory.slice(0, 5).map((item, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{item.category}</p>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{
                          width: `${(item.amount / spendingByCategory[0].amount) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                  <span className="ml-4 font-semibold text-gray-900 min-w-fit">
                    {formatCurrency(item.amount)}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="risk" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk Score vs Budget Amount</h3>
            <ResponsiveContainer width="100%" height={400}>
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="budgetedAmount" name="Budget Amount" tickFormatter={(value) => formatCurrency(value)} />
                <YAxis dataKey="corruptionRisk" name="Risk Score" type="number" />
                <Tooltip
                  cursor={{ strokeDasharray: '3 3' }}
                  formatter={(value) => (typeof value === 'number' ? (value > 1000000 ? formatCurrency(value) : value.toFixed(0)) : value)}
                />
                <Scatter name="Tenders" data={mockTenders} fill="#FF6B6B" />
              </ScatterChart>
            </ResponsiveContainer>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-4">
              <p className="text-sm text-gray-600">Average Risk Score</p>
              <p className="text-3xl font-bold mt-2 text-gray-900">
                {(mockTenders.reduce((sum, t) => sum + t.corruptionRisk, 0) / mockTenders.length).toFixed(0)}
              </p>
            </Card>
            <Card className="p-4">
              <p className="text-sm text-gray-600">High Risk Tenders</p>
              <p className="text-3xl font-bold mt-2 text-red-600">
                {mockTenders.filter((t) => t.corruptionRisk >= 70).length}
              </p>
            </Card>
            <Card className="p-4">
              <p className="text-sm text-gray-600">Risk Coverage</p>
              <p className="text-3xl font-bold mt-2 text-blue-600">100%</p>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Spending & Risk Trend</h3>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={monthlyData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" tickFormatter={(value) => formatCurrency(value)} />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="amount"
                  stroke="#2563EB"
                  name="Spending"
                  tickFormatter={(value) => formatCurrency(value)}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="risk"
                  stroke="#EF4444"
                  name="Avg Risk Score"
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="p-4">
              <p className="text-sm text-gray-600">Total Procurement Value</p>
              <p className="text-2xl font-bold mt-2 text-gray-900">
                {formatCurrency(mockTenders.reduce((sum, t) => sum + t.budgetedAmount, 0))}
              </p>
              <p className="text-xs text-gray-500 mt-1">Last 6 months</p>
            </Card>
            <Card className="p-4">
              <p className="text-sm text-gray-600">Growth Rate</p>
              <p className="text-2xl font-bold mt-2 text-green-600">+12.5%</p>
              <p className="text-xs text-gray-500 mt-1">Month over month</p>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
