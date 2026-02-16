import Link from 'next/link'
import { ArrowRight, Star, Shield, CheckCircle, Award, LayoutGrid, Info } from 'lucide-react'
import Navbar from '@/components/Navbar'
import { getSession } from '@/lib/auth'

export default async function HomePage() {
  const session = await getSession()

  return (
    <main className="min-h-screen pt-32 pb-16 px-6 relative">
      <Navbar user={session} />
      <div className="bg-dot" />

      <div className="max-w-5xl mx-auto space-y-12 relative z-10">
        {/* Welcome Section */}
        <section className="box-container border-none shadow-none bg-transparent">
          <div className="flex flex-col md:flex-row items-center gap-12 py-8">
            <div className="flex-1 space-y-8 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/50 border border-border rounded-lg text-xs font-black text-accent uppercase tracking-widest">
                <Info className="w-3.5 h-3.5" />
                Active Evaluation Period
              </div>
              <h1 className="text-5xl md:text-6xl font-black text-[#4a3f3a] tracking-tight leading-tight">
                Project <span className="text-[#d9a0a6]">Evaluation</span><br />
                System <span className="text-accent underline decoration-[#d9a0a6] underline-offset-8">2024</span>
              </h1>
              <p className="text-lg text-soft font-medium leading-relaxed max-w-xl">
                ระบบจัดการและรวบรวมคะแนนประเมินผลโครงงานนักศึกษา เพื่อความโปร่งใสและเป็นระเบียบตามมาตรฐานวิชาการ
              </p>
              <div className="flex flex-wrap items-center gap-4 justify-center md:justify-start">
                <Link
                  href="/projects"
                  className="btn-minimal bg-[#4a3f3a] hover:bg-[#322a27] text-white px-8 py-4 shadow-xl shadow-[#4a3f3a]/10 group"
                >
                  เริ่มการประเมิน
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-accent/20" />
                  ))}
                  <div className="w-10 h-10 rounded-full border-2 border-white bg-white flex items-center justify-center text-[10px] font-black text-soft uppercase tracking-tighter">
                    +200
                  </div>
                </div>
              </div>
            </div>

            <div className="hidden lg:block w-1/3">
              <div className="box-container p-8 space-y-6 rotate-3 hover:rotate-0 transition-transform duration-500 bg-white shadow-2xl">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-[#d9a0a6]/10 flex items-center justify-center">
                    <LayoutGrid className="w-6 h-6 text-[#d9a0a6]" />
                  </div>
                  <h4 className="font-black text-[#4a3f3a] uppercase tracking-widest text-xs">Summary Board</h4>
                </div>
                <div className="space-y-4">
                  <div className="h-4 bg-[#f1e4de] rounded-full w-full" />
                  <div className="h-4 bg-[#f1e4de] rounded-full w-3/4" />
                  <div className="h-4 bg-[#f1e4de] rounded-full w-1/2" />
                </div>
                <div className="pt-4 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-3xl font-black text-[#4a3f3a]">84%</p>
                    <p className="text-[10px] font-black text-accent uppercase tracking-widest">Completion</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Structured Blocks Section */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="box-container group hover:border-[#d9a0a6] transition-colors">
            <div className="box-header flex items-center gap-3">
              <Shield className="w-5 h-5 text-[#d9a0a6]" />
              <h3 className="font-black text-[11px] text-[#4a3f3a] uppercase tracking-widest">Privacy Protected</h3>
            </div>
            <div className="box-content space-y-3">
              <p className="text-sm font-bold text-[#4a3f3a]">Anonymous Evaluation</p>
              <p className="text-xs text-soft font-medium leading-relaxed">
                การประเมินเป็นความลับถาวร ข้อมูลส่วนตัวของคุณจะถูกเก็บในระบบเพื่อการยืนยันสิทธิ์แต่จะไม่ถูกส่งไปยังเจ้าของโครงงาน
              </p>
            </div>
          </div>

          <div className="box-container group hover:border-[#bba9a1] transition-colors">
            <div className="box-header flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-[#bba9a1]" />
              <h3 className="font-black text-[11px] text-[#4a3f3a] uppercase tracking-widest">Verified Process</h3>
            </div>
            <div className="box-content space-y-3">
              <p className="text-sm font-bold text-[#4a3f3a]">Authenticated Access</p>
              <p className="text-xs text-soft font-medium leading-relaxed">
                ระบบล็อคอินที่เข้มงวดเพื่อความถูกต้องของข้อมูล (1 สิทธิ์ต่อ 1 การประเมิน) มั่นใจได้ว่าทุกคะแนนมาจากนักศึกษาตัวจริง
              </p>
            </div>
          </div>

          <div className="box-container group hover:border-[#cfa09e] transition-colors lg:col-span-1 md:col-span-2">
            <div className="box-header flex items-center gap-3">
              <Award className="w-5 h-5 text-[#cfa09e]" />
              <h3 className="font-black text-[11px] text-[#4a3f3a] uppercase tracking-widest">Academic Excellence</h3>
            </div>
            <div className="box-content space-y-3">
              <p className="text-sm font-bold text-[#4a3f3a]">Standardized Criteria</p>
              <p className="text-xs text-soft font-medium leading-relaxed">
                เกณฑ์การให้คะแนนที่ชัดเจน (1-10) ช่วยให้การประเมินผลลัพธ์ของโครงงานเป็นไปตามมาตรฐานการศึกษาระดับอุดมศึกษา
              </p>
            </div>
          </div>
        </section>

        {/* Secondary Block */}
        <div className="box-container px-10 py-12 text-center space-y-6 bg-white shadow-xl shadow-accent/5">
          <div className="inline-flex p-3 rounded-full bg-accent/5 border border-accent/10">
            <Star className="w-10 h-10 text-accent" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-[#4a3f3a] uppercase tracking-tight">University Project Evaluation Portal</h2>
            <p className="text-sm text-soft font-medium max-w-xl mx-auto">
              ขอความร่วมมือให้นักศึกษาประเมินทุกโครงงานภายในระยะเวลาที่กำหนด เพื่อความครบถ้วนของข้อมูลทางสถิติที่ทางคณะจะนำไปใช้ในการพัฒนาปรับปรุงต่อไป
            </p>
          </div>
          <div className="pt-4 border-t border-border w-32 mx-auto" />
          <p className="text-[10px] font-black text-accent uppercase tracking-[0.3em]">Engineering Faculty • © 2024</p>
        </div>
      </div>
    </main>
  )
}
