const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const projects = [
        { name: 'Smart Farm System', description: 'IOT system for monitoring soil moisture and automatic watering.' },
        { name: 'Mobile App for Health Tracking', description: 'Track steps, sleep, and heart rate with interactive charts.' },
        { name: 'E-commerce Platform', description: 'A full-stack online store with payment integration and inventory management.' },
        { name: 'AI Image Classifier', description: 'Web app that identifies objects in images using deep learning.' },
        { name: 'Blockchain Voting System', description: 'Secure and transparent voting system using smart contracts.' },
    ];

    console.log('Cleaning up database...');
    await prisma.evaluation.deleteMany();
    await prisma.project.deleteMany();
    await prisma.user.deleteMany();

    console.log('Seeding projects...');
    for (const p of projects) {
        await prisma.project.create({
            data: p,
        });
    }

    // Add an admin user
    await prisma.user.create({
        data: {
            name: 'Admin User',
            studentId: 'admin',
            year: 4,
            isAdmin: true,
        },
    });

    console.log('Seed completed!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
