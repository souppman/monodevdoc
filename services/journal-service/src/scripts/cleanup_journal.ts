
import prisma from '../prisma';

async function cleanup() {
    console.log('Cleaning up all journal entries...');
    // We only delete entries, not users or projects for safety, though typically those trickle down or are separate.
    // Assuming simple deletion of JournalEntry rows.

    const { count } = await prisma.journalEntry.deleteMany({});

    console.log(`Deleted ${count} journal entries.`);
}

cleanup()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
