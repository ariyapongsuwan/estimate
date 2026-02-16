import Link from 'next/link'
import { ArrowRight, Star, Shield, CheckCircle, Award, Users } from 'lucide-react'
import Navbar from '@/components/Navbar'
import { getSession } from '@/lib/auth'

export default async function HomePage() {
  const session = await getSession()

  return (
    <main className="min-h-screen bg-dot">
      <Navbar user={session} />

      <div className="max-w-6xl mx-auto px-6 pt-32 pb-24">
        {/* Hero Section */}
        <div className="box-container overflow-hidden mb-16">
          <div className="box-header flex flex-col items-center gap-2 py-12">
            <span className="badge-academic text-[#d9a0a6] border-[#d9a0a6]">Official Evaluation Protocol</span>
            <h1 className="text-5xl font-black text-[#4a3f3a] tracking-tighter uppercase text-center leading-none mt-4">
              Student Project<br />Evaluation System
            </h1>
          </div>
          <div className="p-12 text-center space-y-8 bg-white">
            <p className="text-lg font-medium text-soft max-w-2xl mx-auto leading-relaxed">
              ยินดีต้อนรับสู่ระบบประเมินผลโครงงานนักศึกษาอย่างเป็นทางการ
              ระบบนี้ถูกออกแบบมาเพื่อความโปร่งใสและประสิทธิภาพในการเก็บข้อมูลทางวิชาการ
            </p>
            <div className="flex justify-center gap-4">
              <Link href="/projects" className="btn-minimal">
                เริ่มต้นการประเมิน
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Info Blocks */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="minimal-card flex flex-col">
            <div className="box-header flex items-center gap-3">
              <Shield className="w-5 h-5 text-accent" />
              <h3 className="text-xs font-black uppercase tracking-widest">ความปลอดภัย</h3>
            </div>
            <div className="box-content flex-1">
              <p className="text-sm font-medium leading-relaxed">
                ข้อมูลการประเมินทุกชุดจะถูกเก็บเป็นความลับและประมวลผลผ่านระบบที่ปลอดภัยสูงสุด
              </p>
            </div>
          </div>

          <div className="minimal-card flex flex-col">
            <div className="box-header flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-accent" />
              <h3 className="text-xs font-black uppercase tracking-widest">ความโปร่งใส</h3>
            </div>
            <div className="box-content flex-1">
              <p className="text-sm font-medium leading-relaxed">
                เกณฑ์การให้คะแนนถูกกำหนดตามมาตรฐานสากล เพื่อให้เกิดความยุติธรรมแก่ผู้จัดทำโครงงานทุกคน
              </p>
            </div>
          </div>

          <div className="minimal-card flex flex-col">
            <div className="box-header flex items-center gap-3">
              <Award className="w-5 h-5 text-accent" />
              <h3 className="text-xs font-black uppercase tracking-widest">มาตรฐาน</h3>
            </div>
            <div className="box-content flex-1">
              <p className="text-sm font-medium leading-relaxed">
                สรุปผลในรูปแบบที่เข้าใจง่ายสำหรับคณะกรรมการและเจ้าหน้าที่ที่เกี่ยวข้อง
              </p>
            </div>
          </div>
        </div>

        {/* Quick Stats Block */}
        <div className="mt-16 box-container bg-[#f8f1ee]">
          <div className="px-8 py-6 flex flex-wrap justify-center gap-12 items-center">
            <div className="flex items-center gap-3">
              <Users className="w-10 h-10 text-[#d9a0a6]" />
              <div>
                <p className="text-2xl font-black text-[#4a3f3a]">500+</p>
                <p className="text-[10px] font-black uppercase tracking-widest text-accent">Active Evaluators</p>
              </div>
            </div>
            <div className="h-10 w-px bg-[#e9d4cd]" />
            <div className="flex items-center gap-3">
              <Star className="w-10 h-10 text-[#d9a0a6]" />
              <div>
                <p className="text-2xl font-black text-[#4a3f3a]">50+</p>
                <p className="text-[10px] font-black uppercase tracking-widest text-accent">Innovations</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
