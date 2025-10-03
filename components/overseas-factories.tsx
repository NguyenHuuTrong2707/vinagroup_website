import { Button } from "@/components/ui/button"
import Link from "next/link"

export function OverseasFactories() {
  return (
    <section className="relative py-12 sm:py-16 lg:py-20 bg-slate-900 text-white overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-60"
        style={{
          backgroundImage: `url('/aerial-view-of-modern-industrial-factory-complex-s.jpg')`,
        }}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-slate-900/70" />

      {/* Content */}
      <div className="relative container mx-auto px-4">
        <div className="max-w-2xl">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6 text-balance">NHÀ MÁY Ở NƯỚC NGOÀI</h2>
          <p className="text-base sm:text-lg mb-6 sm:mb-8 text-pretty opacity-90 leading-relaxed">
            Hệ thống nhà máy hiện đại trải dài trên nhiều châu lục, đảm bảo phạm vi toàn cầu và chuyên môn địa phương
            trong sản xuất và phân phối lốp.
          </p>
          <Link href="/vietnam-factory">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground w-full sm:w-auto">
              Nhà máy Việt Nam
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
