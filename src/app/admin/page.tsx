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
    ListOrdered
} from 'lucide-react'
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
                <div className="w-10 h-10 border-4 border-[#d9a0a6] border-t-transparent rounded-full animate-spin" />
            </div>
        )
    }

    const filteredEvaluations = stats?.evaluations.filter((ev: any) =>
        ev.evaluator.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ev.project.name.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <main className="min-h-screen pt-32 pb-16 px-6 relative bg-dot">
            <Navbar user={session} />

            <div className="max-w-7xl mx-auto space-y-10">
                <header className="box-container p-8 bg-white flex flex-col md:flex-row md:items-center justify-between gap-8 shadow-xl">
                    <div className="flex items-center gap-6">
                        <div className="w-16 h-16 rounded-[4px] bg-[#4a3f3a] flex items-center justify-center shadow-lg">
                            <BarChart3 className="w-8 h-8 text-white" />
                        </div>
                        <div className="space-y-1">
                            <span className="badge-academic">Administrative Control</span>
                            <h1 className="text-3xl font-black text-[#4a3f3a] uppercase tracking-tighter">Academic Insights Node</h1>
                        </div>
                    </div>
                    <button
                        onClick={handleExportCSV}
                        className="btn-minimal group"
                    >
                        Export Record Data
                        <Download className="ml-2 w-5 h-5 group-hover:-translate-y-1 transition-transform" />
                    </button>
                </header>

                {/* Global Statistics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="box-container p-6 bg-white border-2 border-[#4a3f3a]/5 hover:border-[#d9a0a6] transition-colors">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-2 bg-[#f8f1ee] rounded-[4px]">
                                <Users className="w-5 h-5 text-accent" />
                            </div>
                            <span className="text-[10px] font-black text-accent uppercase tracking-widest">Total Enrollment</span>
                        </div>
                        <p className="text-4xl font-black text-[#4a3f3a] tabular-nums">{stats?.overall.totalStudents}</p>
                    </div>

                    <div className="box-container p-6 bg-white border-2 border-[#4a3f3a]/5 hover:border-[#d9a0a6] transition-colors">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-2 bg-[#f8f1ee] rounded-[4px]">
                                <CheckCircle2 className="w-5 h-5 text-accent" />
                            </div>
                            <span className="text-[10px] font-black text-accent uppercase tracking-widest">Completion Rate</span>
                        </div>
                        <p className="text-4xl font-black text-[#4a3f3a] tabular-nums">{stats?.overall.completionRate}%</p>
                    </div>

                    <div className="box-container p-6 bg-white border-2 border-[#4a3f3a]/5 hover:border-[#d9a0a6] transition-colors">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-2 bg-[#f8f1ee] rounded-[4px]">
                                <BarChart3 className="w-5 h-5 text-accent" />
                            </div>
                            <span className="text-[10px] font-black text-accent uppercase tracking-widest">Catalog Length</span>
                        </div>
                        <p className="text-4xl font-black text-[#4a3f3a] tabular-nums">{stats?.overall.totalProjects}</p>
                    </div>

                    <div className="box-container p-6 bg-[#1a1a1a] text-white border-none shadow-2xl">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-2 bg-white/10 rounded-[4px]">
                                <Clock className="w-5 h-5 text-[#d9a0a6]" />
                            </div>
                            <span className="text-[10px] font-black text-[#d9a0a6] uppercase tracking-widest">Protocol Active</span>
                        </div>
                        <p className="text-4xl font-black tabular-nums">LIVE</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    {/* Rankings Section */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="box-container bg-white overflow-hidden">
                            <div className="box-header flex items-center gap-3">
                                <ListOrdered className="w-5 h-5 text-accent" />
                                <h2 className="text-xs font-black uppercase tracking-widest text-[#4a3f3a]">Master Ranking Catalog</h2>
                            </div>
                            <div className="p-4 space-y-4">
                                {stats?.rankings.map((rank: any, index: number) => (
                                    <div key={rank.id} className="p-4 rounded-[4px] border-2 border-[#f8f1ee] flex items-center justify-between hover:border-border transition-colors">
                                        <div className="flex items-center gap-3">
                                            <span className={`w-6 h-6 rounded-full flex items-center justify-center font-black text-[9px] ${index < 3 ? 'bg-[#d9a0a6] text-white' : 'bg-background text-accent'}`}>
                                                {index + 1}
                                            </span>
                                            <span className="font-bold text-xs truncate max-w-[140px]">{rank.name}</span>
                                        </div>
                                        <span className="text-lg font-black text-[#d9a0a6] tabular-nums">{rank.avgScore}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Detailed Log Table */}
                    <div className="lg:col-span-8 box-container bg-white overflow-hidden flex flex-col">
                        <div className="box-header flex flex-col md:flex-row md:items-center justify-between gap-6 py-8">
                            <div className="flex items-center gap-3">
                                <Clock className="w-5 h-5 text-accent" />
                                <h2 className="text-xs font-black uppercase tracking-widest text-[#4a3f3a]">Master Record Registry</h2>
                            </div>
                            <div className="relative group min-w-[300px]">
                                <Search className="absolute left-4 top-3 w-4 h-4 text-accent group-focus-within:text-[#d9a0a6] transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Search Node Identity or Entity..."
                                    className="minimal-input pl-11 py-2 text-xs font-bold"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-[#f8f1ee] border-b-2 border-[#4a3f3a] text-[9px] font-black text-accent uppercase tracking-[0.2em]">
                                        <th className="px-8 py-5">Node Identity</th>
                                        <th className="px-8 py-5">Target Project</th>
                                        <th className="px-8 py-5 text-center">Score Index</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {filteredEvaluations?.map((ev: any) => (
                                        <tr key={ev.id} className="hover:bg-[#f8f1ee]/50 transition-colors">
                                            <td className="px-8 py-5">
                                                <div className="flex flex-col">
                                                    <span className="font-black text-xs text-[#4a3f3a]">{ev.evaluator.name}</span>
                                                    <span className="text-[9px] font-bold text-soft tabular-nums">{ev.evaluator.studentId} • Yr {ev.evaluator.year}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5">
                                                <span className="text-[11px] font-medium text-soft truncate max-w-[240px] block">{ev.project.name}</span>
                                            </td>
                                            <td className="px-8 py-5 text-center">
                                                <span className="inline-block px-3 py-1 bg-[#4a3f3a] text-white font-black text-xs rounded-full">
                                                    {ev.score}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="box-footer flex justify-between items-center mt-auto">
                            <p className="text-[9px] font-black text-accent uppercase tracking-[0.3em]">Confidential Integrated Ledger • v2.0</p>
                            <div className="bg-[#d9a0a6] w-1.5 h-1.5 rounded-full animate-pulse" />
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}
