import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function GET() {
    const session = await getSession()
    if (!session || !session.isAdmin) {
        return new NextResponse('Unauthorized', { status: 401 })
    }

    try {
        const evaluations = await prisma.evaluation.findMany({
            include: {
                project: { select: { name: true } },
                evaluator: { select: { name: true, studentId: true, year: true } }
            },
            orderBy: { createdAt: 'desc' }
        })

        // Create CSV header
        let csv = '\uFEFF' // BOM for Excel UTF-8 support
        csv += 'ชื่อผู้ประเมิน,รหัสนักศึกษา,ชั้นปี,โครงงานที่ประเมิน,คะแนน,ความเห็น,วันที่ประเมิน\n'

        // Add rows
        evaluations.forEach(ev => {
            const row = [
                ev.evaluator.name,
                ev.evaluator.studentId,
                ev.evaluator.year,
                ev.project.name,
                ev.score,
                `"${(ev.comment || '').replace(/"/g, '""')}"`, // Escape quotes for CSV
                new Date(ev.createdAt).toLocaleString('th-TH')
            ].join(',')
            csv += row + '\n'
        })

        const response = new NextResponse(csv)
        response.headers.set('Content-Type', 'text/csv; charset=utf-8')
        response.headers.set('Content-Disposition', 'attachment; filename=project_evaluations.csv')

        return response
    } catch (error) {
        console.error('Export error:', error)
        return new NextResponse('Internal server error', { status: 500 })
    }
}
