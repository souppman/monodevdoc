
import { FSWatcher } from 'chokidar';
import chokidar from 'chokidar';
import path from 'path';
import fs from 'fs';
import axios from 'axios';
import pino from 'pino';
import { RAGIndexRequest } from 'devdoc-contracts';
import ignore from 'ignore';

const logger = pino({ level: process.env.LOG_LEVEL || 'info' });
const RAG_SERVICE_URL = process.env.RAG_SERVICE_URL || 'http://127.0.0.1:8000';
const PROJECT_ID = 'monodevdoc_local';

// Target the monorepo root (assuming service is running in services/journal-service/src/...)
const REPO_ROOT = path.resolve(__dirname, '../../../../');

export const fileWatcher = {
    watcher: null as FSWatcher | null,

    start: () => {
        logger.info(`Starting FileWatcher at ${REPO_ROOT}...`);

        // Load .gitignore to respect exclusions
        const ig = ignore();
        try {
            const gitignorePath = path.join(REPO_ROOT, '.gitignore');
            if (fs.existsSync(gitignorePath)) {
                ig.add(fs.readFileSync(gitignorePath, 'utf-8'));
            }
        } catch (e) {
            logger.warn('Could not load .gitignore for watcher, using defaults.');
        }

        // Add standard ignores
        ig.add(['.git', 'node_modules', 'dist', 'build', 'coverage', '.next', 'venv', '__pycache__']);

        const ignored = (filePath: string) => {
            const relPath = path.relative(REPO_ROOT, filePath);
            if (!relPath) return false;
            return ig.ignores(relPath) || relPath.includes('node_modules') || relPath.startsWith('.git');
        };

        const watcher = chokidar.watch(REPO_ROOT, {
            ignored: ignored,
            persistent: true,
            ignoreInitial: true, // Don't index everything on start (assume reindex script handled it or lazy load)
            awaitWriteFinish: {
                stabilityThreshold: 2000,
                pollInterval: 100
            }
        });

        watcher
            .on('add', path => {
                logger.info(`File added: ${path}`);
                indexFile(path);
            })
            .on('change', path => {
                logger.info(`File changed: ${path}`);
                indexFile(path);
            })
            .on('error', error => logger.error(`Watcher error: ${error}`));

        logger.info('FileWatcher is now robustly watching for changes.');
    }
};

async function indexFile(filePath: string) {
    // Only index text-based source files
    const ext = path.extname(filePath);
    if (!['.ts', '.tsx', '.js', '.jsx', '.py', '.md', '.json', '.prisma', '.css', '.html'].includes(ext)) {
        return;
    }

    try {
        const content = fs.readFileSync(filePath, 'utf-8');
        const relativePath = path.relative(REPO_ROOT, filePath);

        if (!content.trim()) return;

        const ragPayload: RAGIndexRequest = {
            content: content,
            metadata: {
                id: `file:${relativePath}`,
                source: 'code_file',
                project_id: PROJECT_ID,
                created_at: new Date().toISOString(),
                git_branch: 'HEAD',
                git_commit_hash: 'HEAD',
                file_path: relativePath,
                author_id: 'auto_watcher',
                repo_url: 'local',
            },
        };

        await axios.post(`${RAG_SERVICE_URL}/index`, ragPayload);
        logger.info(`Auto-indexed change: ${relativePath}`);
    } catch (error: any) {
        logger.error({ err: error.message, file: filePath }, 'Failed to auto-index changed file');
    }
}
