import Link from 'next/link'
import { getSession } from '@/lib/auth'
import Navbar from '@/components/Navbar'
import { ArrowRight, CheckCircle, Shield, Award } from 'lucide-react'

export default function HomePage() {
  const session = getSession() // This might need to be awaited depending on Next.js version
  // Actually in Next 15/16 it's often async

  return (
    <main className="min-h-screen pt-24 pb-12 px-6">
      <HomeContent />
    </main>
  )
}

async function HomeContent() {
  const session = await getSession()
  if (!session) return null

  return (
    <>
      <Navbar user={session} />

      <div className="max-w-4xl mx-auto space-y-12">
        {/* Hero Section */}
        <div className="text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium">
            <Award className="w-4 h-4" />
            ระบบประเมินโครงงานนักศึกษา
          </div>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight leading-tight">
            ประเมินผลโครงงานอย่าง <span className="text-primary glow-text">สร้างสรรค์</span>
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            ยินดีต้อนรับคุณ <span className="text-white font-medium">{session.name}</span> เข้าสู่ระบบประเมินโครงงาน
            ความเห็นของคุณมีความสำคัญต่อการพัฒนาและปรับปรุงโครงงานของเพื่อนๆ นักศึกษา
          </p>

          <div className="pt-4">
            <Link
              href="/projects"
              className="btn-primary inline-flex items-center gap-2 text-lg px-8 py-4"
            >
              เริ่มการประเมิน
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>

        {/* Features / Info */}
        <div className="grid md:grid-cols-3 gap-6 pt-12">
          <div className="glass-card p-6 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center">
              <Shield className="w-6 h-6 text-green-400" />
            </div>
            <h3 className="text-lg font-bold">Anonymous</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              การประเมินของคุณจะเป็นความลับ ผู้จัดทำโครงงานจะไม่ทราบว่าใครเป็นผู้ประเมิน
            </p>
          </div>

          <div className="glass-card p-6 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="text-lg font-bold">Easy to Use</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              เพียงเลือกโครงงาน ให้คะแนน 1-10 และใส่คำแนะนำสั้นๆ เพื่อให้กำลังใจและข้อเสนอแนะ
            </p>
          </div>

          <div className="glass-card p-6 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
              <Award className="w-6 h-6 text-purple-400" />
            </div>
            <h3 className="text-lg font-bold">Fair & Square</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              ระบบแสดงผลคะแนนเฉลี่ยที่โปร่งใสและเป็นธรรมสำหรับทุกโครงงาน
            </p>
          </div>
        </div>
      </div>

      <div className="bg-dot" style={{ top: '20%', right: '-5%', width: '400px', height: '400px', background: '#38bdf822' }} />
      <div className="bg-dot" style={{ bottom: '10%', left: '-5%', width: '400px', height: '400px', background: '#818cf822' }} />
    </>
  )
}
