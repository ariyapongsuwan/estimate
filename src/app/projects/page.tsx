'use client'

import Link from 'next/link'
import Navbar from '@/components/Navbar'
import { ArrowRight, Star, MessageSquare, CheckCircle2, LayoutGrid, Filter, Search, ChevronRight, Hash, Plus, X, Sparkles, BookOpen } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import { UserSession } from '@/lib/auth'

export default function ProjectsPage() {
    const [projects, setProjects] = useState<any[]>([])
    const [session, setSession] = useState<UserSession | null>(null)
    const [loading, setLoading] = useState(true)
    const [isAdding, setIsAdding] = useState(false)
    const [newProject, setNewProject] = useState({ name: '', description: '' })
    const [submitting, setSubmitting] = useState(false)

    const fetchData = async () => {
        try {
            const [projRes, sessRes] = await Promise.all([
                fetch('/api/projects'),
                fetch('/api/auth/session')
            ])
            if (projRes.ok && sessRes.ok) {
                const projData = await projRes.json()
                const sessData = await sessRes.json()
                setProjects(projData)
                setSession(sessData)
            }
        } catch (err) {
            console.error('Fetch error:', err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    const handleAddProject = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newProject.name) return

        setSubmitting(true)
        try {
            const res = await fetch('/api/projects', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newProject)
            })

            if (res.ok) {
                setNewProject({ name: '', description: '' })
                setIsAdding(false)
                fetchData()
            }
        } catch (err) {
            console.error('Creation error:', err)
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

    if (!session) return null

    return (
        <main className="min-h-screen bg-white relative overflow-hidden">
            <div className="bg-mesh" />
            <Navbar user={session} />

            <div className="max-w-7xl mx-auto px-6 pt-32 pb-24 relative z-10">
                {/* Header Section */}
                <header className="mb-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8"
                    >
                        <div className="space-y-4">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-500 text-[10px] font-black uppercase tracking-widest">
                                <LayoutGrid className="w-3 h-3" />
                                Registry Catalog 2026
                            </div>
                            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight uppercase leading-none">
                                รายการโครงงาน<span className="text-primary">.</span>
                            </h1>
                            <p className="text-slate-500 font-medium max-w-xl leading-relaxed">
                                เลือกโครงงานที่คุณต้องการประเมินผลจากรายการในคลังข้อมูลวิศวกรรม
                                ระบบจะบันทึกสถานะการประเมินของคุณโดยอัตโนมัติ
                            </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-4">
                            <button
                                onClick={() => setIsAdding(true)}
                                className="btn-primary flex items-center gap-2 px-6 py-4"
                            >
                                <Plus className="w-5 h-5" />
                                เพิ่มโปรเจคใหม่
                            </button>

                            <div className="flex items-center gap-6 bg-slate-50 p-6 rounded-2xl border border-slate-100 shadow-sm transition-all hover:shadow-md">
                                <div className="text-right">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Entities</p>
                                    <p className="text-4xl font-black text-slate-900 tabular-nums">{projects.length}</p>
                                </div>
                                <div className="w-px h-12 bg-slate-200" />
                                <div className="p-3 bg-white rounded-xl shadow-sm border border-slate-100">
                                    <Search className="w-5 h-5 text-slate-400" />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </header>

                {/* Projects Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {projects.map((project, i) => {
                        const hasEvaluated = !!project.userEvaluation

                        return (
                            <motion.div
                                key={project.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: i * 0.05 }}
                                className="premium-card flex flex-col !p-0 overflow-hidden group border-slate-200/60 hover:border-primary/30 transition-all duration-300"
                            >
                                <div className="p-6 pb-2 flex items-center justify-between relative z-10">
                                    <div className="flex items-center gap-2 px-2 py-1 rounded-md bg-slate-50 border border-slate-100">
                                        <Hash className="w-3 h-3 text-slate-400" />
                                        <span className="text-[10px] font-black text-slate-500 tracking-widest uppercase">
                                            {project.id.split('-')[0]}
                                        </span>
                                    </div>
                                    {hasEvaluated && (
                                        <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-emerald-50 text-emerald-600 border border-emerald-100 shadow-sm shadow-emerald-100/50">
                                            <CheckCircle2 className="w-3.5 h-3.5" />
                                            <span className="text-[9px] font-black uppercase tracking-tighter">Evaluated</span>
                                        </div>
                                    )}
                                </div>

                                <div className="p-6 pt-4 flex-1 space-y-4">
                                    <div className="space-y-1">
                                        <h3 className="text-xl font-extrabold text-slate-900 leading-[1.3] group-hover:text-primary transition-colors">
                                            {project.name}
                                        </h3>
                                        <div className="h-1 w-8 bg-primary/20 rounded-full group-hover:w-16 transition-all duration-500" />
                                    </div>

                                    <p className="text-slate-500 text-sm font-medium line-clamp-3 leading-relaxed">
                                        {project.description || 'ไม่มีคำอธิบายโครงการสำหรับรายการนี้'}
                                    </p>

                                    {hasEvaluated && (
                                        <div className="flex flex-col gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100 group-hover:bg-white transition-colors relative">
                                            <div className="flex items-center justify-between">
                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Performance Score</span>
                                                <div className="flex items-center gap-1">
                                                    <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                                                    <span className="text-sm font-black text-slate-900">{project.userEvaluation.score}/10</span>
                                                </div>
                                            </div>
                                            {project.userEvaluation.comment && (
                                                <div className="flex gap-2">
                                                    <MessageSquare className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                                                    <p className="text-[11px] text-slate-500 italic line-clamp-1">
                                                        "{project.userEvaluation.comment}"
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                <div className="p-4 bg-slate-50/50 border-t border-slate-100">
                                    <Link
                                        href={`/evaluate/${project.id}`}
                                        className={`w-full py-4 rounded-xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-sm ${hasEvaluated
                                            ? 'bg-white text-slate-600 hover:text-primary hover:shadow-md border border-slate-200'
                                            : 'bg-primary text-white hover:bg-primary-hover shadow-primary/20 hover:shadow-lg hover:shadow-primary/25 active:scale-95'
                                            }`}
                                    >
                                        {hasEvaluated ? 'Modify Evaluation' : 'Begin Evaluation'}
                                        <ArrowRight className="w-3.5 h-3.5" />
                                    </Link>
                                </div>
                            </motion.div>
                        )
                    })}
                </div>
            </div>

            {/* Add Project Modal */}
            <AnimatePresence>
                {isAdding && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsAdding(false)}
                            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="bg-white rounded-3xl w-full max-w-lg shadow-2xl relative z-10 overflow-hidden"
                        >
                            <div className="bg-primary p-8 text-white relative">
                                <button
                                    onClick={() => setIsAdding(false)}
                                    className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/10 transition-colors"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                                <div className="flex items-center gap-3 mb-2">
                                    <Sparkles className="w-5 h-5 text-indigo-200" />
                                    <span className="text-xs font-black uppercase tracking-widest text-indigo-100 opacity-80">Project Registration</span>
                                </div>
                                <h2 className="text-3xl font-black uppercase tracking-tight">ลงทะเบียนโปรเจคใหม่</h2>
                            </div>

                            <form onSubmit={handleAddProject} className="p-8 space-y-6">
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">
                                            ชื่อโครงงาน (Project Name)
                                        </label>
                                        <div className="relative group">
                                            <BookOpen className="absolute left-4 top-4 w-5 h-5 text-slate-300 group-focus-within:text-primary transition-colors" />
                                            <input
                                                autoFocus
                                                required
                                                type="text"
                                                placeholder="Enter project name..."
                                                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 pl-12 pr-6 text-sm font-bold focus:bg-white focus:border-primary outline-none transition-all shadow-sm"
                                                value={newProject.name}
                                                onChange={e => setNewProject({ ...newProject, name: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">
                                            คำอธิบายเพิ่มเติม (Description)
                                        </label>
                                        <div className="relative group">
                                            <MessageSquare className="absolute left-4 top-4 w-5 h-5 text-slate-300 group-focus-within:text-primary transition-colors" />
                                            <textarea
                                                rows={4}
                                                placeholder="Describe the project objective..."
                                                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 pl-12 pr-6 text-sm font-bold focus:bg-white focus:border-primary outline-none transition-all shadow-sm resize-none"
                                                value={newProject.description}
                                                onChange={e => setNewProject({ ...newProject, description: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-2">
                                    <button
                                        type="submit"
                                        disabled={submitting || !newProject.name}
                                        className="w-full btn-primary py-4 text-sm disabled:opacity-50 disabled:cursor-not-allowed group"
                                    >
                                        {submitting ? (
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        ) : (
                                            <>
                                                ยืนยันการเพิ่มข้อมูล
                                                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Footer Pagination/Branding Slat */}
            <div className="border-t border-slate-100 py-10 opacity-30 mt-auto">
                <div className="max-w-7xl mx-auto px-6 flex justify-between items-center text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                    <span>Sorted by Creation Date</span>
                    <span>Academic Protocol v2.0</span>
                </div>
            </div>
        </main>
    )
}
