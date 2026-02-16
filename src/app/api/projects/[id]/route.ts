import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    const session = await getSession()
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    try {
        const project = await prisma.project.findUnique({
            where: { id },
            include: {
                evaluations: {
                    where: { evaluatorId: session.id }
                }
            }
        })

        if (!project) {
            return NextResponse.json({ error: 'Project not found' }, { status: 404 })
        }

        const result = {
            ...project,
            myEvaluation: project.evaluations[0] || null
        }

        // @ts-ignore
        delete result.evaluations

        return NextResponse.json(result)
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
