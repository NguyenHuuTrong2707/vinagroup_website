import Link from "next/link"
import { Calendar, MapPin } from "lucide-react"

export function NewsEvents() {
  const events = [
    {
      type: "Sự kiện",
      date: "30 tháng 6, 2023",
      location: "Moscow, Nga",
      title: "Haohua Tire xuất hiện mạnh mẽ tại Triển lãm Lốp & Cao su 2023 tại Moscow, Nga",
      image: "/tire-exhibition-moscow.jpg",
      slug: "tire-rubber-2023-moscow",
    },
    {
      type: "Sự kiện", 
      date: "30 tháng 6, 2023",
      location: "Singapore",
      title: "Haohua Tire gây ấn tượng mạnh tại Triển lãm Lốp Singapore 2023 (Tyrexpo)",
      image: "/tire-exhibition-singapore.jpg",
      slug: "singapore-tyre-expo-2023",
    },
  ]

  const news = [
    {
      title: "Hướng dẫn sử dụng",
      date: "10 tháng 5, 2024",
      slug: "instructions-for-use",
    },
    {
      title: "Bảo hành PCR", 
      date: "10 tháng 5, 2024",
      slug: "pcr-warranty",
    },
    {
      title: "Haohua Tire xuất hiện mạnh mẽ tại Triển lãm Lốp & Cao su...",
      date: "30 tháng 6, 2023",
      slug: "tire-rubber-2023-moscow",
    },
    {
      title: "Haohua Tire gây ấn tượng mạnh tại Triển lãm Lốp Singapore 2023...",
      date: "30 tháng 6, 2023", 
      slug: "singapore-tyre-expo-2023",
    },
    {
      title: "Công ty TNHH Lốp Haohua Sơn Đông đã đạt được thành tựu đáng kinh ngạc...",
      date: "14 tháng 2, 2023",
      slug: "haohua-tire-achievement",
    },
  ]

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-gray-100">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="text-orange-500 text-sm sm:text-base font-medium mb-2">HAOHUA TIRE</div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 mb-4">TIN TỨC & SỰ KIỆN</h2>
          <div className="w-16 h-1 bg-orange-500 mx-auto"></div>
        </div>

        {/* Three Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Event Cards - Left and Middle */}
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            {events.map((event, index) => (
              <Link
                key={index}
                href={`/news/${event.slug}`}
                className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group relative"
              >
                {/* Event Badge */}
                <div className="absolute top-0 left-0 z-10">
                  <div className="bg-orange-500 text-white px-3 py-1 rounded text-xs font-semibold">
                    {event.type}
                  </div>
                </div>
                
                {/* Image */}
                <div className="overflow-hidden">
                  <img
                    src={event.image || "/placeholder.svg"}
                    alt={event.title}
                    className="w-full h-48 sm:h-56 object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                
                {/* Content */}
                <div className="p-4 sm:p-6">
                  <div className="flex items-center text-gray-600 text-sm mb-2">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center text-gray-600 text-sm mb-3">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span>{event.location}</span>
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-800 group-hover:text-orange-500 transition-colors leading-tight">
                    {event.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>

          {/* News Sidebar - Right */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 p-4 sm:p-6 relative group">
              {/* News Badge */}
              <div className="absolute top-0 left-0 z-10">
                <div className="bg-orange-500 text-white px-3 py-1 rounded text-xs font-semibold group-hover:bg-orange-600 transition-colors duration-300">
                  Tin tức
                </div>
              </div>
              
              {/* News List */}
              <div className="space-y-3 max-h-90 py-5 overflow-y-auto scrollbar-thin scrollbar-thumb-[var(--primary)] scrollbar-track-gray-100 hover:scrollbar-thumb-[var(--primary)] transition-colors">
                {news.map((item, index) => (
                  <Link
                    key={index}
                    href={`/news/${item.slug}`}
                    className="block hover:bg-orange-50 hover:border-l-4 hover:border-orange-500 p-3 rounded-lg transition-all duration-300 group/item"
                  >
                    <h4 className="text-sm font-medium text-gray-800 group-hover/item:text-orange-500 transition-colors mb-2 line-clamp-2 leading-relaxed">
                      {item.title}
                    </h4>
                    <p className="text-xs text-gray-500 group-hover/item:text-gray-600 transition-colors">{item.date}</p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
