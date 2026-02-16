import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function POST(req: NextRequest) {
    const session = await getSession()
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const { projectId, score, comment } = await req.json()

        if (!projectId || score === undefined) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        const evaluation = await prisma.evaluation.upsert({
            where: {
                projectId_evaluatorId: {
                    projectId,
                    evaluatorId: session.id
                }
            },
            update: {
                score: parseInt(score),
                comment: comment || ''
            },
            create: {
                projectId,
                evaluatorId: session.id,
                score: parseInt(score),
                comment: comment || ''
            }
        })

        return NextResponse.json({ success: true, evaluation })
    } catch (error) {
        console.error('Evaluation error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
