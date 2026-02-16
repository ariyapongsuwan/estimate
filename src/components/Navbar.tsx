'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { LogOut, User, LayoutDashboard, Home } from 'lucide-react'

export interface NavbarProps {
    user: {
        name: string
        isAdmin: boolean
    }
}

export default function Navbar({ user }: NavbarProps) {
    const router = useRouter()

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' })
        router.push('/login')
    }

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 p-4">
            <div className="max-w-7xl mx-auto glass-card px-6 py-3 flex items-center justify-between border-white/5">
                <Link href="/" className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                        <LayoutDashboard className="w-5 h-5 text-primary" />
                    </div>
                    <span className="font-bold text-xl tracking-tight glow-text">ProjectEval</span>
                </Link>

                <div className="flex items-center gap-6">
                    <Link href="/" className="text-slate-300 hover:text-white transition-colors flex items-center gap-2 text-sm font-medium">
                        <Home className="w-4 h-4" />
                        หน้าแรก
                    </Link>

                    {user.isAdmin && (
                        <Link href="/admin" className="text-slate-300 hover:text-white transition-colors flex items-center gap-2 text-sm font-medium">
                            <LayoutDashboard className="w-4 h-4" />
                            Admin
                        </Link>
                    )}

                    <div className="h-6 w-[1px] bg-white/10" />

                    <div className="flex items-center gap-3">
                        <div className="flex flex-col items-end">
                            <span className="text-xs text-slate-400 capitalize">ผู้ใช้งาน</span>
                            <span className="text-sm font-semibold text-white">{user.name}</span>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="p-2 rounded-xl hover:bg-red-500/10 text-slate-400 hover:text-red-400 transition-all"
                            title="ออกจากระบบ"
                        >
                            <LogOut className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    )
}
