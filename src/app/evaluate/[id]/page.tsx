'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import { ArrowLeft, Star, MessageSquare, Save, ShieldAlert, Award, ChevronLeft, Zap, Sparkles } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { UserSession } from '@/lib/auth'

export default function EvaluationPage() {
    const { id } = useParams()
    const router = useRouter()
    const [project, setProject] = useState<any>(null)
    const [session, setSession] = useState<UserSession | null>(null)
    const [score, setScore] = useState(5)
    const [comment, setComment] = useState('')
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [projRes, sessRes] = await Promise.all([
                    fetch(`/api/projects/${id}`),
                    fetch('/api/auth/session')
                ])

                if (projRes.ok && sessRes.ok) {
                    const projData = await projRes.json()
                    const sessData = await sessRes.json()

                    setProject(projData)
                    setSession(sessData)

                    if (projData.userEvaluation) {
                        setScore(projData.userEvaluation.score)
                        setComment(projData.userEvaluation.comment || '')
                    }
                }
            } catch (err) {
                console.error('Fetch error:', err)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [id])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSubmitting(true)

        try {
            const res = await fetch('/api/evaluate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ projectId: id, score, comment }),
            })

            if (res.ok) {
                router.push('/projects')
            }
        } catch (err) {
            console.error('Submit failed')
        } finally {
            setSubmitting(false)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        )
    }

    return (
        <main className="min-h-screen bg-white relative overflow-hidden">
            <div className="bg-mesh" />
            <Navbar user={session} />

            <div className="max-w-4xl mx-auto px-6 pt-32 pb-24 relative z-10">
                <motion.button
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-slate-400 hover:text-primary transition-all group mb-8"
                >
                    <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Back to Registry
                </motion.button>

                <form onSubmit={handleSubmit}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="premium-card !p-0 overflow-hidden shadow-2xl shadow-slate-200/50 border-slate-200/60"
                    >
                        {/* Title Bar */}
                        <div className="p-8 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-slate-50/50">
                            <div className="flex items-center gap-5">
                                <div className="w-14 h-14 rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center justify-center">
                                    <Award className="w-8 h-8 text-primary" />
                                </div>
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest bg-primary/10 text-primary border border-primary/10">
                                            Evaluation Protocol v2
                                        </span>
                                        <span className="text-slate-300 text-xs font-bold">Ref: {project?.id.split('-')[0]}</span>
                                    </div>
                                    <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
                                        {project?.name}
                                    </h1>
                                </div>
                            </div>
                        </div>

                        <div className="p-8 md:p-12 space-y-12">
                            {/* Context Block */}
                            <section className="p-6 bg-slate-900 rounded-2xl relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:rotate-12 transition-transform">
                                    <Zap className="w-20 h-20 text-white fill-white" />
                                </div>
                                <h3 className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-4">Project Overview</h3>
                                <p className="text-slate-300 text-sm font-medium leading-relaxed italic relative z-10">
                                    "{project?.description}"
                                </p>
                            </section>

                            {/* Main Metrics */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                <div className="space-y-6">
                                    <div className="flex justify-between items-end">
                                        <div className="space-y-1">
                                            <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight">Performance Rating</h4>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Quantitative Metric (1-10)</p>
                                        </div>
                                        <div className="text-4xl font-black text-primary tabular-nums">
                                            {score}<span className="text-sm text-slate-300 ml-1">/10</span>
                                        </div>
                                    </div>

                                    <div className="premium-card !p-8 border-slate-100 flex flex-col gap-8 bg-slate-50/30">
                                        <div className="flex items-center gap-2">
                                            {Array.from({ length: 10 }).map((_, i) => (
                                                <Star
                                                    key={i}
                                                    className={`w-4 h-4 transition-all duration-300 ${i < score ? 'text-amber-500 fill-amber-500 scale-110' : 'text-slate-200'}`}
                                                />
                                            ))}
                                        </div>

                                        <input
                                            type="range"
                                            min="1"
                                            max="10"
                                            step="1"
                                            className="w-full h-2 bg-slate-200 rounded-full appearance-none cursor-pointer accent-primary"
                                            value={score}
                                            onChange={(e) => setScore(parseInt(e.target.value))}
                                        />

                                        <div className="flex justify-between w-full">
                                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Poor</span>
                                            <div className="px-3 py-1 bg-white rounded-full border border-slate-200 text-[9px] font-black text-slate-500 uppercase">
                                                Active Value Selection
                                            </div>
                                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Excellence</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="space-y-1">
                                        <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight">Feedback & Comments</h4>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Qualitative Academic Insight</p>
                                    </div>
                                    <textarea
                                        placeholder="ระบุข้อเสนอแนะหรือจุดที่ควรปรับปรุง เพื่อประโยชน์ในการพัฒนาโครงงาน..."
                                        className="modern-input !bg-slate-50 min-h-[160px] resize-none text-sm font-medium leading-relaxed focus:!bg-white"
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Security Footer */}
                            <div className="p-6 bg-emerald-50/50 rounded-2xl border border-emerald-100 flex items-center gap-6">
                                <div className="w-12 h-12 rounded-xl bg-emerald-500 flex items-center justify-center shrink-0 shadow-lg shadow-emerald-500/20">
                                    <ShieldAlert className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h5 className="text-[11px] font-black text-emerald-900 uppercase tracking-widest mb-1">Double-Blind Protocol</h5>
                                    <p className="text-[10px] font-semibold text-emerald-700 leading-tight">
                                        การประเมินนี้เป็นความลับขั้นสูงสุด ข้อมูลส่วนบุคคลของคุณจะไม่ถูกแสดงให้เจ้าของโครงการทราบ
                                        กรุณาให้คะแนนตามความเป็นจริงเพื่อรักษามาตรฐานการศึกษา
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Action Slat */}
                        <div className="p-8 bg-slate-50 border-t border-slate-100 flex justify-center">
                            <button
                                disabled={submitting}
                                type="submit"
                                className="btn-primary min-w-[280px] py-4 group"
                            >
                                {submitting ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <span className="flex items-center gap-3">
                                        บันทึกผลการประเมินโครงงาน
                                        <Save className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                    </span>
                                )}
                            </button>
                        </div>
                    </motion.div>
                </form>

                <div className="mt-12 text-center">
                    <div className="inline-flex items-center gap-2 text-slate-300">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span className="text-[9px] font-black uppercase tracking-[0.4em]">Integrated Scoring System • Secure Node</span>
                    </div>
                </div>
            </div>
        </main>
    )
}
