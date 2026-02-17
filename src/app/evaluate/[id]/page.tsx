'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import { ArrowLeft, Star, MessageSquare, Save, ShieldAlert, Award } from 'lucide-react'
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
            <div className="min-h-screen flex items-center justify-center bg-[#f1e4de]">
                <div className="w-10 h-10 border-4 border-[#d9a0a6] border-t-transparent rounded-full animate-spin" />
            </div>
        )
    }

    return (
        <main className="min-h-screen pt-32 pb-16 px-6 relative bg-dot">
            <Navbar user={session} />

            <div className="max-w-4xl mx-auto space-y-8">
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#4a3f3a] hover:opacity-70 transition-all group"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    กลับสู่หน้ารายการ
                </button>

                <form onSubmit={handleSubmit} className="box-container overflow-hidden bg-white">
                    <div className="box-header flex items-center justify-between py-8">
                        <div className="flex items-center gap-4">
                            <Award className="w-8 h-8 text-[#d9a0a6]" />
                            <div>
                                <span className="badge-academic text-[9px]">Official Evaluation Protocol</span>
                                <h1 className="text-3xl font-black text-[#4a3f3a] tracking-tight uppercase leading-none mt-1">{project?.name}</h1>
                            </div>
                        </div>
                        <div className="text-right hidden sm:block">
                            <p className="text-[10px] font-black text-accent uppercase tracking-widest mb-1">Project Ref</p>
                            <p className="text-sm font-black text-[#4a3f3a]">{project?.id.split('-')[0]}</p>
                        </div>
                    </div>

                    <div className="box-content space-y-12">
                        {/* Project Details Block */}
                        <section className="p-8 bg-[#f8f1ee] rounded-[4px] border-2 border-[#e9d4cd] space-y-4">
                            <h3 className="text-xs font-black text-[#4a3f3a] uppercase tracking-widest border-b border-[#e9d4cd] pb-2">คำอธิบายโครงงาน</h3>
                            <p className="text-soft font-medium leading-relaxed italic">
                                "{project?.description}"
                            </p>
                        </section>

                        {/* Evaluation Form Sections */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                            <div className="space-y-6">
                                <div className="space-y-1">
                                    <label className="text-xs font-black text-[#4a3f3a] uppercase tracking-widest">การให้คะแนน (1-10)</label>
                                    <p className="text-[10px] text-accent font-bold uppercase">Quantitative Performance Metric</p>
                                </div>

                                <div className="p-10 border-2 border-[#e9d4cd] rounded-[4px] flex flex-col items-center gap-8 bg-white group hover:border-[#d9a0a6] transition-colors">
                                    <div className="text-6xl font-black text-[#1a1a1a] tabular-nums tracking-tighter">
                                        {score}<span className="text-xl text-accent ml-1">/10</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="1"
                                        max="10"
                                        step="1"
                                        className="w-full h-2 bg-[#f8f1ee] rounded-full appearance-none cursor-pointer accent-[#d9a0a6]"
                                        value={score}
                                        onChange={(e) => setScore(parseInt(e.target.value))}
                                    />
                                    <div className="flex justify-between w-full px-2">
                                        {[1, 10].map((n) => (
                                            <span key={n} className="text-[10px] font-black text-accent uppercase">Index {n}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-1">
                                    <label className="text-xs font-black text-[#4a3f3a] uppercase tracking-widest">ความคิดเห็นเพิ่มเติม</label>
                                    <p className="text-[10px] text-accent font-bold uppercase">Qualitative Academic Feedback</p>
                                </div>
                                <textarea
                                    placeholder="กรุณาระบุข้อเสนอแนะเพื่อการปรับปรุง..."
                                    className="minimal-input h-full min-h-[160px] resize-none text-sm font-medium leading-relaxed"
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Security Notice */}
                        <div className="p-6 border-2 border-dashed border-[#e9d4cd] rounded-[4px] flex items-center gap-6 bg-[#f8f1ee]/30">
                            <div className="w-12 h-12 rounded-full bg-[#1a1a1a] flex items-center justify-center shrink-0">
                                <ShieldAlert className="w-6 h-6 text-[#d9a0a6]" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-[#4a3f3a] uppercase tracking-widest mb-1">ความเป็นส่วนตัวของผู้ประเมิน</p>
                                <p className="text-[10px] font-medium text-soft leading-tight">ระบบจะทำการปกปิดตัวตนของผู้ประเมินโดยสมบูรณ์ คะแนนและข้อเสนอแนะจะถูกนำไปใช้ในเชิงสถิติเท่านั้น</p>
                            </div>
                        </div>
                    </div>

                    <div className="box-footer flex justify-center py-10">
                        <button
                            disabled={submitting}
                            type="submit"
                            className="btn-minimal min-w-[300px] shadow-xl"
                        >
                            {submitting ? (
                                <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <span className="flex items-center gap-3">
                                    บันทึกผลการประเมินโครงการ
                                    <Save className="w-5 h-5" />
                                </span>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </main>
    )
}
