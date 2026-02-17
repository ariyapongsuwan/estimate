'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowRight, Star, Shield, CheckCircle, Award, Users, Zap, Briefcase, ChevronRight } from 'lucide-react'
import Navbar from '@/components/Navbar'
import { motion } from 'framer-motion'
import { UserSession } from '@/lib/auth'

export default function HomePage() {
  const [session, setSession] = useState<UserSession | null>(null)

  useEffect(() => {
    fetch('/api/auth/session')
      .then(res => res.json())
      .then(data => setSession(data))
      .catch(err => console.error('Session fetch error:', err))
  }, [])

  return (
    <main className="min-h-screen bg-white selection:bg-primary/30 selection:text-primary relative overflow-hidden">
      <div className="bg-mesh" />
      <Navbar user={session} />

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 border border-slate-200 text-slate-600 text-xs font-bold uppercase tracking-widest mb-8"
          >
            <Zap className="w-3.5 h-3.5 text-primary fill-primary" />
            Official Evaluation Protocol 2026
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-6xl md:text-8xl font-black tracking-tight leading-[0.9] mb-8"
          >
            <span className="gradient-text">Student Project</span><br />
            <span className="text-slate-900">Evaluation System</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed mb-12"
          >
            ยินดีต้อนรับสู่ระบบประเมินผลโครงงานนักศึกษาอย่างเป็นทางการ
            ระบบนี้ถูกออกแบบมาเพื่อความโปร่งใสและประสิทธิภาพในการเก็บข้อมูลทางวิชาการที่แม่นยำที่สุด
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row justify-center gap-4"
          >
            <Link href="/projects" className="btn-primary group">
              เริ่มต้นการประเมิน
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/login" className="btn-ghost group">
              เข้าสู่ระบบสำหรับเจ้าหน้าที่
              <ChevronRight className="ml-1 w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
            </Link>
          </motion.div>
        </div>

        {/* Floating Decorative Elements */}
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-64 h-64 bg-primary/10 rounded-full blur-3xl -z-10 animate-pulse" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl -z-10 animate-float" />
      </section>

      {/* Stats Section */}
      <section className="px-6 pb-20">
        <div className="max-w-5xl mx-auto glass rounded-3xl p-8 md:p-12 shadow-2xl shadow-slate-200/50">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-center">
            <div className="text-center md:text-left space-y-2">
              <div className="flex items-center justify-center md:justify-start gap-4 mb-2">
                <Users className="w-8 h-8 text-primary" />
                <span className="text-4xl font-black text-slate-900">500+</span>
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Active Evaluators</p>
            </div>

            <div className="hidden md:block h-16 w-px bg-slate-200 mx-auto" />

            <div className="text-center md:text-left space-y-2">
              <div className="flex items-center justify-center md:justify-start gap-4 mb-2">
                <Star className="w-8 h-8 text-primary" />
                <span className="text-4xl font-black text-slate-900">50+</span>
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Innovations Tracked</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="px-6 py-20 bg-slate-50/50 relative">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
            <div className="max-w-xl">
              <h2 className="text-3xl font-black text-slate-900 mb-4 uppercase tracking-tight">ทำไมต้องใช้ ProjectEval?</h2>
              <p className="text-slate-500 font-medium leading-relaxed">
                เราสร้างมาตรฐานใหม่ในการจัดการข้อมูลโครงงาน เพื่อให้นักศึกษาและอาจารย์เข้าถึงข้อมูลที่ถูกต้องแม่นยำ
              </p>
            </div>
            <div className="bg-white p-2 rounded-2xl shadow-sm border border-slate-100 flex gap-2">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-primary" />
              </div>
              <div className="pr-4">
                <p className="text-xs font-black text-slate-900 uppercase">Trusted by</p>
                <p className="text-xs font-bold text-slate-400">12+ Academic Depts</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: 'ความปลอดภัย',
                desc: 'ข้อมูลการประเมินทุกชุดจะถูกเก็บเป็นความลับและประมวลผลผ่านระบบที่ปลอดภัยสูงสุด',
                color: 'text-indigo-600'
              },
              {
                icon: CheckCircle,
                title: 'ความโปร่งใส',
                desc: 'เกณฑ์การให้คะแนนถูกกำหนดตามมาตรฐานสากล เพื่อให้เกิดความยุติธรรมแก่ผู้จัดทำโครงงาน',
                color: 'text-emerald-600'
              },
              {
                icon: Award,
                title: 'มาตรฐาน',
                desc: 'สรุปผลในรูปแบบที่เข้าใจง่ายสำหรับคณะกรรมการและเจ้าหน้าที่ที่เกี่ยวข้องผ่านระบบอัตโนมัติ',
                color: 'text-amber-600'
              }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="premium-card group"
              >
                <div className={`w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center mb-6 border border-slate-100 group-hover:scale-110 group-hover:bg-white group-hover:shadow-md transition-all duration-300`}>
                  <feature.icon className={`w-7 h-7 ${feature.color}`} />
                </div>
                <h3 className="text-xl font-extrabold text-slate-900 mb-4">{feature.title}</h3>
                <p className="text-slate-500 text-sm font-medium leading-[1.6]">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer Branding */}
      <footer className="py-12 px-6 border-t border-slate-100">
        <div className="max-w-7xl mx-auto flex flex-col md:row items-center justify-between gap-8 opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500">
          <p className="text-xs font-black uppercase tracking-widest text-slate-400">
            © 2026 Academic Evaluation Protocol • All Rights Reserved
          </p>
          <div className="flex gap-8">
            <div className="w-8 h-8 bg-slate-200 rounded-lg" />
            <div className="w-8 h-8 bg-slate-200 rounded-lg" />
            <div className="w-8 h-8 bg-slate-200 rounded-lg" />
          </div>
        </div>
      </footer>
    </main>
  )
}
