import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { setSession } from '@/lib/auth'

export async function POST(req: NextRequest) {
    try {
        const { name, studentId, year } = await req.json()

        if (!name || !studentId || !year) {
            return NextResponse.json({ error: 'Please fill in all fields' }, { status: 400 })
        }

        // Upsert user (if studentId exists, update name/year, otherwise create)
        // For admin, we already seeded 'admin' studentId.
        const user = await prisma.user.upsert({
            where: { studentId },
            update: { name, year: parseInt(year) },
            create: {
                name,
                studentId,
                year: parseInt(year),
                isAdmin: studentId.toLowerCase() === 'admin' // Simple admin check for this project
            },
        })

        await setSession({
            id: user.id,
            name: user.name,
            studentId: user.studentId,
            year: user.year,
            isAdmin: user.isAdmin
        })

        return NextResponse.json({ success: true, isAdmin: user.isAdmin })
    } catch (error) {
        console.error('Login error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
