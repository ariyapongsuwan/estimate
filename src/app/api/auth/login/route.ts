import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { setSession } from '@/lib/auth'

export async function POST(req: NextRequest) {
    try {
        const { name, studentId, year, password } = await req.json()

        if (!name || !studentId || !year) {
            return NextResponse.json({ error: 'Please fill in all fields' }, { status: 400 })
        }

        // Specific Admin Check
        const isAdminLogin = name === 'admin' && password === '00000000'

        let user;
        if (isAdminLogin) {
            user = await prisma.user.upsert({
                where: { studentId: 'admin-system' },
                update: { name: 'Admin', isAdmin: true },
                create: {
                    name: 'Admin',
                    studentId: 'admin-system',
                    year: 4,
                    isAdmin: true
                },
            })
        } else {
            // Prevent other users from using 'admin-system' ID
            if (studentId === 'admin-system') {
                return NextResponse.json({ error: 'Invalid Student ID' }, { status: 400 })
            }

            // Upsert student user
            user = await prisma.user.upsert({
                where: { studentId },
                update: { name, year: parseInt(year) },
                create: {
                    name,
                    studentId,
                    year: parseInt(year),
                    isAdmin: false
                },
            })
        }

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
