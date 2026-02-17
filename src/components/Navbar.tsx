'use client'

import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { LogOut, Home, LayoutDashboard, User as UserIcon, Bell } from 'lucide-react'
import { UserSession } from '@/lib/auth'

interface NavbarProps {
    user: UserSession | null
}

export default function Navbar({ user }: NavbarProps) {
    const router = useRouter()
    const pathname = usePathname()

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' })
        router.push('/login')
    }

    const isActive = (path: string) => pathname === path

    return (
        <nav className="fixed top-4 left-0 right-0 z-50 px-6">
            <div className="max-w-7xl mx-auto glass rounded-2xl px-6 py-3 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/30 group-hover:scale-110 transition-transform duration-300">
                        <LayoutDashboard className="w-6 h-6 text-white" />
                    </div>
                    <span className="font-extrabold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-primary">
                        ProjectEval
                    </span>
                </Link>

                <div className="flex items-center gap-6">
                    <div className="hidden md:flex items-center gap-2 bg-slate-100/50 p-1 rounded-xl">
                        <Link
                            href="/"
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${isActive('/')
                                ? 'bg-white text-primary shadow-sm'
                                : 'text-slate-500 hover:text-slate-900'
                                }`}
                        >
                            <Home className="w-4 h-4" />
                            หน้าแรก
                        </Link>

                        {user?.isAdmin && (
                            <Link
                                href="/admin"
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${isActive('/admin')
                                    ? 'bg-white text-primary shadow-sm'
                                    : 'text-slate-500 hover:text-slate-900'
                                    }`}
                            >
                                <LayoutDashboard className="w-4 h-4" />
                                แผงจัดการ
                            </Link>
                        )}
                    </div>

                    <div className="h-8 w-px bg-slate-200 hidden md:block" />

                    <div className="flex items-center gap-3">
                        <div className="hidden lg:flex flex-col items-end">
                            <span className="text-sm font-bold text-slate-900">{user?.name}</span>
                            <span className="text-[10px] uppercase font-black tracking-wider text-primary">
                                {user?.isAdmin ? 'Administrator' : `ชั้นปี ${user?.year}`}
                            </span>
                        </div>

                        <div className="relative">
                            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center border border-slate-200 text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer">
                                <UserIcon className="w-5 h-5" />
                            </div>
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
                        </div>

                        <button
                            onClick={handleLogout}
                            className="p-2.5 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all"
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
