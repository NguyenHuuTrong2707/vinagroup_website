import { 
  Newspaper, 
  Users, 
  Package, 
  TrendingUp,
  Eye,
  Edit,
  Plus
} from "lucide-react"

export default function AdminDashboard() {
  const stats = [
    {
      title: "Tổng số tin tức",
      value: "24",
      change: "+12%",
      changeType: "positive" as const,
      icon: Newspaper,
      color: "bg-blue-500"
    },
    {
      title: "Người dùng đăng ký",
      value: "1,234",
      change: "+8%",
      changeType: "positive" as const,
      icon: Users,
      color: "bg-green-500"
    },
    {
      title: "Sản phẩm",
      value: "156",
      change: "+3%",
      changeType: "positive" as const,
      icon: Package,
      color: "bg-purple-500"
    },
    {
      title: "Lượt xem trang",
      value: "45,678",
      change: "+15%",
      changeType: "positive" as const,
      icon: Eye,
      color: "bg-orange-500"
    }
  ]

  const recentActivities = [
    {
      id: 1,
      type: "news",
      title: "Bài viết mới: VINAGROUP ra mắt dòng lốp cao cấp",
      time: "2 giờ trước",
      user: "Admin"
    },
    {
      id: 2,
      type: "product",
      title: "Sản phẩm mới được thêm: Lốp TBR Premium",
      time: "4 giờ trước",
      user: "Admin"
    },
    {
      id: 3,
      type: "user",
      title: "Người dùng mới đăng ký: user@example.com",
      time: "6 giờ trước",
      user: "System"
    },
    {
      id: 4,
      type: "news",
      title: "Bài viết được cập nhật: Hướng dẫn bảo dưỡng lốp",
      time: "8 giờ trước",
      user: "Admin"
    }
  ]

    return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Tổng quan về hoạt động của hệ thống VINAGROUP</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon
    return (
            <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  <p className={`text-sm mt-1 ${
                    stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.change} so với tháng trước
                  </p>
                </div>
                <div className={`p-3 rounded-full ${stat.color}`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
        </div>
      </div>
    )
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activities */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Hoạt động gần đây</h2>
            </div>
            <div className="p-6">
      <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <div className="h-2 w-2 bg-primary rounded-full mt-2"></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900">{activity.title}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {activity.time} • {activity.user}
                      </p>
                    </div>
        </div>
                ))}
        </div>
        </div>
      </div>
    </div>

        {/* Quick Actions */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Thao tác nhanh</h2>
            </div>
            <div className="p-6 space-y-3">
              <a
                href="/admin/news/new"
                className="flex items-center p-3 rounded-lg bg-primary/5 hover:bg-primary/10 transition-colors group"
              >
                <Plus className="h-5 w-5 text-primary mr-3" />
                <span className="text-sm font-medium text-gray-900 group-hover:text-primary">
                  Tạo tin tức mới
                </span>
              </a>
              
              <a
                href="/admin/products/new"
                className="flex items-center p-3 rounded-lg bg-secondary/5 hover:bg-secondary/10 transition-colors group"
              >
                <Plus className="h-5 w-5 text-secondary mr-3" />
                <span className="text-sm font-medium text-gray-900 group-hover:text-secondary">
                  Thêm sản phẩm mới
                </span>
              </a>
              
              <a
                href="/admin/news"
                className="flex items-center p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors group"
              >
                <Edit className="h-5 w-5 text-gray-600 mr-3" />
                <span className="text-sm font-medium text-gray-900">
                  Quản lý tin tức
                </span>
              </a>
              
              <a
                href="/admin/users"
                className="flex items-center p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors group"
              >
                <Users className="h-5 w-5 text-gray-600 mr-3" />
                <span className="text-sm font-medium text-gray-900">
                  Quản lý người dùng
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}