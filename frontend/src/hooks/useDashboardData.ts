import { useMemo } from 'react'
import { useUsers } from '@/hooks/useUser'
import { useProducts } from '@/hooks/useProducts'

interface DashboardMetrics {
  totalProducts: number
  totalUsers: number
  averagePrice: number
  totalCategories: number
}

interface RecentActivity {
  id: number
  type: 'user_added' | 'product_viewed'
  description: string
  timestamp: string
  user?: string
}

interface CategoryData {
  category: string
  count: number
  totalValue: number
}

interface PriceRangeData {
  range: string
  count: number
}

export function useDashboardData() {
  const { data: usersResponse, isLoading: usersLoading } = useUsers()
  const { data: productsResponse, isLoading: productsLoading } = useProducts()
  const users = usersResponse?.users ?? []
  const products = productsResponse?.products ?? []
  
  const isLoading = usersLoading || productsLoading
  
  // Real metrics calculated from actual data
  const metrics = useMemo<DashboardMetrics>(() => {
    const totalProducts = products.length
    const totalUsers = users.length
    
    // Calculate real average price from products
    const averagePrice = products.length > 0 
      ? products.reduce((sum: number, product: any) => sum + (product.price_lkr || 0), 0) / products.length
      : 0
    
    // Get unique categories count
    const categories = new Set(products.map((product: any) => product.category))
    const totalCategories = categories.size

    return {
      totalProducts,
      totalUsers,
      averagePrice: Math.round(averagePrice * 100) / 100,
      totalCategories,
    }
  }, [products, users])

  // Real category data for charts
  const categoryData = useMemo<CategoryData[]>(() => {
    const categoryMap = new Map<string, { count: number; totalValue: number }>()
    
    products.forEach((product: any) => {
      const category = product.category || 'Unknown'
      const existing = categoryMap.get(category) || { count: 0, totalValue: 0 }
      
      categoryMap.set(category, {
        count: existing.count + 1,
        totalValue: existing.totalValue + (product.price || 0)
      })
    })

    return Array.from(categoryMap.entries()).map(([category, data]) => ({
      category,
      count: data.count,
      totalValue: Math.round(data.totalValue * 100) / 100
    }))
  }, [products])

  // Real price range distribution
  const priceRangeData = useMemo<PriceRangeData[]>(() => {
    const ranges = [
      { min: 0, max: 50, label: '$0-50' },
      { min: 50, max: 100, label: '$50-100' },
      { min: 100, max: 500, label: '$100-500' },
      { min: 500, max: 1000, label: '$500-1000' },
      { min: 1000, max: Infinity, label: '$1000+' }
    ]

    return ranges.map(range => ({
      range: range.label,
      count: products.filter((product: any) => 
        product.price >= range.min && product.price < range.max
      ).length
    }))
  }, [products])

  // Recent activity based on real data
  const recentActivity = useMemo<RecentActivity[]>(() => {
    const activities: RecentActivity[] = []
    
    // Add recent users as activities (last 5)
    users.slice(-5).forEach((user: any, index: number) => {
      const hoursAgo = index + 1
      activities.push({
        id: user._id || index, // Use MongoDB _id or index as fallback
        type: 'user_added',
        description: `New user registered`,
        timestamp: `${hoursAgo} hour${hoursAgo > 1 ? 's' : ''} ago`,
        user: `${user.firstName} ${user.lastName}`,
      })
    })

    return activities.reverse() // Show most recent first
  }, [users])

  // Top products by price
  const topProducts = useMemo(() => {
    return [...products]
      .sort((a: any, b: any) => (b.price || 0) - (a.price || 0))
      .slice(0, 5)
      .map((product: any) => ({
        name: product.name,
        price: product.price_lkr || 0,
        category: product.category
      }))
  }, [products])

  // Users by gender distribution
  const genderData = useMemo(() => {
    const genderMap = new Map<string, number>()
    
    users.forEach((user: any) => {
      const gender = user.gender || 'Not specified'
      genderMap.set(gender, (genderMap.get(gender) || 0) + 1)
    })

    return Array.from(genderMap.entries()).map(([gender, count]) => ({
      gender,
      count
    }))
  }, [users])

  return {
    metrics,
    recentActivity,
    categoryData,
    priceRangeData,
    topProducts,
    genderData,
    isLoading,
  }
}