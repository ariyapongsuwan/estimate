'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Star, MessageSquare, Save, ArrowLeft, ShieldAlert } from 'lucide-react'
import Navbar from '@/components/Navbar'

export default function EvaluationPage() {
    const { id } = useParams()
    const router = useRouter()
    const [project, setProject] = useState<any>(null)
    const [score, setScore] = useState(5)
    const [comment, setComment] = useState('')
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [user, setUser] = useState<any>(null)

    useEffect(() => {
        async function fetchData() {
            try {
                const [projectRes, sessionRes] = await Promise.all([
                    fetch(`/api/projects/${id}`),
                    fetch('/api/auth/session')
                ])

                if (projectRes.ok && sessionRes.ok) {
                    const projectData = await projectRes.json()
                    const sessionData = await sessionRes.json()
                    setProject(projectData)
                    setUser(sessionData)

                    if (projectData.myEvaluation) {
                        setScore(projectData.myEvaluation.score)
                        setComment(projectData.myEvaluation.comment || '')
                    }
                }
            } catch (err) {
                console.error(err)
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
            alert('Error submitting evaluation')
        } finally {
            setSubmitting(false)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
            </div>
        )
    }

    if (!project) return <div>Project not found</div>

    return (
        <main className="min-h-screen pt-24 pb-12 px-6">
            <Navbar user={user} />

            <div className="max-w-3xl mx-auto">
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8 group"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    กลับไปยังรายการโครงงาน
                </button>

                <div className="space-y-8">
                    <div className="glass-card p-8 border-white/5">
                        <h1 className="text-3xl font-bold glow-text mb-4">{project.name}</h1>
                        <p className="text-slate-400 leading-relaxed">{project.description}</p>
                    </div>

                    <form onSubmit={handleSubmit} className="glass-card p-8 border-white/5 space-y-10">
                        {/* Score Selection */}
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <label className="text-xl font-bold text-white flex items-center gap-2">
                                    <Star className="w-6 h-6 text-yellow-500" />
                                    ให้คะแนนโครงงาน
                                </label>
                                <div className="text-3xl font-black text-primary glow-text">
                                    {score}<span className="text-slate-500 text-lg font-normal">/10</span>
                                </div>
                            </div>

                            <div className="relative pt-4">
                                <input
                                    type="range"
                                    min="1"
                                    max="10"
                                    step="1"
                                    value={score}
                                    onChange={(e) => setScore(parseInt(e.target.value))}
                                    className="w-full h-3 bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary"
                                />
                                <div className="flex justify-between mt-4 px-1">
                                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                                        <span
                                            key={num}
                                            className={`text-xs font-bold transition-colors ${score === num ? 'text-primary' : 'text-slate-600'}`}
                                        >
                                            {num}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Comment Area */}
                        <div className="space-y-4">
                            <label className="text-xl font-bold text-white flex items-center gap-2">
                                <MessageSquare className="w-6 h-6 text-blue-400" />
                                ความเห็นเพิ่มเติม (ไม่บังคับ)
                            </label>
                            <textarea
                                rows={4}
                                placeholder="ใส่คำแนะนำหรือสิ่งที่ประทับใจในโครงงานนี้..."
                                className="glass-input w-full p-4 resize-none min-h-[120px]"
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                            />
                        </div>

                        {/* Privacy Notification */}
                        <div className="bg-primary/10 border border-primary/20 p-4 rounded-xl flex gap-4 items-start">
                            <ShieldAlert className="w-6 h-6 text-primary shrink-0" />
                            <div className="text-sm space-y-1">
                                <p className="text-white font-semibold">การประเมินแบบไม่เปิดเผยตัวตน (Anonymous)</p>
                                <p className="text-slate-400">
                                    ชื่อและข้อมูลของคุณจะไม่ถูกแสดงให้ผู้จัดทำโครงงานเห็น
                                    จะแสดงเพียงคะแนนและความเห็นเท่านั้น
                                </p>
                            </div>
                        </div>

                        <button
                            disabled={submitting}
                            type="submit"
                            className="btn-primary w-full py-4 text-lg flex items-center justify-center gap-3 transition-all"
                        >
                            {submitting ? (
                                <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    <Save className="w-5 h-5" />
                                    บันทึกการประเมิน
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </main>
    )
}
