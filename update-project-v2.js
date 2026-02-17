const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    const id = '4d17a5d2-98e8-44ef-8423-19acd60c1f9e'
    const newName = 'เว็บแอปพลิเคชั่น "แอ็ดลีสท์" เกมคลายเครียด'
    const newDesc = 'เว็บแอปพลิเคชั่นเกมคลายเครียดที่ออกแบบมาเพื่อช่วยผ่อนคลายและลดความกังวลจากการทำงานหรือการเรียน'

    await prisma.project.update({
        where: { id },
        data: {
            name: newName,
            description: newDesc
        }
    })
    console.log(`Successfully updated project to: ${newName}`)
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect())
