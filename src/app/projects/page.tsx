import Link from 'next/link'
import prisma from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import Navbar from '@/components/Navbar'
import { ArrowRight, Star, MessageSquare, CheckCircle2, ListFilter, ClipboardList } from 'lucide-react'

export default async function ProjectsPage() {
    const session = await getSession()
    if (!session) return null

    const projects = await prisma.project.findMany({
        include: {
            evaluations: {
                where: { evaluatorId: session.id }
            }
        },
        orderBy: { createdAt: 'asc' }
    })

    return (
        <main className="min-h-screen pt-32 pb-16 px-6 relative bg-[#f1e4de]">
            <Navbar user={session} />
            <div className="bg-dot" />

            <div className="max-w-6xl mx-auto space-y-10 relative z-10">
                <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b-4 border-[#4a3f3a] pb-8">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 text-[10px] font-black text-accent uppercase tracking-[0.2em] border border-border px-3 py-1 bg-white/50 rounded-md">
                            <ClipboardList className="w-3.5 h-3.5" />
                            Project Catalog
                        </div>
                        <div className="space-y-1">
                            <h1 className="text-5xl font-black text-[#4a3f3a] uppercase tracking-tight">โครงการที่เปิดรับ</h1>
                            <p className="text-soft font-medium text-lg leading-relaxed">กรุณาประเมินผลโครงงานวิชาการทุกรายการตามเกณฑ์ที่กำหนด</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 text-xs font-black text-white px-6 py-3 bg-[#4a3f3a] rounded-lg shadow-xl shadow-[#4a3f3a]/10">
                        <ListFilter className="w-4 h-4" />
                        TOTAL: {projects.length} PROJECTS
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-4">
                    {projects.map((project) => {
                        const evaluation = project.evaluations[0]
                        const hasEvaluated = !!evaluation

                        return (
                            <div
                                key={project.id}
                                className="box-container flex flex-col h-full bg-white group hover:shadow-2xl transition-all duration-300"
                            >
                                <div className={`box-header flex items-center justify-between border-b-2 ${hasEvaluated ? 'border-[#d9a0a6]/20 bg-[#d9a0a6]/5' : 'border-border'}`}>
                                    <h4 className="text-[10px] font-black text-accent uppercase tracking-widest">{project.id.split('-')[0]}</h4>
                                    {hasEvaluated && (
                                        <div className="flex items-center gap-1.5 text-[#d9a0a6] px-2.5 py-1 bg-white border border-[#d9a0a6]/30 rounded-full text-[10px] font-black uppercase tracking-tighter">
                                            <CheckCircle2 className="w-3 h-3" />
                                            Completed
                                        </div>
                                    )}
                                </div>

                                <div className="box-content flex-1 space-y-6">
                                    <div className="space-y-2">
                                        <h3 className="text-2xl font-black text-[#4a3f3a] leading-tight group-hover:text-[#d9a0a6] transition-colors line-clamp-2">
                                            {project.name}
                                        </h3>
                                        <div className="h-1 w-12 bg-accent/20 group-hover:w-24 group-hover:bg-[#d9a0a6] transition-all duration-500" />
                                    </div>

                                    <p className="text-soft text-sm font-medium line-clamp-4 leading-relaxed bg-[#f8f1ee]/30 p-4 rounded-lg italic">
                                        "{project.description}"
                                    </p>

                                    {hasEvaluated && (
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="bg-[#f8f1ee] p-3 rounded-lg border border-border/50 text-center">
                                                <p className="text-[9px] font-black text-accent uppercase tracking-widest mb-1">Your Score</p>
                                                <div className="flex items-center justify-center gap-1.5 text-[#d9a0a6]">
                                                    <Star className="w-3.5 h-3.5 fill-[#d9a0a6]" />
                                                    <span className="text-lg font-black">{evaluation.score}</span>
                                                </div>
                                            </div>
                                            <div className="bg-[#f8f1ee] p-3 rounded-lg border border-border/50 text-center">
                                                <p className="text-[9px] font-black text-accent uppercase tracking-widest mb-1">Feedback</p>
                                                <div className="flex items-center justify-center gap-1.5 text-accent">
                                                    <MessageSquare className="w-3.5 h-3.5" />
                                                    <span className="text-[10px] font-black">{evaluation.comment ? 'PROVIDED' : 'NONE'}</span>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="box-footer p-4">
                                    <Link
                                        href={`/evaluate/${project.id}`}
                                        className={`w-full py-4 rounded-lg font-black text-[11px] uppercase tracking-widest flex items-center justify-center gap-3 transition-all border-2 ${hasEvaluated
                                                ? 'bg-transparent text-[#4a3f3a] border-[#4a3f3a] hover:bg-[#4a3f3a] hover:text-white'
                                                : 'btn-minimal'
                                            }`}
                                    >
                                        {hasEvaluated ? 'แก้ไขคะแนน' : 'เริ่มประเมินผล'}
                                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                                    </Link>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </main>
    )
}
