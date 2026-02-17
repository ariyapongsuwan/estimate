'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { LogIn, User, Hash, Calendar, ShieldCheck, Lock, GraduationCap, ArrowRight, Sparkles } from 'lucide-react'

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
                setError(data.error || 'การเข้าสู่ระบบล้มเหลว กรุณาตรวจสอบข้อมูลอีกครั้ง')
            }
        } catch (err) {
            setError('เกิดข้อผิดพลาดในการเชื่อมต่อ กรุณาลองใหม่อีกครั้ง')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-white">
            <div className="bg-mesh" />

            {/* Background Decorations */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/5 blur-3xl rounded-full -translate-x-1/2 translate-y-1/2" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="w-full max-w-[480px] relative z-10"
            >
                {/* Branding Above Card */}
                <div className="flex flex-col items-center gap-4 mb-10">
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center shadow-xl shadow-primary/30"
                    >
                        <GraduationCap className="w-9 h-9 text-white" />
                    </motion.div>
                    <div className="text-center space-y-1">
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">
                            ProjectEval
                        </h1>
                        <p className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">
                            Academic Evaluation Portal
                        </p>
                    </div>
                </div>

                <div className="premium-card overflow-hidden !p-0 border-slate-200/60 shadow-2xl shadow-slate-200">
                    {/* Mode Switcher */}
                    <div className="flex bg-slate-50/50 p-1.5 gap-1 border-b border-slate-100">
                        <button
                            onClick={() => { setIsAdminMode(false); setError(''); }}
                            className={`flex-1 py-3 text-xs font-bold rounded-xl transition-all ${!isAdminMode ? 'bg-white text-primary shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
                        >
                            นักศึกษา
                        </button>
                        <button
                            onClick={() => { setIsAdminMode(true); setError(''); }}
                            className={`flex-1 py-3 text-xs font-bold rounded-xl transition-all ${isAdminMode ? 'bg-white text-primary shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
                        >
                            แอดมิน
                        </button>
                    </div>

                    <div className="p-8">
                        <AnimatePresence mode="wait">
                            <motion.form
                                key={isAdminMode ? 'admin' : 'student'}
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                transition={{ duration: 0.3 }}
                                onSubmit={handleLogin}
                                className="space-y-6"
                            >
                                <div className="space-y-2 mb-6">
                                    <h2 className="text-xl font-bold text-slate-900">
                                        {isAdminMode ? 'เจ้าหน้าที่เข้าสู่ระบบ' : 'ลงชื่อเข้าใช้งาน'}
                                    </h2>
                                    <p className="text-sm text-slate-500 font-medium">
                                        {isAdminMode
                                            ? 'ระบุรหัสผ่านเพื่อเข้าใช้งานแผนจัดการระบบ'
                                            : 'กรุณากรอกข้อมูลส่วนตัวเพื่อเริ่มต้นการประเมิน'}
                                    </p>
                                </div>

                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-xs font-bold leading-relaxed"
                                    >
                                        {error}
                                    </motion.div>
                                )}

                                {!isAdminMode ? (
                                    <div className="space-y-4">
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">ชื่อ-นามสกุล</label>
                                            <div className="relative group">
                                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                                                <input
                                                    required
                                                    type="text"
                                                    placeholder="กรอกชื่อ-นามสกุล ของท่าน"
                                                    className="modern-input !pl-12"
                                                    value={name}
                                                    onChange={(e) => setName(e.target.value)}
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="space-y-1.5">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">รหัสนักศึกษา</label>
                                                <div className="relative group">
                                                    <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                                                    <input
                                                        required
                                                        type="text"
                                                        placeholder="รหัสประจำตัว"
                                                        className="modern-input !pl-12"
                                                        value={studentId}
                                                        onChange={(e) => setStudentId(e.target.value)}
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-1.5">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">ชั้นปี</label>
                                                <div className="relative group">
                                                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors pointer-events-none" />
                                                    <select
                                                        className="modern-input !pl-12 appearance-none cursor-pointer"
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
                                    <div className="space-y-4">
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Admin Password</label>
                                            <div className="relative group">
                                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                                                <input
                                                    required
                                                    type="password"
                                                    placeholder="••••••••"
                                                    className="modern-input !pl-12 tracking-widest"
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                />
                                            </div>
                                        </div>
                                        <div className="p-4 bg-amber-50 rounded-xl border border-amber-100 flex gap-3">
                                            <ShieldCheck className="w-5 h-5 text-amber-500 shrink-0" />
                                            <p className="text-[10px] text-amber-700 font-bold leading-relaxed uppercase">
                                                Authorized Access Only: All authentication attempts are logged and monitored for security.
                                            </p>
                                        </div>
                                    </div>
                                )}

                                <button
                                    disabled={loading}
                                    type="submit"
                                    className="btn-primary w-full py-4 relative group overflow-hidden"
                                >
                                    {loading ? (
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <span className="flex items-center gap-2">
                                            {isAdminMode ? 'Authenticate' : 'เริ่มต้นการประเมินผล'}
                                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                        </span>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                                </button>
                            </motion.form>
                        </AnimatePresence>
                    </div>

                    <div className="p-5 bg-slate-50/50 border-t border-slate-100 text-center">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">
                            Faculty of Engineering • Research Division
                        </p>
                    </div>
                </div>

                <div className="mt-8 flex justify-center gap-6 text-slate-400">
                    <div className="flex items-center gap-2">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span className="text-[10px] font-black uppercase tracking-widest">v2.0 Beta</span>
                    </div>
                    <div className="h-3 w-px bg-slate-200" />
                    <Link href="/" className="text-[10px] font-black uppercase tracking-widest hover:text-primary transition-colors">
                        Back to Home
                    </Link>
                </div>
            </motion.div>
        </div>
    )
}
