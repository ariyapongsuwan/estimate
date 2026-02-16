'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import { ArrowLeft, Star, MessageSquare, Save, ShieldAlert, Award, FileText } from 'lucide-react'
import { motion } from 'framer-motion'
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
            console.error('Submit error:', err)
        } finally {
            setSubmitting(false)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#f1e4de]">
                <div className="w-12 h-12 border-4 border-[#d9a0a6]/30 border-t-[#d9a0a6] rounded-full animate-spin" />
            </div>
        )
    }

    return (
        <main className="min-h-screen pt-32 pb-16 px-6 relative bg-[#f1e4de]">
            <Navbar user={session} />
            <div className="bg-dot" />

            <div className="max-w-4xl mx-auto relative z-10 space-y-8">
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-[#4a3f3a] transition-colors group bg-white border border-[#4a3f3a] px-5 py-2.5 rounded-lg shadow-xl shadow-[#4a3f3a]/5"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Back to Listing
                </button>

                <form onSubmit={handleSubmit} className="space-y-8">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="box-container bg-white shadow-2xl"
                    >
                        {/* Project ID Header */}
                        <div className="box-header flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-[#d9a0a6] flex items-center justify-center">
                                    <Award className="w-5 h-5 text-white" />
                                </div>
                                <h4 className="text-[11px] font-black text-[#4a3f3a] uppercase tracking-widest">Formal Evaluation Protocol</h4>
                            </div>
                            <span className="text-[10px] font-black text-accent uppercase tracking-widest">ID: {project?.id.split('-')[0]}</span>
                        </div>

                        <div className="box-content space-y-10">
                            <section className="space-y-4 border-b border-border pb-8">
                                <h1 className="text-4xl font-black text-[#4a3f3a] leading-tight uppercase tracking-tighter">{project?.name}</h1>
                                <div className="flex gap-4 items-start bg-[#f8f1ee]/40 p-5 rounded-xl border border-border/40">
                                    <FileText className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                                    <p className="text-soft font-medium leading-relaxed italic text-base">"{project?.description}"</p>
                                </div>
                            </section>

                            {/* Evaluation Logic Box */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <label className="text-sm font-black text-[#4a3f3a] uppercase tracking-widest">Performance Score</label>
                                        <div className="text-4xl font-black text-[#d9a0a6] tabular-nums">
                                            {score}<span className="text-lg text-accent ml-1">/10</span>
                                        </div>
                                    </div>
                                    <div className="p-8 bg-[#f8f1ee]/50 rounded-2xl border border-border/30 shadow-inner">
                                        <input
                                            type="range"
                                            min="1"
                                            max="10"
                                            step="1"
                                            className="w-full h-3 bg-white rounded-full appearance-none cursor-pointer accent-[#d9a0a6] border border-border/40"
                                            value={score}
                                            onChange={(e) => setScore(parseInt(e.target.value))}
                                        />
                                        <div className="flex justify-between mt-6 px-1">
                                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                                                <span key={n} className={`text-[10px] font-black transition-all ${score === n ? 'text-[#d9a0a6] scale-150' : 'text-accent'}`}>
                                                    {n}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <label className="text-sm font-black text-[#4a3f3a] uppercase tracking-widest leading-relaxed">Qualitative Commentary</label>
                                    <textarea
                                        placeholder="กรุณาให้ความเห็นเชิงวิชาการเพื่อการพัฒนาโครงงาน..."
                                        className="minimal-input w-full p-5 resize-none min-h-[160px] text-sm font-medium leading-relaxed bg-white border-2"
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                    />
                                    <p className="text-[10px] font-black text-accent uppercase tracking-widest text-right italic">Max 500 Characters</p>
                                </div>
                            </div>
                        </div>

                        <div className="box-footer bg-[#f8f1ee]/30 flex flex-col sm:flex-row items-center justify-between gap-6 py-8 px-10">
                            <div className="flex gap-4 items-center">
                                <div className="w-12 h-12 rounded-full border-2 border-[#d9a0a6] flex items-center justify-center bg-white shadow-xl shadow-[#d9a0a6]/10">
                                    <ShieldAlert className="w-6 h-6 text-[#d9a0a6]" />
                                </div>
                                <div className="space-y-0.5">
                                    <p className="text-[11px] font-black text-[#4a3f3a] uppercase tracking-widest">Protocol Encryption Active</p>
                                    <p className="text-[10px] font-bold text-soft leading-tight">Your identity is masked. Data is for internal research only.</p>
                                </div>
                            </div>

                            <button
                                disabled={submitting}
                                type="submit"
                                className="btn-minimal min-w-[240px] py-5 text-sm font-black shadow-2xl shadow-[#4a3f3a]/20 bg-[#4a3f3a] hover:bg-[#2e2624]"
                            >
                                {submitting ? (
                                    <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <span className="flex items-center gap-3">
                                        Submit Evaluation
                                        <Save className="w-4 h-4" />
                                    </span>
                                )}
                            </button>
                        </div>
                    </motion.div>
                </form>
            </div>
        </main>
    )
}
