import {
  ShoppingBagIcon,
  UsersIcon,
  CurrencyDollarIcon,
  TagIcon,
  EyeIcon,
} from '@heroicons/react/24/outline'
import { Card } from '@/components/ui/card'
import { 
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'
import { useDashboardData } from '@/hooks/useDashboardData'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from 'recharts'

interface MetricCardProps {
  title: string
  value: string | number
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
  iconBgColor: string
  iconColor: string
  description?: string
  accentColor?: string
  trend?: string
  trendColor?: string
}

function MetricCard({ 
  title, 
  value, 
  icon: Icon, 
  iconBgColor, 
  iconColor, 
  description, 
  accentColor,
  trend,
  trendColor 
}: MetricCardProps) {
  return (
    <Card className={`group relative overflow-hidden bg-card/50 backdrop-blur-sm p-6 shadow-lg hover:shadow-xl transition-all duration-300 border-2 ${accentColor || 'border-border'} hover:border-primary/30 hover:-translate-y-1`}>
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-linear-to-br from-background/5 via-transparent to-accent/5 opacity-50 group-hover:opacity-70 transition-opacity duration-300"></div>
      
      {/* Content */}
      <div className="relative">
        {/* Header with Icon */}
        <div className="flex items-start justify-between mb-4">
          <div className="shrink-0">
            <div className={`relative rounded-2xl p-4 ${iconBgColor} shadow-md group-hover:shadow-lg transition-all duration-300 border border-white/20 dark:border-white/10`}>
              <Icon className={`h-8 w-8 ${iconColor} transition-transform duration-300 group-hover:scale-110`} />
              {/* Glow effect */}
              <div className={`absolute inset-0 rounded-2xl ${iconBgColor} opacity-0 group-hover:opacity-50 blur-xl transition-opacity duration-300`}></div>
            </div>
          </div>
          
          {/* Trend indicator */}
          {trend && (
            <div className={`flex items-center space-x-1 px-2.5 py-1.5 bg-background/60 backdrop-blur-sm rounded-full border border-border/50 ${trendColor}`}>
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
              <span className="text-xs font-semibold">{trend}</span>
            </div>
          )}
        </div>

        {/* Metrics */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            {title}
          </h3>
          
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-bold bg-linear-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
              {value}
            </span>
          </div>
          
          {description && (
            <p className="text-xs text-muted-foreground/80 font-medium">
              {description}
            </p>
          )}
        </div>

        {/* Bottom accent line */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-linear-to-r from-transparent via-primary/30 to-transparent group-hover:via-primary/60 transition-all duration-300"></div>
      </div>
    </Card>
  )
}



function RecentActivity({ activities }: { activities: any[] }) {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'user_added':
        return <UsersIcon className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
      case 'product_viewed':
        return <EyeIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
      default:
        return <ShoppingBagIcon className="h-5 w-5 text-primary" />
    }
  }

  if (activities.length === 0) {
    return (
      <Card className="bg-card p-6 shadow-sm">
        <h3 className="text-lg font-medium text-foreground mb-4">Recent Activity</h3>
        <div className="text-center py-8 text-muted-foreground">
          <UsersIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <p>No recent activity yet</p>
          <p className="text-sm">Add some users to see activity here</p>
        </div>
      </Card>
    )
  }

  return (
    <Card className="bg-card p-6 shadow-sm hover:shadow-md transition-all duration-200 border border-border">
      <h3 className="text-2xl text-center font-medium text-foreground mb-6">
        Recent Activity
      </h3>
      <div className="flow-root max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">
        <ul className="space-y-3">
          {activities.map((activity, index) => (
            <li key={activity.id} className="group relative">
              <div className="relative p-4 bg-linear-to-r from-accent/5 to-accent/10 hover:from-accent/10 hover:to-accent/15 rounded-xl border border-border/50 hover:border-primary/20 hover:shadow-sm transition-all duration-300">
                {/* Connection line */}
                {index !== activities.length - 1 && (
                  <div className="absolute left-8 top-16 h-6 w-0.5 bg-linear-to-b from-primary/30 to-primary/10"></div>
                )}
                
                <div className="flex items-start space-x-4">
                  {/* Icon container */}
                  <div className="shrink-0 relative">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-br from-primary/20 to-primary/30 border-2 border-primary/20 shadow-sm group-hover:shadow-md transition-all duration-300">
                      {getActivityIcon(activity.type)}
                    </div>

                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-center">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground leading-relaxed group-hover:text-primary transition-colors duration-200">
                          {activity.description}
                        </p>
                        {activity.user && (
                          <p className="text-xs text-muted-foreground mt-1 font-medium">
                            User: <span className="text-primary/80">{activity.user}</span>
                          </p>
                        )}
                      </div>
                      <div className="shrink-0 ml-4">

                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
      
      {/* Activity summary footer */}
      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span className="flex items-center">
            <div className="h-2 w-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
            {activities.length} recent {activities.length === 1 ? 'activity' : 'activities'}
          </span>

        </div>
      </div>
    </Card>
  )
}

// Enhanced color palettes for different chart types
const BAR_CHART_COLORS = [
  '#3B82F6', // Blue
  '#6366F1', // Indigo  
  '#8B5CF6', // Violet
  '#06B6D4', // Cyan
  '#0891B2', // Sky blue
  '#1E40AF', // Blue-700
  '#4C1D95', // Violet-800
  '#0E7490', // Cyan-700
]

const PIE_CHART_COLORS = [
  '#F59E0B', // Amber
  '#EF4444', // Red
  '#10B981', // Emerald
  '#F97316', // Orange
  '#EC4899', // Pink
  '#84CC16', // Lime
  '#F43F5E', // Rose
  '#6366F1', // Indigo
]



// Bar Chart Configuration (Cool Blue Tones)
const categoryChartConfig = {

  
} satisfies ChartConfig



// Gender Pie Chart Configuration (Vibrant Tones)
const genderChartConfig = {
  count: {
    label: "Users",
    color: "#EC4899", // Pink
  },
  Male: {
    label: "Male",
    color: "#6366F1", // Indigo
  },
  Female: {
    label: "Female",
    color: "#EC4899", // Pink
  },
  Other: {
    label: "Other",
    color: "#F43F5E", // Rose
  },
} satisfies ChartConfig

export default function DashboardHome() {
  const { 
    metrics, 
    recentActivity, 
    categoryData, 
    topProducts, 
    genderData, 
    isLoading 
  } = useDashboardData()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    )
  }

  const metricsCards = [
    {
      title: 'Total Products',
      value: metrics.totalProducts,
      icon: ShoppingBagIcon,
      iconBgColor: 'bg-linear-to-br from-purple-500/10 via-purple-400/10 to-blue-500/10 dark:from-purple-400/20 dark:via-purple-300/15 dark:to-blue-400/20',
      iconColor: 'text-purple-600 dark:text-purple-400',
      description: 'Products in catalog',
      accentColor: 'border-purple-200 dark:border-purple-400/30',

      trendColor: 'text-emerald-600 dark:text-emerald-400'
    },
    {
      title: 'Total Users',
      value: metrics.totalUsers,
      icon: UsersIcon,
      iconBgColor: 'bg-linear-to-br from-blue-500/10 via-blue-400/10 to-indigo-500/10 dark:from-blue-400/20 dark:via-blue-300/15 dark:to-indigo-400/20',
      iconColor: 'text-blue-600 dark:text-blue-400',
      description: 'Registered users',
      accentColor: 'border-blue-200 dark:border-blue-400/30',

      trendColor: 'text-emerald-600 dark:text-emerald-400'
    },
    {
      title: 'Average Price',
      value: `LKR ${metrics.averagePrice}`,
      icon: CurrencyDollarIcon,
      iconBgColor: 'bg-linear-to-br from-emerald-500/10 via-emerald-400/10 to-teal-500/10 dark:from-emerald-400/20 dark:via-emerald-300/15 dark:to-teal-400/20',
      iconColor: 'text-emerald-600 dark:text-emerald-400',
      description: 'Per product',
      accentColor: 'border-emerald-200 dark:border-emerald-400/30',

      trendColor: 'text-emerald-600 dark:text-emerald-400'
    },
    {
      title: 'Categories',
      value: metrics.totalCategories,
      icon: TagIcon,
      iconBgColor: 'bg-linear-to-br from-pink-500/10 via-pink-400/10 to-rose-500/10 dark:from-pink-400/20 dark:via-pink-300/15 dark:to-rose-400/20',
      iconColor: 'text-pink-600 dark:text-pink-400',
      description: 'Product categories',
      accentColor: 'border-pink-200 dark:border-pink-400/30',

      trendColor: 'text-emerald-600 dark:text-emerald-400'
    },
  ]

  return (
    <div className="space-y-8 bg-background min-h-screen p-6 transition-colors">


      {/* Metrics Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {metricsCards.map((metric, index) => (
          <MetricCard key={index} {...metric} />
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:gap-8">
        {/* Category Distribution Chart */}
        <Card className="bg-card p-6 shadow-sm hover:shadow-md transition-all duration-200 border border-border">
          <h3 className="text-2xl text-center font-medium text-foreground mb-15">
             Products by Category
          </h3>
          {categoryData.length > 0 ? (
            <ChartContainer config={categoryChartConfig} className="h-84">
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="category"
                  tickLine={true}
                  tickMargin={10}
                  axisLine={true}
                />
                <YAxis
                  tickLine={true}
                  tickMargin={10}
                  axisLine={true}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar 
                  dataKey="count" 
                  radius={4}
                >
                  {categoryData.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={BAR_CHART_COLORS[index % BAR_CHART_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ChartContainer>
          ) : (
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <ShoppingBagIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                <p>No product data available</p>
              </div>
            </div>
          )}
        </Card>


             {/* Data Tables and Activity */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-1 xl:gap-8">
        {/* Top Products */}
        <Card className="bg-card p-6 shadow-sm hover:shadow-md transition-all duration-200 border border-border">
          <h3 className="text-2xl text-center font-semibold bg-linear-to-r from-accent-foreground to-accent-foreground/80 bg-clip-text text-transparent mb-6">
             Top Products by Price
          </h3>
          {topProducts.length > 0 ? (
            <div className="space-y-3">
              {topProducts.map((product, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-accent/10 hover:bg-accent/20 rounded-xl border border-border hover:shadow-sm transition-all duration-200">
                  <div className="flex-1">
                    <div className="font-medium text-foreground truncate">{product.name}</div>
                    <div className="text-sm text-muted-foreground">{product.category}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-foreground">LKR {product.price}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <ShoppingBagIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
              <p>No products available</p>
            </div>
          )}
        </Card>
      </div>

 

        {/* User Gender Distribution */}
        <Card className="bg-card p-6 shadow-sm hover:shadow-md transition-all duration-200 border border-border">
          <h3 className="text-2xl text-center font-semibold bg-linear-to-r from-secondary-foreground to-secondary-foreground/80 bg-clip-text text-transparent mb-6">
            Users by Gender
          </h3>
          {genderData.length > 0 ? (
            <ChartContainer config={genderChartConfig} className="h-126">
              <PieChart>
                <Pie
                  data={genderData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ gender, percent }) => `${gender} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={200}
   
                  dataKey="count"
                  nameKey="gender"
                  stroke="#ffffff"
                  strokeWidth={2}
                >
                  {genderData.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_CHART_COLORS[index % PIE_CHART_COLORS.length]} />
                  ))}
                </Pie>
                <ChartTooltip 
                  content={<ChartTooltipContent />}
                />
              </PieChart>
            </ChartContainer>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <UsersIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
              <p>No users registered yet</p>
            </div>
          )}
        </Card>

        {/* Recent Activity */}
        <RecentActivity activities={recentActivity} />
      </div>
    </div>
  )
}