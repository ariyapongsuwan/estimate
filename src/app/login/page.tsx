'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { LogIn, User, Hash, Calendar } from 'lucide-react'

export default function LoginPage() {
    const [name, setName] = useState('')
    const [studentId, setStudentId] = useState('')
    const [year, setYear] = useState('1')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const router = useRouter()

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, studentId, year: parseInt(year) }),
            })

            const data = await res.json()

            if (res.ok) {
                if (data.isAdmin) {
                    router.push('/admin')
                } else {
                    router.push('/')
                }
            } else {
                setError(data.error || 'Login failed')
            }
        } catch (err) {
            setError('Something went wrong. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-height-screen flex items-center justify-center p-6 relative overflow-hidden">
            {/* Animated Background Orbs */}
            <div className="bg-dot" style={{ top: '-10%', left: '-10%' }} />
            <div className="bg-dot" style={{ bottom: '-10%', right: '-10%', background: '#818cf8' }} />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="glass-card p-8 w-full max-w-md"
            >
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/20 mb-4">
                        <LogIn className="w-8 h-8 text-primary" />
                    </div>
                    <h1 className="text-3xl font-bold glow-text mb-2">เข้าสู่ระบบ</h1>
                    <p className="text-slate-400">กรุณากรอกข้อมูลเพื่อเข้าสู่ระบบประเมิน</p>
                </div>

                {error && (
                    <div className="bg-red-500/20 border border-red-500/50 text-red-200 p-3 rounded-lg mb-6 text-sm text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300 ml-1">ชื่อ-นามสกุล</label>
                        <div className="relative">
                            <User className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
                            <input
                                required
                                type="text"
                                placeholder="ชื่อ นามสกุล"
                                className="glass-input w-full pl-10 pr-4 py-2.5"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300 ml-1">รหัสนักศึกษา</label>
                        <div className="relative">
                            <Hash className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
                            <input
                                required
                                type="text"
                                placeholder="รหัสนักศึกษา"
                                className="glass-input w-full pl-10 pr-4 py-2.5"
                                value={studentId}
                                onChange={(e) => setStudentId(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300 ml-1">ชั้นปี</label>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
                            <select
                                className="glass-input w-full pl-10 pr-4 py-2.5 appearance-none"
                                value={year}
                                onChange={(e) => setYear(e.target.value)}
                            >
                                <option value="1">ชั้นปีที่ 1</option>
                                <option value="2">ชั้นปีที่ 2</option>
                                <option value="3">ชั้นปีที่ 3</option>
                                <option value="4">ชั้นปีที่ 4</option>
                                <option value="5">อื่นๆ</option>
                            </select>
                        </div>
                    </div>

                    <button
                        disabled={loading}
                        type="submit"
                        className="btn-primary w-full flex items-center justify-center gap-2 mt-4"
                    >
                        {loading ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <>เข้าสู่ระบบ</>
                        )}
                    </button>
                </form>
            </motion.div>
        </div>
    )
}
