export interface GitMetadata {
    git_commit_hash: string;
    git_branch: string;
    file_path?: string;
    author_id: string;
    repo_url: string;
}

export interface RAGIndexRequest {
    content: string;
    metadata: {
        id: string;
        source: 'journal' | 'code_file' | 'commit_message';
        project_id: string;
        created_at: string; // ISOString
        linked_jira_issue?: string;
    } & GitMetadata;
}

export interface JournalEntryWithGitContext {
    id: string;
    content: string;
    created_at: string;
    updated_at: string;
    author_id: string;
    project_id: string;
    git_context: GitMetadata;
    linked_issues?: string[];
    tags?: string[];
}

// BFF Types
export interface ProjectMeta {
    id: string;
    name: string;
    repo_url: string;
    last_indexed_at: string;
}

export interface GitCommit {
    hash: string;
    message: string;
    author: string;
    date: string;
}

export interface DocSection {
    id: string;
    title: string;
    content: string;
    relevance_score?: number;
}

export interface BFFProjectDashboardResponse {
    project: ProjectMeta;
    recent_commits: GitCommit[];
    journal_entries: JournalEntryWithGitContext[];
    documentation: DocSection[];
}

export interface BFFProjectDashboardRequest {
    project_id: string;
    user_id: string;
}

// RAG Service Contracts
export interface RAGQueryRequest {
    query: string;
    project_id: string;
    filters?: {
        file_path?: string;
        git_branch?: string;
        author_id?: string;
        time_range?: {
            start: string;
            end: string;
        };
    };
    user_id?: string; // For personalized results
}

export interface RAGQueryResponse {
    results: {
        content: string;
        source: 'journal' | 'code' | 'general';
        metadata: any;
    }[];
    generated_answer: string;
}

// Journal Service Contracts
export interface GetJournalEntriesRequest {
    project_id?: string;
    git_commit_hash?: string;
    author_id?: string;
    limit?: number;
    offset?: number;
}
