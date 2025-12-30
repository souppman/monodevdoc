import { fetchFileContent } from '../../src/services/githubService';
// @ts-ignore
import { mockGetContent } from '@octokit/rest';

// No jest.mock('@octokit/rest') needed because of moduleNameMapper

describe('fetchFileContent', () => {
    const mockContent = 'Hello World';
    const mockBase64 = Buffer.from(mockContent).toString('base64');

    beforeEach(() => {
        mockGetContent.mockReset();
    });

    it('should fetch and decode file content', async () => {
        mockGetContent.mockResolvedValue({
            data: {
                content: mockBase64
            }
        });

        const result = await fetchFileContent('owner', 'repo', 'path/to/file.ts', 'main');

        expect(result).toBe(mockContent);
        expect(mockGetContent).toHaveBeenCalledWith({
            owner: 'owner',
            repo: 'repo',
            path: 'path/to/file.ts',
            ref: 'main'
        });
    });

    it('should return null if content is missing or invalid', async () => {
        mockGetContent.mockResolvedValue({
            data: {} // No content
        });

        const result = await fetchFileContent('owner', 'repo', 'file.ts', 'main');
        expect(result).toBeNull();
    });

    it('should return null on API error', async () => {
        mockGetContent.mockRejectedValue(new Error('API Error'));

        const result = await fetchFileContent('owner', 'repo', 'path', 'ref');
        expect(result).toBeNull();
    });
});
