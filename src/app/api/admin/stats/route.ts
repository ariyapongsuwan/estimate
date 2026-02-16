import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function GET() {
    const session = await getSession()
    if (!session || !session.isAdmin) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        // 1. Fetch all projects with their evaluations
        const projectsData = await prisma.project.findMany({
            include: {
                evaluations: true
            }
        })

        const projectStats = projectsData.map(p => {
            const avgScore = p.evaluations.length > 0
                ? p.evaluations.reduce((acc, curr) => acc + curr.score, 0) / p.evaluations.length
                : 0

            return {
                id: p.id,
                name: p.name,
                evaluationCount: p.evaluations.length,
                averageScore: parseFloat(avgScore.toFixed(2))
            }
        }).sort((a, b) => b.averageScore - a.averageScore)

        // 2. Fetch all evaluations with evaluator names (Admin view)
        const allEvaluations = await prisma.evaluation.findMany({
            include: {
                project: { select: { name: true } },
                evaluator: { select: { name: true, studentId: true, year: true } }
            },
            orderBy: { createdAt: 'desc' }
        })

        // 3. Overall Stats
        const totalStudents = await prisma.user.count({ where: { isAdmin: false } })
        const evaluatedCount = await prisma.user.count({
            where: {
                evaluations: { some: {} },
                isAdmin: false
            }
        })

        return NextResponse.json({
            projectStats,
            allEvaluations,
            summary: {
                totalStudents,
                evaluatedCount,
                percentComplete: totalStudents > 0 ? (evaluatedCount / totalStudents * 100).toFixed(1) : 0
            }
        })
    } catch (error) {
        console.error('Admin stats error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
