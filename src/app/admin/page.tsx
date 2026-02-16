'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
    Users,
    BarChart3,
    ListOrdered,
    Download,
    Search,
    CheckCircle2,
    Clock,
    ExternalLink
} from 'lucide-react'
import Navbar from '@/components/Navbar'

export default function AdminDashboard() {
    const [data, setData] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState<any>(null)
    const [searchTerm, setSearchTerm] = useState('')

    useEffect(() => {
        async function fetchData() {
            try {
                const [statsRes, sessionRes] = await Promise.all([
                    fetch('/api/admin/stats'),
                    fetch('/api/auth/session')
                ])

                if (statsRes.ok && sessionRes.ok) {
                    const statsData = await statsRes.json()
                    const sessionData = await sessionRes.json()
                    setData(statsData)
                    setUser(sessionData)
                }
            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    const handleExportCSV = async () => {
        window.location.href = '/api/admin/export'
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
            </div>
        )
    }

    if (!data) return <div>Unauthorized or Error</div>

    const filteredEvaluations = data.allEvaluations.filter((ev: any) =>
        ev.evaluator.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ev.project.name.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <main className="min-h-screen pt-24 pb-12 px-6">
            <Navbar user={user} />

            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <h1 className="text-4xl font-bold glow-text mb-2">Admin Dashboard</h1>
                        <p className="text-slate-400">ภาพรวมการประเมินโครงงานทั้งหมดในระบบ</p>
                    </div>
                    <button
                        onClick={handleExportCSV}
                        className="btn-primary flex items-center gap-2 group"
                    >
                        <Download className="w-5 h-5 group-hover:translate-y-0.5 transition-transform" />
                        ส่งออกข้อมูล CSV
                    </button>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="glass-card p-6 border-white/5 flex items-center gap-6">
                        <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center">
                            <Users className="w-7 h-7 text-blue-400" />
                        </div>
                        <div>
                            <p className="text-slate-400 text-sm">นักศึกษาทั้งหมด</p>
                            <p className="text-3xl font-bold text-white">{data.summary.totalStudents}</p>
                        </div>
                    </div>

                    <div className="glass-card p-6 border-white/5 flex items-center gap-6">
                        <div className="w-14 h-14 rounded-2xl bg-green-500/10 flex items-center justify-center">
                            <CheckCircle2 className="w-7 h-7 text-green-400" />
                        </div>
                        <div>
                            <p className="text-slate-400 text-sm">ประเมินแล้ว</p>
                            <div className="flex items-baseline gap-2">
                                <p className="text-3xl font-bold text-white">{data.summary.evaluatedCount}</p>
                                <p className="text-green-400 text-sm font-medium">({data.summary.percentComplete}%)</p>
                            </div>
                        </div>
                    </div>

                    <div className="glass-card p-6 border-white/5 flex items-center gap-6">
                        <div className="w-14 h-14 rounded-2xl bg-purple-500/10 flex items-center justify-center">
                            <BarChart3 className="w-7 h-7 text-purple-400" />
                        </div>
                        <div>
                            <p className="text-slate-400 text-sm">โครงงานทั้งหมด</p>
                            <p className="text-3xl font-bold text-white">{data.projectStats.length}</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Rankings */}
                    <div className="lg:col-span-1 space-y-4">
                        <div className="flex items-center gap-2 px-2">
                            <ListOrdered className="w-5 h-5 text-primary" />
                            <h2 className="text-xl font-bold">อันดับคะแนนเฉลี่ย</h2>
                        </div>
                        <div className="glass-card border-white/5 overflow-hidden">
                            <div className="divide-y divide-white/5">
                                {data.projectStats.map((project: any, index: number) => (
                                    <div key={project.id} className="p-4 flex items-center justify-between group hover:bg-white/5 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <span className={`text-lg font-black w-6 ${index === 0 ? 'text-yellow-400' : index === 1 ? 'text-slate-300' : index === 2 ? 'text-orange-400' : 'text-slate-600'}`}>
                                                {index + 1}
                                            </span>
                                            <div>
                                                <p className="font-bold text-sm text-white group-hover:text-primary transition-colors">{project.name}</p>
                                                <p className="text-xs text-slate-500">{project.evaluationCount} การประเมิน</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-lg font-bold text-primary">{project.averageScore}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Evaluation List */}
                    <div className="lg:col-span-2 space-y-4">
                        <div className="flex items-center justify-between px-2">
                            <div className="flex items-center gap-2">
                                <Clock className="w-5 h-5 text-blue-400" />
                                <h2 className="text-xl font-bold">ข้อมูลการประเมิน</h2>
                            </div>
                            <div className="relative">
                                <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                                <input
                                    type="text"
                                    placeholder="ค้นหาชื่อหรือโครงงาน..."
                                    className="glass-input text-xs pl-9 pr-4 py-2 w-64"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="glass-card border-white/5 overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-white/10 bg-white/5">
                                        <th className="p-4 text-xs font-bold text-slate-400 uppercase">ผู้ประเมิน</th>
                                        <th className="p-4 text-xs font-bold text-slate-400 uppercase">โครงงาน</th>
                                        <th className="p-4 text-xs font-bold text-slate-400 uppercase text-center">คะแนน</th>
                                        <th className="p-4 text-xs font-bold text-slate-400 uppercase">ความเห็น</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5 text-sm">
                                    {filteredEvaluations.map((ev: any) => (
                                        <tr key={ev.id} className="hover:bg-white/5 transition-colors">
                                            <td className="p-4">
                                                <p className="font-medium text-white">{ev.evaluator.name}</p>
                                                <p className="text-xs text-slate-500">{ev.evaluator.studentId} • ปี {ev.evaluator.year}</p>
                                            </td>
                                            <td className="p-4 align-top">
                                                <p className="text-slate-300">{ev.project.name}</p>
                                            </td>
                                            <td className="p-4 text-center align-top">
                                                <span className="inline-block px-2 py-1 rounded-md bg-primary/20 text-primary font-bold">
                                                    {ev.score}
                                                </span>
                                            </td>
                                            <td className="p-4 align-top">
                                                <p className="text-slate-400 italic text-xs max-w-xs line-clamp-2">
                                                    {ev.comment || '-'}
                                                </p>
                                            </td>
                                        </tr>
                                    ))}
                                    {filteredEvaluations.length === 0 && (
                                        <tr>
                                            <td colSpan={4} className="p-12 text-center text-slate-500 italic">
                                                ไม่พบข้อมูลการประเมิน
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}
