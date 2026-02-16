'use client'

import { useState, useEffect } from 'react'
import Navbar from '@/components/Navbar'
import {
    Users,
    CheckCircle2,
    BarChart3,
    Download,
    Search,
    Clock,
    ListOrdered,
    GraduationCap,
    Activity
} from 'lucide-react'
import { motion } from 'framer-motion'
import { UserSession } from '@/lib/auth'

export default function AdminPage() {
    const [stats, setStats] = useState<any>(null)
    const [session, setSession] = useState<UserSession | null>(null)
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsRes, sessRes] = await Promise.all([
                    fetch('/api/admin/stats'),
                    fetch('/api/auth/session')
                ])
                const statsData = await statsRes.json()
                const sessData = await sessRes.json()
                setStats(statsData)
                setSession(sessData)
            } catch (error) {
                console.error('Fetch error:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    const handleExportCSV = () => {
        window.location.href = '/api/admin/export'
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#f1e4de]">
                <div className="w-12 h-12 border-4 border-[#d9a0a6]/30 border-t-[#d9a0a6] rounded-full animate-spin" />
            </div>
        )
    }

    const filteredEvaluations = stats?.evaluations.filter((ev: any) =>
        ev.evaluator.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ev.project.name.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <main className="min-h-screen pt-32 pb-16 px-6 bg-[#f1e4de] relative">
            <Navbar user={session} />
            <div className="bg-dot" />

            <div className="max-w-7xl mx-auto space-y-8 relative z-10">
                <header className="box-container flex flex-col md:flex-row md:items-center justify-between gap-6 p-8 bg-white shadow-xl">
                    <div className="flex items-center gap-6">
                        <div className="w-16 h-16 rounded-2xl bg-[#4a3f3a] flex items-center justify-center shadow-2xl">
                            <BarChart3 className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black text-[#4a3f3a] uppercase tracking-tighter">Academic Metrics Portal</h1>
                            <p className="text-[10px] font-black text-accent uppercase tracking-[0.3em] mt-1">Administrator Control Panel • Protocol v1.0</p>
                        </div>
                    </div>

                    <button
                        onClick={handleExportCSV}
                        className="btn-minimal flex items-center gap-3 px-8 bg-[#4a3f3a] hover:bg-black text-white group shadow-xl shadow-[#4a3f3a]/10"
                    >
                        <Download className="w-4 h-4" />
                        Export Protocol (CSV)
                    </button>
                </header>

                {/* Strategic Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="box-container bg-white">
                        <div className="box-header border-none pb-0">
                            <Users className="w-5 h-5 text-accent" />
                        </div>
                        <div className="box-content pt-2">
                            <p className="text-4xl font-black text-[#4a3f3a]">{stats?.overall.totalStudents}</p>
                            <p className="text-[10px] font-black text-accent uppercase tracking-widest mt-1">Total Enrollment</p>
                        </div>
                    </div>

                    <div className="box-container bg-white">
                        <div className="box-header border-none pb-0">
                            <Activity className="w-5 h-5 text-[#d9a0a6]" />
                        </div>
                        <div className="box-content pt-2">
                            <p className="text-4xl font-black text-[#d9a0a6]">{stats?.overall.completionRate}%</p>
                            <p className="text-[10px] font-black text-accent uppercase tracking-widest mt-1">Active Participation</p>
                        </div>
                    </div>

                    <div className="box-container bg-white">
                        <div className="box-header border-none pb-0">
                            <CheckCircle2 className="w-5 h-5 text-[#bba9a1]" />
                        </div>
                        <div className="box-content pt-2 text-soft">
                            <p className="text-4xl font-black">{stats?.overall.totalEvaluations}</p>
                            <p className="text-[10px] font-black text-accent uppercase tracking-widest mt-1">Total Submissions</p>
                        </div>
                    </div>

                    <div className="box-container bg-white">
                        <div className="box-header border-none pb-0">
                            <GraduationCap className="w-5 h-5 text-accent" />
                        </div>
                        <div className="box-content pt-2">
                            <p className="text-4xl font-black text-[#4a3f3a]">{stats?.overall.totalProjects}</p>
                            <p className="text-[10px] font-black text-accent uppercase tracking-widest mt-1">Projects Cataloged</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Rankings Panel */}
                    <div className="lg:col-span-4 space-y-4">
                        <div className="box-container bg-white shadow-lg h-full">
                            <div className="box-header flex items-center gap-3">
                                <ListOrdered className="w-5 h-5 text-[#d9a0a6]" />
                                <h2 className="text-xs font-black text-[#4a3f3a] uppercase tracking-widest">Performance Ranking</h2>
                            </div>
                            <div className="divide-y divide-border">
                                {stats?.rankings.map((rank: any, index: number) => (
                                    <div key={rank.id} className="p-4 flex items-center justify-between hover:bg-[#f8f1ee]/30 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <span className="text-[10px] font-black text-accent w-4">{index + 1}.</span>
                                            <span className="font-bold text-xs text-[#4a3f3a] line-clamp-1">{rank.name}</span>
                                        </div>
                                        <span className="text-xs font-black text-[#d9a0a6] bg-[#d9a0a6]/5 px-2 py-1 rounded border border-[#d9a0a6]/20 underline underline-offset-4">
                                            {rank.avgScore}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Detailed Data Table */}
                    <div className="lg:col-span-8 space-y-4">
                        <div className="box-container bg-white shadow-lg overflow-hidden flex flex-col h-full">
                            <div className="box-header flex items-center justify-between flex-wrap gap-4">
                                <div className="flex items-center gap-3">
                                    <Clock className="w-5 h-5 text-[#bba9a1]" />
                                    <h2 className="text-xs font-black text-[#4a3f3a] uppercase tracking-widest">Master Protocol Registry</h2>
                                </div>
                                <div className="relative">
                                    <Search className="absolute left-3 top-2.5 w-4 h-4 text-accent" />
                                    <input
                                        type="text"
                                        placeholder="Filter by name/project..."
                                        className="minimal-input text-[11px] pl-9 pr-4 py-2 w-full sm:w-64 h-9 font-bold tracking-tight"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="bg-[#f8f1ee] border-b border-border text-[9px] font-black text-accent uppercase tracking-[0.2em]">
                                            <th className="px-6 py-4">Evaluator Credentials</th>
                                            <th className="px-6 py-4">Project Entity</th>
                                            <th className="px-6 py-4 text-center">Score</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border/50 text-xs font-medium">
                                        {filteredEvaluations?.map((ev: any) => (
                                            <tr key={ev.id} className="hover:bg-[#f1e4de]/20 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col gap-0.5">
                                                        <span className="font-black text-[#4a3f3a]">{ev.evaluator.name}</span>
                                                        <span className="text-[10px] text-soft tabular-nums">{ev.evaluator.studentId} • Y{ev.evaluator.year}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 truncate max-w-[240px]">
                                                    <span className="text-soft font-bold">{ev.project.name}</span>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <span className="inline-block px-3 py-1 bg-[#4a3f3a] text-white rounded font-black text-[10px]">
                                                        {ev.score}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {filteredEvaluations?.length === 0 && (
                                <div className="flex-1 flex flex-col items-center justify-center p-12 opacity-30">
                                    <Search className="w-12 h-12 mb-4" />
                                    <p className="text-xs font-black uppercase tracking-widest">No matching records found</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-dot" />
        </main>
    )
}
