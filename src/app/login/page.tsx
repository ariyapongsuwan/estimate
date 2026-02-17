'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { LogIn, User, Hash, Calendar, ShieldCheck, Lock, GraduationCap } from 'lucide-react'

export default function LoginPage() {
    const [isAdminMode, setIsAdminMode] = useState(false)
    const [name, setName] = useState('')
    const [studentId, setStudentId] = useState('')
    const [password, setPassword] = useState('')
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
                body: JSON.stringify({
                    name: isAdminMode ? 'admin' : name,
                    studentId: isAdminMode ? 'admin' : studentId,
                    year: isAdminMode ? 4 : parseInt(year),
                    password: isAdminMode ? password : ''
                }),
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
        <div className="min-h-screen flex items-center justify-center p-6 relative bg-[#f1e4de]">
            <div className="bg-dot" />

            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="box-container w-full max-w-[480px] shadow-2xl bg-white border-2"
            >
                {/* Header Section */}
                <div className="box-header flex flex-col items-center gap-4 py-10 border-b-2">
                    <div className="w-14 h-14 rounded-2xl bg-[#4a3f3a] flex items-center justify-center shadow-xl">
                        <GraduationCap className="w-8 h-8 text-white" />
                    </div>
                    <div className="text-center space-y-1">
                        <h1 className="text-3xl font-black text-[#4a3f3a] tracking-tighter uppercase leading-none">
                            ระบบประเมินโครงงาน
                        </h1>
                        <p className="text-[10px] font-black text-accent uppercase tracking-[0.4em]">
                            Academic Evaluation Portal
                        </p>
                    </div>
                </div>

                {/* Mode Switcher */}
                <div className="flex border-b-2 border-border bg-[#f8f1ee]/30">
                    <button
                        onClick={() => { setIsAdminMode(false); setError(''); }}
                        className={`flex-1 py-4 text-[10px] font-black uppercase tracking-[0.2em] transition-all border-r-2 ${!isAdminMode ? 'text-[#4a3f3a] bg-white' : 'text-soft hover:text-[#4a3f3a]'}`}
                    >
                        นักศึกษา
                    </button>
                    <button
                        onClick={() => { setIsAdminMode(true); setError(''); }}
                        className={`flex-1 py-4 text-[10px] font-black uppercase tracking-[0.2em] transition-all ${isAdminMode ? 'text-[#4a3f3a] bg-white border-l-2' : 'text-soft hover:text-[#4a3f3a]'}`}
                    >
                        แอดมิน
                    </button>
                </div>

                <div className="box-content p-8 min-h-[440px] flex flex-col justify-center">
                    <AnimatePresence mode="wait">
                        <motion.form
                            key={isAdminMode ? 'admin' : 'student'}
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.98 }}
                            transition={{ duration: 0.2 }}
                            onSubmit={handleLogin}
                            className="space-y-8"
                        >
                            {error && (
                                <div className="p-4 border-2 border-red-200 bg-red-50 text-red-600 rounded-lg text-[10px] font-black text-center uppercase tracking-widest">
                                    {error}
                                </div>
                            )}

                            {!isAdminMode ? (
                                <div className="space-y-8">
                                    {/* Name Input Box */}
                                    <div className="border-2 border-border rounded-lg bg-[#f8f1ee]/20 overflow-hidden shadow-sm">
                                        <div className="bg-[#f8f1ee] border-b-2 border-border py-2 text-center">
                                            <label className="text-[10px] font-black text-[#4a3f3a] uppercase tracking-widest">ชื่อ-นามสกุล (ไทย/อังกฤษ)</label>
                                        </div>
                                        <div className="p-4 flex flex-col items-center gap-3">
                                            <User className="w-4 h-4 text-accent" />
                                            <input
                                                required
                                                type="text"
                                                placeholder="กรอกชื่อ-นามสกุล ของนักศึกษา"
                                                className="w-full text-center text-base font-bold bg-transparent outline-none placeholder:text-accent/30"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    {/* Student Info Grid */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div className="border-2 border-border rounded-lg bg-[#f8f1ee]/20 overflow-hidden shadow-sm">
                                            <div className="bg-[#f8f1ee] border-b-2 border-border py-2 text-center">
                                                <label className="text-[9px] font-black text-[#4a3f3a] uppercase tracking-widest">รหัสนักศึกษา</label>
                                            </div>
                                            <div className="p-4 flex flex-col items-center gap-2">
                                                <Hash className="w-3.5 h-3.5 text-accent" />
                                                <input
                                                    required
                                                    type="text"
                                                    placeholder="รหัสนักศึกษา"
                                                    className="w-full text-center text-sm font-bold bg-transparent outline-none placeholder:text-accent/30"
                                                    value={studentId}
                                                    onChange={(e) => setStudentId(e.target.value)}
                                                />
                                            </div>
                                        </div>

                                        <div className="border-2 border-border rounded-lg bg-[#f8f1ee]/20 overflow-hidden shadow-sm">
                                            <div className="bg-[#f8f1ee] border-b-2 border-border py-2 text-center">
                                                <label className="text-[9px] font-black text-[#4a3f3a] uppercase tracking-widest">ชั้นปีการศึกษา</label>
                                            </div>
                                            <div className="p-4 flex flex-col items-center gap-2">
                                                <Calendar className="w-3.5 h-3.5 text-accent" />
                                                <select
                                                    className="w-full text-center text-sm font-bold bg-transparent outline-none cursor-pointer appearance-none"
                                                    value={year}
                                                    onChange={(e) => setYear(e.target.value)}
                                                >
                                                    <option value="1">Year 1</option>
                                                    <option value="2">Year 2</option>
                                                    <option value="3">Year 3</option>
                                                    <option value="4">Year 4</option>
                                                    <option value="5">Year 5+</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-8">
                                    <div className="text-center space-y-4">
                                        <div className="inline-flex p-4 rounded-xl bg-[#d9a0a6]/10 border-2 border-[#d9a0a6]/20">
                                            <ShieldCheck className="w-8 h-8 text-[#d9a0a6]" />
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black text-[#4a3f3a] uppercase tracking-[0.2em]">Authorized Access Only</p>
                                        </div>
                                    </div>

                                    <div className="border-2 border-[#d9a0a6]/30 rounded-lg bg-[#f8f1ee]/20 overflow-hidden shadow-sm">
                                        <div className="bg-[#d9a0a6]/10 border-b-2 border-[#d9a0a6]/20 py-2 text-center">
                                            <label className="text-[10px] font-black text-[#d9a0a6] uppercase tracking-[0.2em]">รหัสผ่านแอดมิน</label>
                                        </div>
                                        <div className="p-6 flex flex-col items-center gap-4">
                                            <Lock className="w-4 h-4 text-[#d9a0a6]" />
                                            <input
                                                required
                                                type="password"
                                                placeholder="••••••••"
                                                className="w-full text-center text-lg tracking-[0.4em] font-black bg-transparent outline-none placeholder:tracking-normal placeholder:text-[#d9a0a6]/30"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Login Button Area */}
                            <div className="pt-4 flex justify-center">
                                <div className="border-2 border-[#4a3f3a] p-1.5 rounded-lg">
                                    <button
                                        disabled={loading}
                                        type="submit"
                                        className="bg-[#4a3f3a] hover:bg-black text-white px-8 py-3 rounded-md text-[11px] font-black tracking-widest transition-all shadow-lg active:scale-95 disabled:opacity-50"
                                    >
                                        {loading ? (
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        ) : (
                                            <span className="flex items-center gap-3">
                                                {isAdminMode ? 'AUTHENTICATE' : 'เข้าสู่ระบบเพื่อประเมินผล'}
                                                <LogIn className="w-3.5 h-3.5" />
                                            </span>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </motion.form>
                    </AnimatePresence>
                </div>

                <div className="box-footer text-center bg-[#f8f1ee]/50 py-6 border-t-2">
                    <p className="text-[9px] font-black text-accent uppercase tracking-[0.4em]">
                        Faculty of Engineering • Internal Use Only
                    </p>
                </div>
            </motion.div>
        </div>
    )
}
