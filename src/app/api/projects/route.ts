import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function GET(req: NextRequest) {
    const session = await getSession()
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const projects = await prisma.project.findMany({
            include: {
                evaluations: {
                    where: { evaluatorId: session.id }
                }
            },
            orderBy: { createdAt: 'desc' }
        })

        const result = projects.map(project => ({
            ...project,
            userEvaluation: project.evaluations[0] || null,
            evaluations: undefined // Remove the array to match the frontend expectations
        }))

        return NextResponse.json(result)
    } catch (error) {
        console.error('Projects fetch error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

export async function POST(req: NextRequest) {
    const session = await getSession()
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const { name, description } = await req.json()

        if (!name) {
            return NextResponse.json({ error: 'Project name is required' }, { status: 400 })
        }

        const project = await prisma.project.create({
            data: {
                name,
                description: description || ''
            }
        })

        return NextResponse.json(project)
    } catch (error) {
        console.error('Project creation error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
