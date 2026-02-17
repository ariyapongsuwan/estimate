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
    Award,
    PieChart as PieChartIcon,
    ArrowUpRight,
    TrendingUp,
    ShieldCheck,
    Calendar,
    Filter
} from 'lucide-react'
import { UserSession } from '@/lib/auth'
import { motion, AnimatePresence } from 'framer-motion'
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
    PieChart,
    Pie,
    Legend
} from 'recharts'

export default function AdminPage() {
    const [data, setData] = useState<any>(null)
    const [session, setSession] = useState<UserSession | null>(null)
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [activeTab, setActiveTab] = useState<'overview' | 'log'>('overview')

    const fetchData = async () => {
        try {
            const [statsRes, sessRes] = await Promise.all([
                fetch('/api/admin/stats'),
                fetch('/api/auth/session')
            ])
            if (statsRes.ok && sessRes.ok) {
                const statsData = await statsRes.json()
                const sessData = await sessRes.json()
                setData(statsData)
                setSession(sessData)
            }
        } catch (error) {
            console.error('Fetch error:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    const handleExportCSV = () => {
        window.location.href = '/api/admin/export'
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin shadow-lg" />
            </div>
        )
    }

    if (!session?.isAdmin) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="text-center space-y-4">
                    <ShieldCheck className="w-16 h-16 text-slate-300 mx-auto" />
                    <h2 className="text-2xl font-black text-slate-900 uppercase">Access Restricted</h2>
                    <p className="text-slate-500 font-medium">This terminal is reserved for academic administrators.</p>
                </div>
            </div>
        )
    }

    const filteredEvaluations = data?.allEvaluations.filter((ev: any) =>
        ev.evaluator.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ev.project.name.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const pieData = [
        { name: 'Evaluated', value: data?.summary.evaluatedCount, color: '#6366f1' },
        { name: 'Pending', value: data?.summary.notEvaluatedCount, color: '#e5e7eb' }
    ]

    const COLORS = ['#6366f1', '#e2e8f0']

    return (
        <main className="min-h-screen bg-slate-50/50 relative overflow-hidden pb-24">
            <div className="bg-mesh opacity-50" />
            <Navbar user={session} />

            <div className="max-w-7xl mx-auto px-6 pt-32 relative z-10">
                {/* Dashboard Header */}
                <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-[10px] font-black uppercase tracking-widest">
                            <ShieldCheck className="w-3 h-3" />
                            Administrator Dashboard v2.0
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight uppercase leading-none">
                            ศูนย์ควบคุมข้อมูล<span className="text-primary">.</span>
                        </h1>
                        <p className="text-slate-500 font-medium max-w-xl leading-relaxed">
                            ระบบสรุปผลการประเมินโครงงาน วิเคราะห์คะแนนเฉลี่ย และติดตามสัดส่วนการมีส่วนร่วมของนักศึกษาทั้งหมดในระบบ
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleExportCSV}
                            className="bg-white hover:bg-slate-50 text-slate-900 font-black text-xs uppercase tracking-widest px-6 py-4 rounded-2xl border border-slate-200 shadow-sm transition-all flex items-center gap-2 group"
                        >
                            <Download className="w-4 h-4 text-slate-400 group-hover:text-primary transition-colors" />
                            Export CSV Data
                        </button>
                    </div>
                </header>

                {/* Summary Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="premium-card p-6 bg-white flex flex-col justify-between"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-indigo-50 rounded-xl">
                                <Users className="w-6 h-6 text-indigo-600" />
                            </div>
                            <span className="text-[10px] font-black text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-full uppercase">Live</span>
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">นักเรียนทั้งหมด</p>
                            <p className="text-4xl font-black text-slate-900">{data?.summary.totalStudents}</p>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="premium-card p-6 bg-white flex flex-col justify-between"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-primary/10 rounded-xl">
                                <CheckCircle2 className="w-6 h-6 text-primary" />
                            </div>
                            <span className="text-[10px] font-black text-primary bg-primary/5 px-2 py-0.5 rounded-full uppercase">
                                {data?.summary.percentComplete}% Complete
                            </span>
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">ประเมินแล้ว</p>
                            <p className="text-4xl font-black text-slate-900">{data?.summary.evaluatedCount}</p>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="premium-card p-6 bg-white flex flex-col justify-between"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-amber-50 rounded-xl">
                                <Award className="w-6 h-6 text-amber-500" />
                            </div>
                            <TrendingUp className="w-5 h-5 text-amber-500" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">โครงงานยอดเยี่ยม</p>
                            <div className="flex items-baseline gap-2">
                                <p className="text-2xl font-black text-slate-900 line-clamp-1">{data?.summary.topProject?.name || 'N/A'}</p>
                                <p className="text-sm font-black text-amber-500 shrink-0">{data?.summary.topProject?.score}</p>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="premium-card p-6 bg-slate-900 text-white flex flex-col justify-between !border-none shadow-2xl shadow-indigo-200/50"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-white/10 rounded-xl">
                                <TrendingUp className="w-6 h-6 text-indigo-400" />
                            </div>
                            <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">จำนวนการประเมินรวม</p>
                            <p className="text-4xl font-black text-white">{data?.summary.totalEvaluations}</p>
                        </div>
                    </motion.div>
                </div>

                {/* Main Content Sections */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    {/* Data Visualization Column */}
                    <div className="lg:col-span-8 space-y-10">
                        {/* Bar Chart Section */}
                        <div className="premium-card p-8 bg-white border-slate-200/60 shadow-md">
                            <div className="flex items-center justify-between mb-8">
                                <div className="space-y-1">
                                    <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">กราฟสรุปคะแนนเฉลี่ยรายโครงงาน</h3>
                                    <p className="text-xs text-slate-400 font-medium">คะแนนเฉลี่ยจากผู้ประเมินทั้งหมด (สเกล 1-10)</p>
                                </div>
                                <div className="p-3 bg-slate-50 rounded-xl">
                                    <BarChart3 className="w-5 h-5 text-indigo-600" />
                                </div>
                            </div>

                            <div className="h-[400px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart
                                        data={data?.projectStats}
                                        layout="vertical"
                                        margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                                        <XAxis type="number" domain={[0, 10]} hide />
                                        <YAxis
                                            dataKey="name"
                                            type="category"
                                            width={150}
                                            tick={{ fontSize: 10, fontWeight: 700, fill: '#64748b' }}
                                            axisLine={false}
                                            tickLine={false}
                                        />
                                        <Tooltip
                                            cursor={{ fill: '#f8fafc' }}
                                            contentStyle={{
                                                borderRadius: '16px',
                                                border: 'none',
                                                boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
                                                fontSize: '12px',
                                                fontWeight: 'bold'
                                            }}
                                        />
                                        <Bar dataKey="averageScore" radius={[0, 12, 12, 0]} barSize={24}>
                                            {data?.projectStats.map((entry: any, index: number) => (
                                                <Cell key={`cell-${index}`} fill={index === 0 ? '#6366f1' : '#818cf8'} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Evaluation Log Table */}
                        <div className="premium-card bg-white border-slate-200/60 shadow-md overflow-hidden">
                            <div className="p-8 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <div className="space-y-1">
                                    <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">บันทึกรายการประเมินทั้งหมด</h3>
                                    <p className="text-xs text-slate-400 font-medium">รายละเอียดย้อนหลังตามลำดับเวลา</p>
                                </div>
                                <div className="relative flex-1 max-w-[320px]">
                                    <Search className="absolute left-4 top-4 w-4 h-4 text-slate-400" />
                                    <input
                                        type="text"
                                        placeholder="ค้นหาชื่อผู้ประเมิน หรือโครงงาน..."
                                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 pl-12 pr-6 text-xs font-bold focus:bg-white focus:border-indigo-500 outline-none transition-all shadow-sm"
                                        value={searchTerm}
                                        onChange={e => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="bg-slate-50 border-y border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest pl-8">
                                            <th className="px-8 py-5 text-left">ผู้ประเมิน</th>
                                            <th className="px-8 py-5 text-left">หัวข้อโครงงาน</th>
                                            <th className="px-8 py-5 text-center">วัน/เวลา</th>
                                            <th className="px-8 py-5 text-center">คะแนน</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {filteredEvaluations?.map((ev: any, i: number) => (
                                            <tr key={ev.id} className="hover:bg-slate-50/50 transition-colors group">
                                                <td className="px-8 py-6">
                                                    <div className="flex flex-col">
                                                        <span className="font-extrabold text-xs text-slate-900">{ev.evaluator.name}</span>
                                                        <span className="text-[10px] text-slate-400 tabular-nums">{ev.evaluator.studentId} • Yr {ev.evaluator.year}</span>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <span className="text-xs font-bold text-slate-600 line-clamp-1">{ev.project.name}</span>
                                                </td>
                                                <td className="px-8 py-6 text-center">
                                                    <div className="flex flex-col items-center">
                                                        <span className="text-[10px] font-bold text-slate-500 uppercase">
                                                            {new Date(ev.createdAt).toLocaleDateString()}
                                                        </span>
                                                        <span className="text-[9px] text-slate-300">
                                                            {new Date(ev.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6 text-center">
                                                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 font-black text-xs border border-indigo-100 shadow-sm shadow-indigo-100/50">
                                                        {ev.score}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Side Distribution & Rankings Column */}
                    <div className="lg:col-span-4 space-y-10">
                        {/* Completion Ratio Pie Chart */}
                        <div className="premium-card p-8 bg-white border-slate-200/60 shadow-md">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="p-3 bg-slate-50 rounded-xl">
                                    <PieChartIcon className="w-5 h-5 text-indigo-600" />
                                </div>
                                <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">สัดส่วนการมีส่วนร่วม</h3>
                            </div>

                            <div className="h-[280px] w-full relative">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={pieData}
                                            innerRadius={70}
                                            outerRadius={90}
                                            paddingAngle={8}
                                            dataKey="value"
                                        >
                                            {pieData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                    <span className="text-3xl font-black text-slate-900 leading-none">{data?.summary.percentComplete}%</span>
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1 text-center">Completion<br />Progress</span>
                                </div>
                            </div>

                            <div className="mt-6 space-y-3">
                                {pieData.map((item) => (
                                    <div key={item.name} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                                        <div className="flex items-center gap-3">
                                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                                            <span className="text-xs font-black text-slate-600 uppercase tracking-widest">{item.name}</span>
                                        </div>
                                        <span className="text-sm font-black text-slate-900">{item.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Project Ranking Table (Mini) */}
                        <div className="premium-card bg-indigo-900 text-white shadow-2xl overflow-hidden border-none">
                            <div className="p-6 bg-white/10 backdrop-blur-md flex items-center gap-3 border-b border-white/10">
                                <ListOrdered className="w-5 h-5 text-indigo-300" />
                                <h3 className="text-xs font-black uppercase tracking-widest text-indigo-100">Top Rated Performance</h3>
                            </div>
                            <div className="p-4 space-y-3">
                                {data?.projectStats.slice(0, 5).map((rank: any, index: number) => (
                                    <div key={rank.id} className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between hover:bg-white/10 transition-colors group">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-6 h-6 rounded-full flex items-center justify-center font-black text-[9px] ${index === 0 ? 'bg-amber-400 text-amber-900 shadow-lg shadow-amber-400/20' : 'bg-white/20 text-white'}`}>
                                                {index + 1}
                                            </div>
                                            <span className="font-bold text-xs truncate max-w-[160px] text-white group-hover:text-amber-400 transition-colors">
                                                {rank.name}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="h-1 w-12 bg-white/10 rounded-full overflow-hidden">
                                                <div className="h-full bg-indigo-400" style={{ width: `${(rank.averageScore / 10) * 100}%` }} />
                                            </div>
                                            <span className="text-sm font-black text-white tabular-nums">{rank.averageScore}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="p-6 text-center border-t border-white/5">
                                <p className="text-[9px] font-black text-indigo-300 uppercase tracking-widest opacity-60">
                                    Analysis based on {data?.summary.totalEvaluations} data nodes
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}
