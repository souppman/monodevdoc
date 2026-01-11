
import axios from 'axios';
import { RAGIndexRequest } from 'devdoc-contracts';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';
import ignore from 'ignore';

// Load env from service root
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const RAG_SERVICE_URL = process.env.RAG_SERVICE_URL || 'http://127.0.0.1:8000';
// Target the monorepo root. Since we are in services/journal-service/src/scripts, we go up 4 levels.
// services/journal-service/src/scripts -> services/journal-service/src -> services/journal-service -> services -> root
const REPO_ROOT = path.resolve(__dirname, '../../../../');
const PROJECT_ID = 'monodevdoc_local'; // Static ID for this local ingestion

// Configure ignore rules
const ig = ignore().add([
    '.git',
    'node_modules',
    'dist',
    'build',
    'coverage',
    '.next',
    'venv',
    '__pycache__',
    '*.log',
    '.DS_Store',
    '.env',
    '.env.*',
    'pnpm-lock.yaml',
    'package-lock.json',
    'yarn.lock'
]);

// Also try to load root .gitignore
try {
    const gitignorePath = path.join(REPO_ROOT, '.gitignore');
    if (fs.existsSync(gitignorePath)) {
        ig.add(fs.readFileSync(gitignorePath, 'utf-8'));
    }
} catch (e) {
    console.warn('Could not load root .gitignore, using defaults.');
}

async function indexFile(filePath: string) {
    try {
        const content = fs.readFileSync(filePath, 'utf-8');
        const relativePath = path.relative(REPO_ROOT, filePath);

        // Skip empty files or binary-looking files (simple heuristic)
        if (!content.trim() || content.includes('\0')) {
            return;
        }

        const ragPayload: RAGIndexRequest = {
            content: content,
            metadata: {
                id: `file:${relativePath}`,
                source: 'code_file',
                project_id: PROJECT_ID,
                created_at: new Date().toISOString(),
                git_branch: 'HEAD',
                git_commit_hash: 'HEAD', // Could retrieve real hash if needed
                file_path: relativePath,
                author_id: 'local_indexer',
                repo_url: 'local',
            },
        };

        await axios.post(`${RAG_SERVICE_URL}/index`, ragPayload);
        console.log(`Indexed: ${relativePath}`);
    } catch (error: any) {
        console.error(`Failed to index ${filePath}: ${error.message}`);
    }
}

async function walkAndIndex(dir: string) {
    const files = fs.readdirSync(dir);

    for (const file of files) {
        const fullPath = path.join(dir, file);
        const relativePath = path.relative(REPO_ROOT, fullPath);

        if (ig.ignores(relativePath)) {
            continue;
        }

        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            await walkAndIndex(fullPath);
        } else if (stat.isFile()) {
            // Only index known text extensions
            const ext = path.extname(file);
            if (['.ts', '.tsx', '.js', '.jsx', '.py', '.md', '.json', '.prisma', '.yml', '.yaml', '.css', '.html'].includes(ext)) {
                await indexFile(fullPath);
            }
        }
    }
}

async function main() {
    console.log(`Starting index of repo at: ${REPO_ROOT}`);
    console.log(`Target RAG Service: ${RAG_SERVICE_URL}`);

    await walkAndIndex(REPO_ROOT);

    console.log('Repo indexing complete.');
}

main().catch(console.error);
