'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import { ArrowLeft, Star, MessageSquare, Save, ShieldAlert, Award, ChevronLeft, Zap, Sparkles, ChevronRight, Check } from 'lucide-react'
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
    const [step, setStep] = useState(1)
    const [direction, setDirection] = useState(0)

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

    const nextStep = () => {
        setDirection(1)
        setStep(2)
    }

    const prevStep = () => {
        setDirection(-1)
        setStep(1)
    }

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
                router.push('/')
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

    const variants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 500 : -500,
            opacity: 0
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1
        },
        exit: (direction: number) => ({
            zIndex: 0,
            x: direction < 0 ? 500 : -500,
            opacity: 0
        })
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

                {/* Progress Indicators */}
                <div className="flex items-center justify-center gap-8 mb-12">
                    <div className="flex flex-col items-center gap-2">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${step >= 1 ? 'bg-primary border-primary text-white' : 'bg-white border-slate-200 text-slate-300'}`}>
                            {step > 1 ? <Check className="w-5 h-5" /> : <span className="text-sm font-black">1</span>}
                        </div>
                        <span className={`text-[9px] font-black uppercase tracking-widest ${step >= 1 ? 'text-primary' : 'text-slate-300'}`}>Rating</span>
                    </div>
                    <div className={`h-px w-24 transition-colors duration-500 ${step > 1 ? 'bg-primary' : 'bg-slate-100'}`} />
                    <div className="flex flex-col items-center gap-2">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${step >= 2 ? 'bg-primary border-primary text-white' : 'bg-white border-slate-200 text-slate-300'}`}>
                            <span className="text-sm font-black">2</span>
                        </div>
                        <span className={`text-[9px] font-black uppercase tracking-widest ${step >= 2 ? 'text-primary' : 'text-slate-300'}`}>Feedback</span>
                    </div>
                </div>

                <div className="relative">
                    <AnimatePresence mode="wait" custom={direction}>
                        {step === 1 ? (
                            <motion.div
                                key="step1"
                                custom={direction}
                                variants={variants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                                className="premium-card !p-0 overflow-hidden shadow-2xl shadow-slate-200/50 border-slate-200/60"
                            >
                                <div className="p-8 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-slate-50/50">
                                    <div className="flex items-center gap-5">
                                        <div className="w-14 h-14 rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center justify-center">
                                            <Award className="w-8 h-8 text-primary" />
                                        </div>
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest bg-primary/10 text-primary border border-primary/10">
                                                    Part 1: Quantitative
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
                                    <section className="p-6 bg-slate-900 rounded-2xl relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:rotate-12 transition-transform">
                                            <Zap className="w-20 h-20 text-white fill-white" />
                                        </div>
                                        <h3 className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-4">Project Overview</h3>
                                        <p className="text-slate-300 text-sm font-medium leading-relaxed italic relative z-10">
                                            "{project?.description}"
                                        </p>
                                    </section>

                                    <div className="space-y-8">
                                        <div className="flex justify-between items-end">
                                            <div className="space-y-1">
                                                <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight">Overall Performance</h4>
                                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Rate from 1 to 10</p>
                                            </div>
                                            <div className="text-5xl font-black text-primary tabular-nums">
                                                {score}<span className="text-sm text-slate-300 ml-1">/10</span>
                                            </div>
                                        </div>

                                        <div className="premium-card !p-10 border-slate-100 flex flex-col gap-10 bg-slate-50/30 ring-1 ring-slate-200/50">
                                            <div className="flex items-center justify-center gap-3">
                                                {Array.from({ length: 10 }).map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        className={`w-6 h-6 transition-all duration-300 ${i < score ? 'text-amber-500 fill-amber-500 scale-125' : 'text-slate-200 hover:text-slate-300'}`}
                                                    />
                                                ))}
                                            </div>

                                            <input
                                                type="range"
                                                min="1"
                                                max="10"
                                                step="1"
                                                className="w-full h-3 bg-slate-200 rounded-full appearance-none cursor-pointer accent-primary"
                                                value={score}
                                                onChange={(e) => setScore(parseInt(e.target.value))}
                                            />

                                            <div className="flex justify-between w-full px-2">
                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Developing</span>
                                                <span className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em]">Exemplary</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-8 bg-slate-50 border-t border-slate-100 flex justify-end">
                                    <button
                                        onClick={nextStep}
                                        className="btn-primary min-w-[200px] py-4 group"
                                    >
                                        <span className="flex items-center gap-3">
                                            Next Step: Qualitative
                                            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                        </span>
                                    </button>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="step2"
                                custom={direction}
                                variants={variants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                                className="premium-card !p-0 overflow-hidden shadow-2xl shadow-slate-200/50 border-slate-200/60"
                            >
                                <div className="p-8 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-slate-50/50">
                                    <div className="flex items-center gap-5">
                                        <div className="w-14 h-14 rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center justify-center">
                                            <MessageSquare className="w-8 h-8 text-primary" />
                                        </div>
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest bg-emerald-100 text-emerald-600 border border-emerald-100">
                                                    Part 2: Qualitative
                                                </span>
                                            </div>
                                            <h1 className="text-2xl font-black text-slate-900 tracking-tight uppercase">
                                                Feedback Insight
                                            </h1>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-8 md:p-12 space-y-10">
                                    <div className="space-y-6">
                                        <div className="space-y-1">
                                            <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight">Feedback & Comments</h4>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Provide detailed academic insight for the project</p>
                                        </div>
                                        <textarea
                                            placeholder="ระบุข้อเสนอแนะหรือจุดที่ควรปรับปรุง..."
                                            className="modern-input !bg-slate-50 min-h-[220px] resize-none text-base font-medium leading-relaxed focus:!bg-white"
                                            value={comment}
                                            onChange={(e) => setComment(e.target.value)}
                                        />
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
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-8 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-4">
                                    <button
                                        onClick={prevStep}
                                        className="btn-ghost min-w-[120px] py-4 group"
                                    >
                                        <span className="flex items-center gap-2">
                                            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                                            Back
                                        </span>
                                    </button>

                                    <button
                                        disabled={submitting}
                                        onClick={handleSubmit}
                                        className="btn-primary min-w-[280px] py-4 group bg-slate-900 hover:bg-black"
                                    >
                                        {submitting ? (
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        ) : (
                                            <span className="flex items-center gap-3">
                                                บันทึกผลการประเมิน
                                                <Save className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                            </span>
                                        )}
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

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
