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
                className="box-container w-full max-w-[480px] shadow-2xl"
            >
                <div className="box-header flex flex-col items-center gap-3 py-8">
                    <div className="w-12 h-12 rounded-xl bg-[#d9a0a6] flex items-center justify-center shadow-lg shadow-[#d9a0a6]/20">
                        <GraduationCap className="w-7 h-7 text-white" />
                    </div>
                    <div className="text-center">
                        <h1 className="text-2xl font-black text-[#4a3f3a] tracking-tight uppercase">
                            Project Evaluation
                        </h1>
                        <p className="text-[10px] font-black text-accent uppercase tracking-[0.2em] mt-1">
                            University Management System
                        </p>
                    </div>
                </div>

                <div className="box-content min-h-[400px]">
                    {/* Mode Tabs */}
                    <div className="flex border-b border-border -mx-6 -mt-6 mb-8">
                        <button
                            onClick={() => { setIsAdminMode(false); setError(''); }}
                            className={`flex-1 py-4 text-xs font-black uppercase tracking-widest transition-all border-b-2 ${!isAdminMode ? 'border-[#d9a0a6] text-[#4a3f3a] bg-[#f8f1ee]/50' : 'border-transparent text-soft hover:text-[#4a3f3a]'}`}
                        >
                            Evaluator Login
                        </button>
                        <button
                            onClick={() => { setIsAdminMode(true); setError(''); }}
                            className={`flex-1 py-4 text-xs font-black uppercase tracking-widest transition-all border-b-2 ${isAdminMode ? 'border-[#d9a0a6] text-[#4a3f3a] bg-[#f8f1ee]/50' : 'border-transparent text-soft hover:text-[#4a3f3a]'}`}
                        >
                            Administrator
                        </button>
                    </div>

                    <AnimatePresence mode="wait">
                        <motion.form
                            key={isAdminMode ? 'admin' : 'student'}
                            initial={{ opacity: 0, x: 5 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -5 }}
                            transition={{ duration: 0.2 }}
                            onSubmit={handleLogin}
                            className="space-y-6"
                        >
                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-xs font-bold text-center">
                                    {error}
                                </div>
                            )}

                            {!isAdminMode ? (
                                <>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-accent uppercase tracking-widest ml-1">Full Name</label>
                                        <div className="relative">
                                            <User className="absolute left-4 top-3.5 w-4 h-4 text-accent" />
                                            <input
                                                required
                                                type="text"
                                                placeholder="ชื่อ-นามสกุล"
                                                className="minimal-input w-full pl-12 text-sm"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-accent uppercase tracking-widest ml-1">Student ID</label>
                                            <div className="relative">
                                                <Hash className="absolute left-4 top-3.5 w-4 h-4 text-accent" />
                                                <input
                                                    required
                                                    type="text"
                                                    placeholder="รหัสนักศึกษา"
                                                    className="minimal-input w-full pl-12 text-sm"
                                                    value={studentId}
                                                    onChange={(e) => setStudentId(e.target.value)}
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-accent uppercase tracking-widest ml-1">Academic Year</label>
                                            <div className="relative">
                                                <Calendar className="absolute left-4 top-3.5 w-4 h-4 text-accent" />
                                                <select
                                                    className="minimal-input w-full pl-12 appearance-none text-sm font-bold text-[#4a3f3a]"
                                                    value={year}
                                                    onChange={(e) => setYear(e.target.value)}
                                                >
                                                    <option value="1">Year 1</option>
                                                    <option value="2">Year 2</option>
                                                    <option value="3">Year 3</option>
                                                    <option value="4">Year 4</option>
                                                    <option value="5">Other</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="space-y-6 pt-4">
                                    <div className="text-center space-y-2">
                                        <div className="inline-flex p-3 rounded-full bg-[#d9a0a6]/10">
                                            <ShieldCheck className="w-8 h-8 text-[#d9a0a6]" />
                                        </div>
                                        <p className="text-xs font-bold text-soft leading-relaxed">
                                            This section is restricted to authorized personnel only.<br />
                                            Please enter your administrator passphrase.
                                        </p>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-accent uppercase tracking-widest ml-1">Admin Passphrase</label>
                                        <div className="relative">
                                            <Lock className="absolute left-4 top-3.5 w-4 h-4 text-accent" />
                                            <input
                                                required
                                                type="password"
                                                placeholder="••••••••"
                                                className="minimal-input w-full pl-12 text-sm"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            <button
                                disabled={loading}
                                type="submit"
                                className="btn-minimal w-full py-4 text-sm mt-6 group bg-[#4a3f3a] hover:bg-[#322a27]"
                            >
                                {loading ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <span className="flex items-center gap-2">
                                        {isAdminMode ? 'เข้าสู่ระบบแอดมิน' : 'เข้าสู่ระบบ'}
                                        <LogIn className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                                    </span>
                                )}
                            </button>
                        </motion.form>
                    </AnimatePresence>
                </div>

                <div className="box-footer text-center">
                    <p className="text-[10px] font-black text-soft uppercase tracking-widest">
                        © 2024 Engineering Faculty • Student Project Evaluation
                    </p>
                </div>
            </motion.div>
        </div>
    )
}
