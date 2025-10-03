import Link from "next/link"
import { useRouter } from "next/navigation"

export function ProductCategory() {
  const router = useRouter()
  const products = [
    {
      title: "LỐP XE TẢI & XE BUÝT CAO CẤP",
      subtitle: "TBR",
      image: "/truck-tire-on-road.jpg",
      bgColor: "bg-slate-800",
      link: "/products?category=tbr",
    },
    {
      title: "SẢN PHẨM NHÀ MÁY VIỆT NAM",
      subtitle: "PCR",
      image: "/car-tire-close-up.jpg",
      bgColor: "bg-secondary",
      textColor: "text-secondary-foreground",
      link: "/products?category=pcr",
    },
  ]

  const productGrid = [
    {
      name: "MILEPLUS",
      image: "/premium-car-tire-with-yellow-accents.jpg",
      bgColor: "bg-gradient-to-br from-yellow-400 to-orange-500",
      link: "/products?series=mileplus",
    },
    {
      name: "ROYALBLACK",
      image: "/black-performance-tire.jpg",
      bgColor: "bg-gradient-to-br from-blue-600 to-blue-800",
      link: "/products?series=royalblack",
    },
    {
      name: "CATCHFORS",
      image: "/sports-car-tire-on-blue-car.jpg",
      bgColor: "bg-gradient-to-br from-blue-500 to-cyan-600",
      link: "/products?series=catchfors",
    },
    {
      name: "NAVIGATOR",
      image: "/suv-tire-on-green-vehicle.jpg",
      bgColor: "bg-gradient-to-br from-green-500 to-emerald-600",
      link: "/products?series=navigator",
    },
  ]

  return (
    <section className="py-12 md:py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 md:mb-16">
          <div className="text-gray-600 text-xs sm:text-sm font-medium mb-2">HAOHUA VIETNAM FACTORY</div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-4">DANH MỤC SẢN PHẨM</h2>
          <div className="w-12 md:w-16 h-1 bg-orange-500 mx-auto"></div>
        </div>

        {/* Lưới sản phẩm - Responsive grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {productGrid.map((product, index) => (
            <Link
              key={index}
              href={product.link}
              className="group relative overflow-hidden rounded-lg h-64 sm:h-72 md:h-80 transition-all duration-500 hover:scale-105"
            >
              <img
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-gradient-to-br group-hover:from-orange-400 group-hover:via-orange-500 group-hover:to-yellow-500 transition-all duration-500"></div>
              
              {/* Viền lốp xe - Chỉ hiển thị khi hover */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <svg
                  viewBox="0 0 200 200"
                  className="w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 text-white opacity-40"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="100" cy="100" r="80" />
                  <circle cx="100" cy="100" r="60" />
                  <circle cx="100" cy="100" r="40" />
                  {/* Các đường hoa văn lốp xe */}
                  <path d="M20 100 Q100 20 180 100" />
                  <path d="M20 100 Q100 180 180 100" />
                  <path d="M100 20 Q180 100 100 180" />
                  <path d="M100 20 Q20 100 100 180" />
                </svg>
              </div>
              
              {/* Văn bản PASS UNIMPEDED - Chỉ hiển thị khi hover */}
              <div className="absolute inset-0 flex items-center justify-center z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="text-center px-4">
                  <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 leading-tight">
                    PASS
                    <br />
                    UNIMPEDED
                  </h3>
                </div>
              </div>
              
              <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4 z-20">
                <h4 className="text-white text-sm sm:text-base md:text-lg font-bold mb-2 drop-shadow-lg group-hover:text-gray-800 transition-colors duration-500">
                  {product.name}
                </h4>
                
                {/* Nút PCR và TBR - Chỉ hiển thị khi hover */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col sm:flex-row justify-between gap-2 sm:gap-0">
                  <button
                    onClick={() => router.push("/products?category=pcr")}
                    className="bg-black/50 backdrop-blur-sm text-yellow-400 font-bold text-sm sm:text-base md:text-lg px-3 sm:px-6 md:px-8 py-2 sm:py-3 rounded transition-all duration-300 hover:scale-105 hover:bg-black/70 shadow-lg text-center"
                  >
                    <span className="drop-shadow-lg">PCR</span>
                  </button>
                  <button
                    onClick={() => router.push("/products?category=tbr")}
                    className="bg-black/50 backdrop-blur-sm text-yellow-400 font-bold text-sm sm:text-base md:text-lg px-3 sm:px-6 md:px-8 py-2 sm:py-3 rounded transition-all duration-300 hover:scale-105 hover:bg-black/70 shadow-lg text-center"
                  >
                    <span className="drop-shadow-lg">TBR</span>
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
