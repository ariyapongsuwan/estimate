import Link from 'next/link'
import prisma from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import Navbar from '@/components/Navbar'
import { ArrowRight, Star, MessageSquare, CheckCircle2 } from 'lucide-react'

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
        <main className="min-h-screen bg-dot pt-32 pb-16 px-6">
            <Navbar user={session} />

            <div className="max-w-6xl mx-auto space-y-10">
                <header className="box-container p-10 bg-white">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                        <div className="space-y-4">
                            <span className="badge-academic">Registry Catalog</span>
                            <h1 className="text-4xl font-black text-[#4a3f3a] tracking-tighter uppercase">รายการโครงงาน</h1>
                            <p className="text-soft font-medium max-w-md">
                                กรุณาเลือกโครงงานจากรายการด้านล่างเพื่อดำเนินการประเมินผลตามเกณฑ์ที่กำหนด
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] font-black text-accent uppercase tracking-[0.2em] mb-1">Total Entities</p>
                            <p className="text-3xl font-black text-[#4a3f3a] tabular-nums">{projects.length}</p>
                        </div>
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {projects.map((project) => {
                        const evaluation = project.evaluations[0]
                        const hasEvaluated = !!evaluation

                        return (
                            <div key={project.id} className="minimal-card flex flex-col bg-white">
                                <div className="box-header flex items-center justify-between">
                                    <span className="text-[10px] font-black text-accent tracking-widest uppercase">{project.id.split('-')[0]}</span>
                                    {hasEvaluated && (
                                        <div className="flex items-center gap-1 text-[#d9a0a6]">
                                            <CheckCircle2 className="w-4 h-4" />
                                            <span className="text-[10px] font-black uppercase tracking-tighter">Evaluated</span>
                                        </div>
                                    )}
                                </div>

                                <div className="box-content flex-1 space-y-6">
                                    <div className="space-y-2">
                                        <h3 className="text-xl font-black text-[#4a3f3a] leading-tight uppercase">
                                            {project.name}
                                        </h3>
                                        <div className="h-1.5 w-10 bg-[#e9d4cd] rounded-full" />
                                    </div>

                                    <p className="text-soft text-sm font-medium line-clamp-3 leading-relaxed">
                                        {project.description}
                                    </p>

                                    {hasEvaluated && (
                                        <div className="flex items-center justify-between bg-[#f8f1ee] px-4 py-3 rounded-[4px] border border-border">
                                            <div className="flex flex-col">
                                                <span className="text-[9px] font-black text-accent uppercase tracking-tighter leading-none mb-1">Score Given</span>
                                                <div className="flex items-center gap-1">
                                                    <Star className="w-3 h-3 text-[#d9a0a6] fill-[#d9a0a6]" />
                                                    <span className="text-lg font-black text-[#4a3f3a]">{evaluation.score}</span>
                                                </div>
                                            </div>
                                            <MessageSquare className={`w-4 h-4 ${evaluation.comment ? 'text-accent' : 'text-accent/20'}`} />
                                        </div>
                                    )}
                                </div>

                                <div className="box-footer">
                                    <Link
                                        href={`/evaluate/${project.id}`}
                                        className={`w-full py-4 text-[11px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all group ${hasEvaluated ? 'text-[#4a3f3a] hover:bg-[#f8f1ee]' : 'btn-minimal'}`}
                                    >
                                        {hasEvaluated ? 'Modify Entry' : 'Begin Evaluation'}
                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1" />
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
