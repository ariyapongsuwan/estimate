'use client'

import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { LogOut, Home, LayoutDashboard, User as UserIcon } from 'lucide-react'
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
        <nav className="fixed top-0 left-0 right-0 z-50 p-6">
            <div className="max-w-7xl mx-auto minimal-card px-8 py-4 flex items-center justify-between border-white/20 bg-white/70 backdrop-blur-md shadow-sm">
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="w-10 h-10 rounded-2xl bg-[#d9a0a6] flex items-center justify-center shadow-md shadow-[#d9a0a6]/20 group-hover:scale-105 transition-transform">
                        <LayoutDashboard className="w-6 h-6 text-white" />
                    </div>
                    <span className="font-bold text-xl tracking-tight text-[#4a3f3a]">ProjectEval</span>
                </Link>

                <div className="flex items-center gap-8">
                    <div className="hidden md:flex items-center gap-6 mr-4 border-r border-[#d8c2b7]/50 pr-8">
                        <Link
                            href="/"
                            className={`flex items-center gap-2 text-sm font-bold transition-all ${isActive('/') ? 'text-[#d9a0a6]' : 'text-soft hover:text-[#4a3f3a]'}`}
                        >
                            <Home className="w-4 h-4" />
                            หน้าแรก
                        </Link>

                        {user?.isAdmin && (
                            <Link
                                href="/admin"
                                className={`flex items-center gap-2 text-sm font-bold transition-all ${isActive('/admin') ? 'text-[#d9a0a6]' : 'text-soft hover:text-[#4a3f3a]'}`}
                            >
                                <LayoutDashboard className="w-4 h-4" />
                                แผงจัดการ
                            </Link>
                        )}
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="hidden lg:flex flex-col items-end">
                            <span className="text-sm font-black text-[#4a3f3a]">{user?.name}</span>
                            <span className="text-[10px] uppercase tracking-widest font-bold text-accent">
                                {user?.isAdmin ? 'Administrator' : `Year ${user?.year}`}
                            </span>
                        </div>

                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center border border-[#d8c2b7] text-accent">
                            <UserIcon className="w-5 h-5" />
                        </div>

                        <button
                            onClick={handleLogout}
                            className="p-2.5 rounded-xl hover:bg-red-50 text-soft hover:text-red-400 transition-all ml-2"
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
