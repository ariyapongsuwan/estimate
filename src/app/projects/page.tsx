import prisma from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import Navbar from '@/components/Navbar'
import Link from 'next/link'
import { ArrowRight, Star, MessageSquare, CheckCircle2 } from 'lucide-react'

export default async function ProjectsPage() {
    const session = await getSession()
    if (!session) return null

    // Fetch projects and their evaluation status for this user
    const projects = await prisma.project.findMany({
        include: {
            evaluations: {
                where: { evaluatorId: session.id }
            }
        },
        orderBy: { createdAt: 'asc' }
    })

    return (
        <main className="min-h-screen pt-24 pb-12 px-6">
            <Navbar user={session} />

            <div className="max-w-6xl mx-auto space-y-10">
                <div>
                    <h1 className="text-4xl font-bold glow-text mb-2">เลือกโครงงาน</h1>
                    <p className="text-slate-400">เลือกโครงงานที่คุณต้องการให้คะแนน</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map((project) => {
                        const hasEvaluated = project.evaluations.length > 0
                        const evaluation = project.evaluations[0]

                        return (
                            <div
                                key={project.id}
                                className={`glass-card p-6 flex flex-col h-full border-white/5 transition-all hover:border-primary/30 relative overflow-hidden group ${hasEvaluated ? 'opacity-90' : ''}`}
                            >
                                {hasEvaluated && (
                                    <div className="absolute top-0 right-0 bg-green-500/20 text-green-400 px-3 py-1 text-xs font-bold rounded-bl-xl border-l border-b border-green-500/30 flex items-center gap-1 z-10">
                                        <CheckCircle2 className="w-3 h-3" />
                                        ประเมินแล้ว
                                    </div>
                                )}

                                <div className="flex-grow space-y-4">
                                    <div className="space-y-2">
                                        <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors">
                                            {project.name}
                                        </h3>
                                        <p className="text-sm text-slate-400 line-clamp-3">
                                            {project.description || 'ไม่มีคำอธิบายโครงงาน'}
                                        </p>
                                    </div>

                                    {hasEvaluated && (
                                        <div className="flex gap-4 pt-2">
                                            <div className="flex items-center gap-1.5 text-yellow-400">
                                                <Star className="w-4 h-4 fill-yellow-400" />
                                                <span className="text-sm font-bold">{evaluation.score}/10</span>
                                            </div>
                                            {evaluation.comment && (
                                                <div className="flex items-center gap-1.5 text-slate-400">
                                                    <MessageSquare className="w-4 h-4" />
                                                    <span className="text-sm">มีความเห็น</span>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                <div className="pt-6">
                                    <Link
                                        href={`/evaluate/${project.id}`}
                                        className={`w-full py-2.5 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all ${hasEvaluated
                                            ? 'bg-white/10 text-white hover:bg-white/20'
                                            : 'btn-primary'
                                            }`}
                                    >
                                        {hasEvaluated ? 'แก้ไขการประเมิน' : 'เริ่มประเมิน'}
                                        <ArrowRight className="w-4 h-4" />
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
