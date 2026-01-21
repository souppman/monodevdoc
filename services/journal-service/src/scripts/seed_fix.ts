
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const userId = 'souppman';
    const projectId = 'proj-test-1';

    // Upsert User
    const user = await prisma.user.upsert({
        where: { email: 'ryan@example.com' }, // Assuming email is unique key, checking schema...
        update: {},
        create: {
            id: userId,
            email: 'ryan@example.com',
            name: 'Ryan Campbell',
        },
    });
    console.log('User ensure:', user);

    // Upsert Project
    const project = await prisma.project.upsert({
        where: { id: projectId },
        update: {},
        create: {
            id: projectId,
            name: 'Test Project',
            repoUrl: 'https://github.com/souppman/monodevdoc',
            ownerId: userId,
        },
    });
    console.log('Project ensure:', project);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
